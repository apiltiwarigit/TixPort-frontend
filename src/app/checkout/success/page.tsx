'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon 
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loading } from '@/components/ui/Loading'

interface OrderData {
  id: string
  oid: string
  state: string
  total: number
  created_at: string
  delivery: {
    type: string
    cost: number
    email_address?: { address: string }
    phone_number?: { number: string }
  }
  items: Array<{
    id: string
    quantity: number
    price: number
    ticket_group: {
      event?: {
        name: string
        occurs_at: string
        venue?: { name: string }
      }
      section?: string
      row?: string
    }
  }>
  client: {
    name: string
    email_addresses?: Array<{ address: string }>
  }
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided')
        setLoading(false)
        return
      }

      try {
        // Get stored session
        const storedSession = localStorage.getItem('auth_session')
        const accessToken = storedSession ? JSON.parse(storedSession)?.access_token : null

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/order/${orderId}`, {
          headers: {
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setOrder(result.data)
          } else {
            setError(result.message || 'Failed to load order details')
          }
        } else {
          setError('Failed to load order details')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loading size="lg" text="Loading order details..." />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <div className="p-6">
            <div className="text-red-400 text-xl mb-4">❌</div>
            <h1 className="text-xl font-semibold text-white mb-2">Order Not Found</h1>
            <p className="text-gray-400 mb-6">{error || 'Unable to load order details'}</p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const getStateDisplay = (state: string) => {
    switch (state.toLowerCase()) {
      case 'accepted':
      case 'processing':
        return { icon: ClockIcon, text: 'Processing', color: 'text-yellow-400' }
      case 'confirmed':
      case 'complete':
        return { icon: CheckCircleIcon, text: 'Confirmed', color: 'text-green-400' }
      default:
        return { icon: DocumentTextIcon, text: state, color: 'text-blue-400' }
    }
  }

  const stateDisplay = getStateDisplay(order.state)
  const StateIcon = stateDisplay.icon

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircleIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Purchase Successful!</h1>
          <p className="text-gray-400">
            Your order has been placed successfully. Details have been sent to your email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="text-white font-mono">{order.oid}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <div className="flex items-center space-x-2">
                    <StateIcon className={`h-4 w-4 ${stateDisplay.color}`} />
                    <span className={`font-medium ${stateDisplay.color}`}>
                      {stateDisplay.text}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Paid</span>
                  <span className="text-white font-semibold">${order.total?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date</span>
                  <span className="text-white">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Ticket Details */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Ticket Details</h2>
              
              {order.items.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div>
                    <h3 className="text-lg text-white font-medium">
                      {item.ticket_group?.event?.name || 'Event Details'}
                    </h3>
                    {item.ticket_group?.event?.venue?.name && (
                      <p className="text-gray-400">{item.ticket_group.event.venue.name}</p>
                    )}
                    {item.ticket_group?.event?.occurs_at && (
                      <p className="text-gray-400">
                        {new Date(item.ticket_group.event.occurs_at).toLocaleDateString()} at{' '}
                        {new Date(item.ticket_group.event.occurs_at).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Quantity:</span>
                      <span className="text-white ml-2">{item.quantity}</span>
                    </div>
                    {item.ticket_group?.section && (
                      <div>
                        <span className="text-gray-400">Section:</span>
                        <span className="text-white ml-2">{item.ticket_group.section}</span>
                      </div>
                    )}
                    {item.ticket_group?.row && (
                      <div>
                        <span className="text-gray-400">Row:</span>
                        <span className="text-white ml-2">{item.ticket_group.row}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white ml-2">${item.price?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Delivery Information</h2>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Delivery Method:</span>
                  <span className="text-white ml-2 capitalize">{order.delivery.type}</span>
                </div>
                
                {order.delivery.cost > 0 && (
                  <div>
                    <span className="text-gray-400">Delivery Cost:</span>
                    <span className="text-white ml-2">${order.delivery.cost.toFixed(2)}</span>
                  </div>
                )}
                
                {order.delivery.email_address?.address && (
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{order.delivery.email_address.address}</span>
                  </div>
                )}
                
                {order.delivery.phone_number?.number && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{order.delivery.phone_number.number}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">What&apos;s Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Confirmation Email</p>
                    <p className="text-gray-400 text-sm">
                      You&apos;ll receive a confirmation email with your order details within a few minutes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Ticket Delivery</p>
                    <p className="text-gray-400 text-sm">
                      {order.delivery.type === 'Eticket' 
                        ? 'Your e-tickets will be delivered via email shortly.'
                        : order.delivery.type === 'TMMobile'
                        ? 'Your mobile tickets will be transferred to your account.'
                        : 'Your physical tickets will be shipped to your address.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Event Day</p>
                    <p className="text-gray-400 text-sm">
                      Arrive early with your tickets and a valid ID to ensure smooth entry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mt-8">
          <Link href="/">
            <Button variant="outline">Browse More Events</Button>
          </Link>
          <Button onClick={() => window.print()}>
            Print Order Details
          </Button>
        </div>
      </div>
    </div>
  )
}
