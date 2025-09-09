'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

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

interface CartCheckoutFormProps {
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

export default function CartCheckoutForm({ cartData, onSuccess, onError }: CartCheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null)
  const [taxAmount, setTaxAmount] = useState(0)
  const [taxSignature, setTaxSignature] = useState<string | null>(null)
  
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
      
      // For cart checkout, we need to calculate for all items
      // Use the first item's event for delivery calculation
      const primaryItem = cartData.items[0]
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: parseInt(primaryItem.eventId),
          ticketGroupId: primaryItem.ticketGroupId,
          quantity: cartData.items.reduce((sum, item) => sum + item.quantity, 0),
          zipCode: formData.zipCode,
          orderAmount: subtotal
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        if (result.success) {
          setDeliveryOptions(result.data.shippingOptions || [])
          
          // Auto-select first delivery option
          if (result.data.shippingOptions && result.data.shippingOptions.length > 0 && !selectedDelivery) {
            setSelectedDelivery(result.data.shippingOptions[0])
          }
          
          // Set tax information
          if (result.data.taxQuote) {
            setTaxAmount(result.data.taxQuote.tax_amount || 0)
            setTaxSignature(result.data.taxQuote.signature)
          }
        }
      }
    } catch (error) {
      console.error('Error calculating order details:', error)
    } finally {
      setLoading(false)
    }
  }, [cartData.items, formData.zipCode, selectedDelivery, subtotal])

  // Load delivery options and calculate taxes when form data changes
  useEffect(() => {
    if (formData.zipCode && formData.zipCode.length === 5) {
      calculateOrderDetails()
    }
  }, [formData.zipCode, calculateOrderDetails])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.firstName.trim()) errors.firstName = 'First name is required'
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required'
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) errors.zipCode = 'Invalid ZIP code format'
    
    if (!selectedDelivery) errors.delivery = 'Please select a delivery option'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || processing) {
      return
    }

    if (!validateForm()) {
      onError('Please correct the form errors before submitting')
      return
    }

    setProcessing(true)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      // Create Stripe token
      const { error: tokenError, token } = await stripe.createToken(cardElement, {
        name: `${formData.firstName} ${formData.lastName}`,
        address_line1: formData.billingAddress.line1,
        address_city: formData.billingAddress.city,
        address_state: formData.billingAddress.state,
        address_zip: formData.billingAddress.postalCode || formData.zipCode,
      })

      if (tokenError) {
        throw new Error(tokenError.message || 'Payment information is invalid')
      }

      if (!token) {
        throw new Error('Failed to create payment token')
      }

      // Prepare checkout data for multiple items
      const checkoutData = {
        stripeToken: token.id,
        sessionId: sessionId,
        cartItems: cartData.items.map(item => ({
          ticketGroupId: item.ticketGroupId,
          eventId: item.eventId,
          quantity: item.quantity,
          price: item.pricePerTicket
        })),
        buyer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        delivery: {
          type: selectedDelivery!.type,
          cost: selectedDelivery!.cost,
          address: formData.billingAddress.line1 ? {
            line1: formData.billingAddress.line1,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.postalCode || formData.zipCode
          } : undefined
        },
        orderAmount: totalAmount,
        taxSignature: taxSignature,
        isCartCheckout: true
      }

      // Pull access token from stored session
      const storedSession = typeof window !== 'undefined' ? localStorage.getItem('auth_session') : null
      const accessToken = storedSession ? (JSON.parse(storedSession)?.access_token as string | undefined) : undefined

      // Process checkout with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify(checkoutData),
      })

      if (response.status === 401) {
        throw new Error('Please log in to complete checkout.');
      } else if (response.status === 403) {
        throw new Error('Your session has expired. Please log in again.');
      }

      const result = await response.json()

      if (result.success) {
        onSuccess(result.data)
      } else {
        throw new Error(result.message || 'Checkout failed')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      onError(error instanceof Error ? error.message : 'Checkout failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Order Summary</h3>
        
        <div className="space-y-3 text-sm">
          {/* Items */}
          {cartData.items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-300">
                {item.quantity}x {item.eventTitle} - Section {item.section}, Row {item.row}
              </span>
              <span className="text-white">${item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
          
          <div className="border-t border-gray-600 pt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-white">${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Service Fee</span>
              <span className="text-white">${cartData.summary.serviceFee.toFixed(2)}</span>
            </div>
            
            {selectedDelivery && deliveryCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">{selectedDelivery.description}</span>
                <span className="text-white">${deliveryCost.toFixed(2)}</span>
              </div>
            )}
            
            {taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">Tax</span>
                <span className="text-white">${taxAmount.toFixed(2)}</span>
              </div>
            )}
            
            {cartData.summary.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-300">Discount</span>
                <span className="text-green-400">-${cartData.summary.discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-green-400">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          Buyer Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => updateFormData('firstName', e.target.value)}
              error={formErrors.firstName}
              placeholder="John"
            />
          </div>
          <div>
            <Input
              label="Last Name *"
              value={formData.lastName}
              onChange={(e) => updateFormData('lastName', e.target.value)}
              error={formErrors.lastName}
              placeholder="Doe"
            />
          </div>
        </div>
        
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          error={formErrors.email}
          placeholder="john.doe@example.com"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Phone Number *"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              error={formErrors.phone}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Input
              label="ZIP Code *"
              value={formData.zipCode}
              onChange={(e) => updateFormData('zipCode', e.target.value)}
              error={formErrors.zipCode}
              placeholder="12345"
              maxLength={5}
            />
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      {deliveryOptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Delivery Method</h3>
          
          <div className="space-y-2">
            {deliveryOptions.map((option, index) => (
              <label
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedDelivery?.type === option.type
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="delivery"
                    checked={selectedDelivery?.type === option.type}
                    onChange={() => setSelectedDelivery(option)}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedDelivery?.type === option.type
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-400'
                    }`}>
                      {selectedDelivery?.type === option.type && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium">{option.description}</div>
                      <div className="text-gray-400 text-sm">{option.type}</div>
                    </div>
                  </div>
                </div>
                <div className="text-white font-medium">
                  {option.cost > 0 ? `$${option.cost.toFixed(2)}` : 'Free'}
                </div>
              </label>
            ))}
          </div>
          
          {formErrors.delivery && (
            <div className="text-red-400 text-sm flex items-center">
              <ExclamationCircleIcon className="h-4 w-4 mr-1" />
              {formErrors.delivery}
            </div>
          )}
        </div>
      )}

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          Payment Information
        </h3>
        
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Details *
          </label>
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#F9FAFB',
                    '::placeholder': {
                      color: '#9CA3AF',
                    },
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ShieldCheckIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="text-sm font-medium text-blue-300 mb-1">
              Secure Payment
            </h5>
            <p className="text-xs text-blue-200">
              Your payment information is encrypted and secure. We use industry-standard SSL encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || processing || loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700"
        size="lg"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Processing Payment...
          </>
        ) : (
          <>
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Complete Purchase - ${totalAmount.toFixed(2)}
          </>
        )}
      </Button>

      {/* Fraud Protection Notice */}
      <div className="text-xs text-gray-400 text-center">
        <p>Protected by Riskified fraud detection • Session ID: {sessionId.substring(0, 20)}...</p>
      </div>
    </form>
  )
}
