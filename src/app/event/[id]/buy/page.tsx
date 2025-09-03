'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Event {
  id: string
  title: string
  date: string
  venue: string
  city: string
  state: string
  description: string
  image: string
  price_min: number
  price_max: number
}

export default function EventBuyPage() {
  const params = useParams()
  const eventId = params.id as string
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          setEvent(data.data)
        } else {
          console.error('Failed to fetch event details')
        }
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Event Header */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full flex items-center justify-center text-white text-center p-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <p className="text-lg">{event.venue}, {event.city}, {event.state}</p>
                <p className="text-md">{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ticket Selection */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Tickets</h2>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">General Admission</h3>
                    <p className="text-gray-600 mb-4">Standard entry to the event</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${event.price_min} - ${event.price_max}
                      </span>
                      <button
                        onClick={() => setSelectedSection('general')}
                        className={`px-4 py-2 rounded-md font-medium ${
                          selectedSection === 'general'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Select
                      </button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">VIP Section</h3>
                    <p className="text-gray-600 mb-4">Premium seating with exclusive benefits</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${Math.round(event.price_max * 1.5)}
                      </span>
                      <button
                        onClick={() => setSelectedSection('vip')}
                        className={`px-4 py-2 rounded-md font-medium ${
                          selectedSection === 'vip'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>

                {selectedSection && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Quantity</h4>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {selectedSection ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Event:</span>
                        <span className="font-medium">{event.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Section:</span>
                        <span className="font-medium capitalize">{selectedSection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per ticket:</span>
                        <span className="font-medium">
                          ${selectedSection === 'vip' ? Math.round(event.price_max * 1.5) : event.price_min}
                        </span>
                      </div>
                      <hr className="border-gray-300" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">
                          ${(selectedSection === 'vip' ? Math.round(event.price_max * 1.5) : event.price_min) * quantity}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
                      Proceed to Checkout
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">Select a ticket section to see your order summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
