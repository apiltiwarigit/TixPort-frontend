'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBraintree } from './BraintreeProvider'
import { 
  CreditCardIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import dropin, { DropinInstance } from 'braintree-web-drop-in'
import api from '@/lib/api'

interface CartItem {
  ticketGroupId: number;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  section: string;
  row: string;
  quantity: number;
  pricePerTicket: number;
  totalPrice: number;
  format: string;
}

interface CartSummary {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

interface CartCheckoutFormV9Props {
  cartData: {
    items: CartItem[];
    summary: CartSummary;
  };
  onSuccess: (orderData: unknown) => void;
  onError: (error: string) => void;
}

interface DeliveryOption {
  type: string;
  cost: number;
  description: string;
}

export default function CartCheckoutFormV9({ cartData, onSuccess, onError }: CartCheckoutFormV9Props) {
  const { clientToken, refreshClientToken, loading: braintreeLoading } = useBraintree()
  const dropinRef = useRef<HTMLDivElement>(null)
  const dropinInstance = useRef<DropinInstance | null>(null)
  
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null)
  const [taxAmount, setTaxAmount] = useState(0)
  const [, setTaxSignature] = useState<string | null>(null)
  const [clientId, setClientId] = useState<number | null>(null)
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    billingAddress: {
      line1: '',
      city: '',
      state: '',
      postalCode: ''
    }
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Calculate order totals with delivery and tax
  const subtotal = cartData.summary.subtotal
  const deliveryCost = selectedDelivery?.cost || cartData.summary.deliveryFee
  const totalAmount = subtotal + cartData.summary.serviceFee + deliveryCost + taxAmount - cartData.summary.discount

  // Get session ID for Riskified fraud protection
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined' && (window as { riskifiedSessionId?: string }).riskifiedSessionId) {
      return (window as unknown as { riskifiedSessionId: string }).riskifiedSessionId
    }
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })

  const calculateOrderDetails = useCallback(async () => {
    try {
      setLoading(true)
      
      // For cart checkout, use the first item for delivery calculation
      const primaryItem = cartData.items[0]
      
      const response = await api.post(
        `/checkout/calculate`,
        {
          ticketGroupId: primaryItem.ticketGroupId,
          quantity: primaryItem.quantity,
          retailUnitPrice: primaryItem.pricePerTicket,
          shippingAddress: formData.billingAddress.line1 ? {
            line1: formData.billingAddress.line1,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.postalCode || formData.zipCode,
            country_code: 'US'
          } : null
        }
      )

      if (response.data.success) {
        const { shippingOptions, taxQuote } = response.data.data
        setDeliveryOptions(shippingOptions || [])
        setSelectedDelivery(shippingOptions?.[0] || null)
        
        if (taxQuote) {
          // For cart, calculate tax based on total subtotal
          const taxRate = taxQuote.tax_amount / primaryItem.pricePerTicket
          const cartTax = subtotal * taxRate
          setTaxAmount(cartTax)
          setTaxSignature(taxQuote.signature)
        }
      }
    } catch (error: unknown) {
      console.error('Failed to calculate order details:', error)
      onError('Failed to calculate order details')
    } finally {
      setLoading(false)
    }
  }, [cartData.items, formData.billingAddress, formData.zipCode, subtotal, onError])

  // Create TEvo client when form data is complete (guarded to avoid repeats)
  const isCreatingClientRef = useRef(false)
  const hasCreatedClientRef = useRef(false)
  const createTevoClient = useCallback(async () => {
    if (hasCreatedClientRef.current || isCreatingClientRef.current) return
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) return

    isCreatingClientRef.current = true
    try {
      const response = await api.post(
        `/checkout/client`,
        {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.billingAddress.line1 ? {
            line1: formData.billingAddress.line1,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.postalCode || formData.zipCode,
            country_code: 'US'
          } : null
        }
      )

      if (response.data.success) {
        const newClientId = response.data.data.clientId
        setClientId(newClientId)
        hasCreatedClientRef.current = true
        
        // Get Braintree client token
        await refreshClientToken(newClientId)
      }
    } catch (error: unknown) {
      console.error('Failed to create TEvo client:', error)
    } finally {
      isCreatingClientRef.current = false
    }
  }, [formData, refreshClientToken])

  // Initialize Braintree Drop-in when we have a client token
  useEffect(() => {
    if (clientToken && dropinRef.current && !dropinInstance.current) {
      const initializeDropin = async () => {
        try {
          dropinInstance.current = await dropin.create({
            authorization: clientToken,
            container: dropinRef.current!,
            threeDSecure: true,
            card: {
              overrides: {
                fields: {
                  number: {
                    placeholder: '4111 1111 1111 1111'
                  },
                  cvv: {
                    placeholder: '123'
                  },
                  expirationDate: {
                    placeholder: 'MM/YY'
                  }
                }
              }
            }
          })
        } catch (error) {
          console.error('Failed to initialize Braintree Drop-in:', error)
          onError('Failed to initialize payment form')
        }
      }

      initializeDropin()
    }

    return () => {
      if (dropinInstance.current) {
        dropinInstance.current.teardown()
        dropinInstance.current = null
      }
    }
  }, [clientToken, onError])

  // Calculate order details when dependencies change
  useEffect(() => {
    calculateOrderDetails()
  }, [calculateOrderDetails])

  // Create client when form is sufficiently filled
  useEffect(() => {
    createTevoClient()
  }, [createTevoClient])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!dropinInstance.current || processing) {
      return
    }

    if (!validateForm()) {
      onError('Please correct the form errors before submitting')
      return
    }

    if (!selectedDelivery) {
      onError('Please select a delivery option')
      return
    }

    setProcessing(true)

    try {
      // Get payment method nonce from Braintree
      const { nonce } = await dropinInstance.current.requestPaymentMethod()

      if (!nonce) {
        throw new Error('Failed to get payment method')
      }

      // For cart checkout, we'll process the first item (multi-item support would require backend changes)
      const primaryItem = cartData.items[0]

      // Prepare checkout data for v9/Braintree flow
      const checkoutData = {
        tevoClientId: clientId,
        braintreeNonce: nonce,
        ticketGroupId: primaryItem.ticketGroupId,
        quantity: primaryItem.quantity,
        retailUnitPrice: primaryItem.pricePerTicket,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: formData.billingAddress.line1 ? {
          line1: formData.billingAddress.line1,
          city: formData.billingAddress.city,
          state: formData.billingAddress.state,
          postal_code: formData.billingAddress.postalCode || formData.zipCode,
          country_code: 'US'
        } : null,
        sessionId: sessionId,
        isCartCheckout: true,
        cartItems: cartData.items.map(item => ({
          ticketGroupId: item.ticketGroupId,
          eventId: item.eventId,
          quantity: item.quantity,
          price: item.pricePerTicket
        }))
      }

      // Process checkout with backend
      const response = await api.post(
        `/checkout/process`,
        checkoutData
      )

      if (response.data.success) {
        onSuccess(response.data.data)
      } else {
        throw new Error(response.data.message || 'Checkout failed')
      }

    } catch (error: unknown) {
      console.error('Checkout error:', error)
      const errorMessage = (error as Error).message || 'An error occurred during checkout'
      onError(errorMessage)
      
      // Refresh client token for retry
      if (clientId) {
        await refreshClientToken(clientId)
      }
    } finally {
      setProcessing(false)
    }
  }

  const handleFormChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Complete Your Cart Purchase
        </h3>
        
        {/* Cart Summary */}
        <div className="bg-gray-700 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            {cartData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm text-gray-300">
                <div>
                  <div className="text-white font-medium">{item.eventTitle}</div>
                  <div>Section {item.section}, Row {item.row} - {item.quantity} ticket{item.quantity > 1 ? 's' : ''}</div>
                </div>
                <div className="text-right">
                  <div>${item.pricePerTicket.toFixed(2)} each</div>
                  <div className="text-white font-medium">${item.totalPrice.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-600 pt-2 mt-4">
            <div className="flex justify-between items-center text-white font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Service Fee</span>
              <span>${cartData.summary.serviceFee.toFixed(2)}</span>
            </div>
            {deliveryCost > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>Delivery</span>
                <span>${deliveryCost.toFixed(2)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>Tax</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
            )}
            {cartData.summary.discount > 0 && (
              <div className="flex justify-between items-center text-sm text-green-400">
                <span>Discount</span>
                <span>-${cartData.summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between items-center text-white font-bold text-lg">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buyer Information */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleFormChange('firstName', e.target.value)}
                className={formErrors.firstName ? 'border-red-500' : ''}
                required
              />
              {formErrors.firstName && (
                <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
              )}
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleFormChange('lastName', e.target.value)}
                className={formErrors.lastName ? 'border-red-500' : ''}
                required
              />
              {formErrors.lastName && (
                <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
              )}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className={formErrors.email ? 'border-red-500' : ''}
                required
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                className={formErrors.phone ? 'border-red-500' : ''}
                required
              />
              {formErrors.phone && (
                <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address (for physical tickets) */}
        {selectedDelivery?.type === 'FedEx' && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Shipping Address</h4>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Street Address"
                value={formData.billingAddress.line1}
                onChange={(e) => handleFormChange('billingAddress.line1', e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  placeholder="City"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleFormChange('billingAddress.city', e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="State"
                  value={formData.billingAddress.state}
                  onChange={(e) => handleFormChange('billingAddress.state', e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="ZIP Code"
                  value={formData.billingAddress.postalCode || formData.zipCode}
                  onChange={(e) => {
                    handleFormChange('billingAddress.postalCode', e.target.value)
                    handleFormChange('zipCode', e.target.value)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delivery Options */}
        {deliveryOptions.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Delivery Method</h4>
            <div className="space-y-2">
              {deliveryOptions.map((option) => (
                <label
                  key={option.type}
                  className="flex items-center p-3 border border-gray-600 rounded-lg cursor-pointer hover:border-purple-500"
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.type}
                    checked={selectedDelivery?.type === option.type}
                    onChange={() => setSelectedDelivery(option)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{option.description}</span>
                      <span className="text-gray-300">
                        {option.cost > 0 ? `$${option.cost.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Payment Section */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2" />
            Payment Information
          </h4>
          
          {braintreeLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-gray-300 mt-2">Loading payment form...</p>
            </div>
          )}
          
          {!braintreeLoading && !clientToken && (
            <div className="text-center py-8">
              <p className="text-gray-300">Complete the form above to load payment options</p>
            </div>
          )}
          
          <div ref={dropinRef} className="braintree-dropin" />
        </div>

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-300 bg-gray-700 p-3 rounded-lg">
          <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-400" />
          <span>Your payment information is securely processed by Braintree</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing || loading || braintreeLoading || !clientToken}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Complete Purchase - $${totalAmount.toFixed(2)}`
          )}
        </Button>
      </form>

      <style jsx>{`
        .braintree-dropin {
          background: transparent;
        }
        .braintree-dropin :global(.braintree-form__field-group) {
          background: #374151;
          border: 1px solid #4B5563;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        .braintree-dropin :global(.braintree-form__field) {
          background: transparent;
          color: white;
        }
        .braintree-dropin :global(.braintree-form__label) {
          color: #D1D5DB;
        }
      `}</style>
    </div>
  )
}
