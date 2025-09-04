'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSkeleton } from '@/components/ui/Loading'
import { TicketMap } from '@ticketevolution/seatmaps-client'
import { 
  ArrowLeftIcon, 
  MapIcon, 
  TicketIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import Header from '@/components/Header'
import StripeProvider from '@/components/StripeProvider'
import CheckoutForm from '@/components/CheckoutForm'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  venue: string | { name: string; [key: string]: any }
  city: string
  state: string
  description: string
  image: string
  price_min: number
  price_max: number
  requirements?: {
    inclusive_pricing?: boolean
    face_value_display?: boolean
    seat_number_display?: boolean
  }
}

interface SeatmapData {
  venueId: string
  configurationId: string | null
  venueName: string
  venueCity: string
  venueState: string
  event: {
    id: number
    name: string
    occurs_at: string
  }
}

interface TicketGroup {
  id: number
  section: string
  row: string
  quantity: number
  available_quantity?: number
  wholesale_price: number
  retail_price: number
  retail_price_inclusive?: number
  format: string
  in_hand: boolean
  eticket: boolean
  public_notes?: string
  tevo_section_name: string
  price: number
  type?: string
  splits?: number[]
}

interface SelectedTicket {
  ticketGroupId: number
  section: string
  row: string
  quantity: number
  pricePerTicket: number
  totalPrice: number
  format: string
}


export default function EventBuyPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [seatmapData, setSeatmapData] = useState<SeatmapData | null>(null)
  const [ticketGroups, setTicketGroups] = useState<TicketGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [seatmapLoading, setSeatmapLoading] = useState(false)
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([])
  const [availableTicketsForSection, setAvailableTicketsForSection] = useState<TicketGroup[]>([])
  const [showSeatmap, setShowSeatmap] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<'select' | 'review' | 'checkout' | 'success'>('select')
  const [orderData, setOrderData] = useState<any>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [dataFetched, setDataFetched] = useState(false)
  const fetchedRef = useRef<string | null>(null)
  const lastChosenSectionRef = useRef<string | null>(null)
  const lastMapSelectionRef = useRef<string[]>([])

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}`)
        if (response.ok) {
          const data = await response.json()
          const raw = data.data || {}
          console.log('Raw event data:', raw) // Debug log
          console.log('Available city fields:', {
            'raw.city': raw.city,
            'raw.venue_city': raw.venue_city,
            'raw.venue?.city': raw.venue?.city,
            'venue object': raw.venue
          })
          
          const normalized: Event = {
            id: String(raw.id ?? eventId),
            title: raw.title || raw.name || 'Untitled Event',
            date: raw.date || raw.occurs_at || '',
            venue: raw.venue || raw.venue_name || 'Unknown Venue',
            city: raw.city || (typeof raw.venue === 'object' && raw.venue?.city) || raw.venue_city || '',
            state: raw.state || (typeof raw.venue === 'object' && raw.venue?.state) || raw.venue_state || '',
            description: raw.description || '',
            image: raw.image || (raw.images && raw.images[0]?.url) || '',
            price_min: raw.min_ticket_price || raw.price_min || 0,
            price_max: raw.max_ticket_price || raw.price_max || 0,
            requirements: raw.requirements || {}
          }
          
          console.log('Normalized event data:', normalized) // Debug log
          setEvent(normalized)
        } else {
          setError('Failed to fetch event details')
        }
      } catch (error) {
        console.error('Error fetching event:', error)
        setError('Failed to fetch event details')
      }
    }

    fetchEvent()
  }, [eventId])

  // Reset data fetched state when eventId changes
  useEffect(() => {
    setDataFetched(false)
    fetchedRef.current = null
    setSeatmapData(null)
    setTicketGroups([])
    setShowSeatmap(false)
    setError(null)
  }, [eventId])

  // Fetch seatmap data and ticket groups - only once when event is loaded
  useEffect(() => {
    const fetchSeatmapData = async () => {
      if (!eventId || !event || dataFetched || seatmapLoading || fetchedRef.current === eventId) {
        return
      }
      
      console.log(`🚀 Starting seatmap data fetch for event ${eventId}`)
      setSeatmapLoading(true)
      setDataFetched(true)
      fetchedRef.current = eventId
      
      try {
        // Fetch both seatmap and ticket groups in parallel to avoid multiple renders
        const [seatmapResponse, ticketGroupsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/event/${eventId}/seatmap`),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/event/${eventId}/groups?limit=100`)
        ])

        // Process seatmap data
        let seatmapData = null
        if (seatmapResponse.ok) {
          const seatmapResult = await seatmapResponse.json()
          seatmapData = seatmapResult.data
          setSeatmapData(seatmapData)

          // Show seatmap if we have both venueId and configurationId
          if (seatmapData.venueId && seatmapData.configurationId) {
            setShowSeatmap(true)
            console.log(`✅ Seatmap data available: venue ${seatmapData.venueId}, config ${seatmapData.configurationId}`)
          } else {
            console.log(`⚠️ Seatmap data incomplete: venue ${seatmapData.venueId}, config ${seatmapData.configurationId}`)
          }
        }

        // Process ticket groups
        if (ticketGroupsResponse.ok) {
          const ticketGroupsData = await ticketGroupsResponse.json()
          
          // Transform and deduplicate ticket groups by section
          // Exclude parking tickets from seatmap data
          const priceField = event?.requirements?.inclusive_pricing ? 'retail_price_inclusive' : 'retail_price'
          const allGroups = (ticketGroupsData.data.ticketGroups || [])
            .filter((group: any) => group.type !== 'parking') // Exclude parking tickets
            .map((group: any) => ({
              ...group,
              tevo_section_name: group.tevo_section_name || group.section,
              price: group[priceField] || group.retail_price || group.wholesale_price || group.price || 0
            }))

          // Create a map to deduplicate by section, keeping the best price
          const groupMap = new Map()
          allGroups.forEach((group: any) => {
            const key = `${group.tevo_section_name}`.toLowerCase() // Normalize case for consistent matching
            const existing = groupMap.get(key)
            
            if (!existing || group.price < existing.price) {
              groupMap.set(key, {
                ...group,
                tevo_section_name: group.tevo_section_name || group.section // Ensure tevo_section_name is set
              })
            }
          })

          const transformedGroups = Array.from(groupMap.values())
          console.log(`🔄 Deduplication: ${allGroups.length} → ${transformedGroups.length} ticket groups`)
          console.log(`📍 Sample tevo_section_name mapping:`, transformedGroups.slice(0, 3).map(g => ({
            section: g.section,
            tevo_section_name: g.tevo_section_name,
            type: g.type,
            price: g.price
          })))
          setTicketGroups(transformedGroups)
          
          // Check if ticket groups response contains configuration ID (fallback)
          if (ticketGroupsData.data.configurationId && seatmapData && !seatmapData.configurationId) {
            console.log(`🎯 Found configuration ID in ticket groups: ${ticketGroupsData.data.configurationId}`)
            setSeatmapData(prev => prev ? {
              ...prev,
              configurationId: ticketGroupsData.data.configurationId
            } : null)
            // Only show seatmap if we now have both venueId and configurationId
            if (seatmapData.venueId && ticketGroupsData.data.configurationId) {
              setShowSeatmap(true)
            }
          }
          
          console.log(`✅ Loaded ${transformedGroups.length} ticket groups for event ${eventId}`)
        } else if (ticketGroupsResponse.status === 404) {
          console.log('⚠️ No ticket groups found for this event')
          setTicketGroups([])
        } else {
          console.warn('⚠️ Failed to fetch ticket groups:', ticketGroupsResponse.status)
          setTicketGroups([])
        }
      } catch (error) {
        console.error('Error fetching seatmap data:', error)
        setError('Failed to fetch seating information')
        setDataFetched(false) // Allow retry on error
        fetchedRef.current = null // Reset ref on error
      } finally {
        setSeatmapLoading(false)
        setLoading(false)
      }
    }

    fetchSeatmapData()
  }, [eventId, event, dataFetched, seatmapLoading])

  // Handle section selection from seatmap - enforce persistent single-selection behavior
  const handleSectionSelection = useCallback((sections: string[]) => {
    const incoming = sections.map(s => s.toLowerCase())
    const prevMap = lastMapSelectionRef.current

    // Determine changes
    const newlyAdded = incoming.find(s => !prevMap.includes(s)) || null
    const removed = prevMap.find(s => !incoming.includes(s)) || null

    console.log('🧭 Map selection change', { prevMap, incoming, newlyAdded, removed, lastChosen: lastChosenSectionRef.current })

    if (newlyAdded) {
      // New selection: adopt it and replace panel data
      const picked = newlyAdded
      lastChosenSectionRef.current = picked
      setSelectedSections([picked])

      const selectedTicketGroups = ticketGroups.filter(group =>
        picked === (group.tevo_section_name || group.section).toLowerCase()
      )
      setAvailableTicketsForSection(selectedTicketGroups)
      setSelectedTickets([])
    } else if (removed) {
      // Deselection happened. If user deselected the last chosen, clear panel entirely
      if (removed === lastChosenSectionRef.current) {
        lastChosenSectionRef.current = null
        setSelectedSections([])
        setAvailableTicketsForSection([])
        setSelectedTickets([])
      } else {
        // Ignore removals of older selections; keep showing last chosen
        if (lastChosenSectionRef.current) {
          setSelectedSections([lastChosenSectionRef.current])
        } else {
          setSelectedSections([])
        }
      }
    } else {
      // No diff (rare), keep current state consistent with lastChosen
      if (lastChosenSectionRef.current) {
        setSelectedSections([lastChosenSectionRef.current])
      } else {
        setSelectedSections([])
        setAvailableTicketsForSection([])
        setSelectedTickets([])
      }
    }

    lastMapSelectionRef.current = incoming
  }, [ticketGroups])

  // Add ticket to selected list (replace mode for single selection)
  const addTicketToSelection = (ticketGroup: TicketGroup) => {
    const priceField = event?.requirements?.inclusive_pricing ? 'retail_price_inclusive' : 'retail_price'
    const price = ticketGroup[priceField] || ticketGroup.retail_price

    const newSelectedTicket: SelectedTicket = {
      ticketGroupId: ticketGroup.id,
      section: ticketGroup.section,
      row: ticketGroup.row,
      quantity: 1,
      pricePerTicket: price,
      totalPrice: price,
      format: ticketGroup.format
    }

    // Replace any existing tickets with this new selection (single selection mode)
    setSelectedTickets([newSelectedTicket])
  }

  // Remove ticket from selected list
  const removeTicketFromSelection = (ticketGroupId: number) => {
    setSelectedTickets(prev => prev.filter(ticket => ticket.ticketGroupId !== ticketGroupId))
  }

  // Update ticket quantity
  const updateTicketQuantity = (ticketGroupId: number, newQuantity: number) => {
    setSelectedTickets(prev =>
      prev.map(ticket =>
        ticket.ticketGroupId === ticketGroupId
          ? { ...ticket, quantity: newQuantity, totalPrice: newQuantity * ticket.pricePerTicket }
          : ticket
      ).filter(ticket => ticket.quantity > 0)
    )
  }

  // Calculate total order amount
  const totalOrderAmount = selectedTickets.reduce((total, ticket) => total + ticket.totalPrice, 0)

  // Memoize ticket groups for TicketMap to prevent unnecessary re-renders
  const memoizedTicketGroups = useMemo(() => {
    const priceField = event?.requirements?.inclusive_pricing ? 'retail_price_inclusive' : 'retail_price'
    const groups = ticketGroups.map(group => ({
      tevo_section_name: (group.tevo_section_name || group.section).toLowerCase(), // Normalize for consistent matching
      retail_price: parseFloat(String(group[priceField] || group.retail_price || group.wholesale_price || group.price || 0))
    }))
    
    if (groups.length > 0) {
      console.log(`🗺️ Seatmap ticket groups prepared:`, {
        count: groups.length,
        priceField: priceField,
        inclusivePricing: event?.requirements?.inclusive_pricing,
        sample: groups.slice(0, 3)
      })
    }
    
    return groups
  }, [ticketGroups, event?.requirements?.inclusive_pricing])

  // Handle checkout
  const handleCheckout = () => {
    if (selectedTickets.length === 0) return
    setCurrentStep('checkout')
  }

  // Handle successful checkout
  const handleCheckoutSuccess = (orderResult: any) => {
    setOrderData(orderResult)
    setCurrentStep('success')
  }

  // Handle checkout error
  const handleCheckoutError = (error: string) => {
    setCheckoutError(error)
  }

  // Get current ticket data for checkout
  const getCurrentTicketData = () => {
    if (selectedTickets.length === 0) return null
    
    const ticket = selectedTickets[0] // Using first selected ticket
    return {
      ticketGroupId: ticket.ticketGroupId,
      section: ticket.section,
      row: ticket.row,
      quantity: ticket.quantity,
      pricePerTicket: ticket.pricePerTicket,
      totalPrice: ticket.totalPrice,
      format: ticket.format
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seatmap Section Loading */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden animate-pulse">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <LoadingSkeleton className="h-6 w-6 rounded" />
                      <LoadingSkeleton className="h-6 w-48" />
                    </div>
                    <LoadingSkeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="h-96 p-8 flex items-center justify-center">
                  <div className="text-center">
                    <LoadingSkeleton className="h-16 w-16 rounded mx-auto mb-4" />
                    <LoadingSkeleton className="h-6 w-64 mb-2" />
                    <LoadingSkeleton className="h-4 w-48" />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Loading */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 animate-pulse">
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <LoadingSkeleton className="h-6 w-6 rounded" />
                    <LoadingSkeleton className="h-6 w-32" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-center py-8">
                    <LoadingSkeleton className="h-12 w-12 rounded mx-auto mb-4" />
                    <LoadingSkeleton className="h-4 w-48 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center max-w-md mx-auto">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 mb-2 font-medium">Unable to load event</div>
            <div className="text-red-300 text-sm mb-4">{error || 'The event you\'re looking for doesn\'t exist.'}</div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Link href="/" className="btn-primary">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Event</span>
              </button>
              <div className="h-6 border-l border-gray-600"></div>
              <h1 className="text-xl font-bold text-white truncate">
                Buy Tickets - {event.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm text-gray-400">
                {typeof event.venue === 'object' && event.venue.name ? event.venue.name : typeof event.venue === 'string' ? event.venue : 'Unknown Venue'}, {event.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Step */}
        {currentStep === 'checkout' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentStep('select')}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Seat Selection</span>
              </button>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Complete Your Purchase</h1>
              
              {checkoutError && (
                <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    <div className="text-red-300">{checkoutError}</div>
                  </div>
                </div>
              )}
              
              <StripeProvider>
                <CheckoutForm
                  ticketData={getCurrentTicketData()!}
                  eventData={{
                    id: eventId,
                    title: event!.title,
                    date: event!.date,
                    venue: typeof event!.venue === 'object' && event!.venue.name 
                      ? event!.venue.name 
                      : typeof event!.venue === 'string' 
                        ? event!.venue 
                        : 'Unknown Venue'
                  }}
                  onSuccess={handleCheckoutSuccess}
                  onError={handleCheckoutError}
                />
              </StripeProvider>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === 'success' && orderData && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
              <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h1>
              <p className="text-gray-300 mb-6">
                Your tickets have been successfully purchased.
              </p>
              
              <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID:</span>
                    <span className="text-white font-mono">{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="text-green-400 font-semibold">${orderData.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-blue-400 capitalize">{orderData.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-400">
                  You will receive a confirmation email with your ticket details shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="btn-primary">
                    Return Home
                  </Link>
                  <Link href="/profile/orders" className="btn-secondary">
                    View My Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Selection View */}
        {(currentStep === 'select' || currentStep === 'review') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seatmap Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="h-24 sm:h-20 p-6 border-b border-gray-700 flex flex-col justify-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapIcon className="h-6 w-6 text-purple-400" />
                      <h2 className="text-xl font-bold text-white">Select Your Seats</h2>
                    </div>

                    {seatmapData && (
                      <div className="text-sm text-gray-400">
                        {seatmapData.venueName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {selectedSections.length > 0 ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-300 truncate">
                          Selected Section: {selectedSections[0]}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Click a section to select
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                {seatmapLoading ? (
                  <div className="h-96 p-8 flex items-center justify-center animate-pulse">
                    <div className="text-center">
                      <LoadingSkeleton className="h-16 w-16 rounded mx-auto mb-4" />
                      <LoadingSkeleton className="h-6 w-64 mb-2" />
                      <LoadingSkeleton className="h-4 w-48" />
                    </div>
                  </div>
                ) : showSeatmap && seatmapData?.venueId && seatmapData?.configurationId && ticketGroups.length > 0 ? (
                  <div
                    className="h-[600px] w-full relative bg-gray-800 rounded seatmap-container"
                    style={{
                      minHeight: '600px',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <TicketMap
                      venueId={seatmapData.venueId}
                      configurationId={seatmapData.configurationId}
                      ticketGroups={memoizedTicketGroups}
                      onSelection={handleSectionSelection}
                      mapsDomain="https://maps.ticketevolution.com"
                      mapFontFamily="system-ui, -apple-system, sans-serif"
                      showLegend={true}
                      showControls={true}
                      mouseControlEnabled={true}
                      sectionPercentiles={{
                        "0.2": "#10B981",
                        "0.4": "#F59E0B", 
                        "0.6": "#EF4444",
                        "0.8": "#8B5CF6",
                        "1": "#3B82F6"
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                    <MapIcon className="h-16 w-16 text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Interactive Seating Chart Coming Soon
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Use the ticket selection panel to choose your seats
                    </p>
                    
                                         {/* Fallback ticket listing */}
                     <div className="w-full max-w-md">
                       {ticketGroups.length === 0 ? (
                         <div className="text-center">
                           <TicketIcon className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                           <h4 className="text-sm font-medium text-gray-300 mb-2">No Tickets Available</h4>
                           <p className="text-xs text-gray-400">
                             This event currently has no tickets for sale.
                           </p>
                         </div>
                       ) : (
                         <>
                           <h4 className="text-sm font-medium text-gray-300 mb-3">Available Sections:</h4>
                           <div className="space-y-2 max-h-32 overflow-y-auto">
                             {Array.from(new Set(ticketGroups.map(g => typeof g.section === 'string' ? g.section : String(g.section)))).slice(0, 6).map(section => (
                               <button
                                 key={section}
                                 onClick={() => handleSectionSelection([section])}
                                 className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                   selectedSections.length > 0 && selectedSections[0] === section
                                     ? 'bg-purple-600 text-white'
                                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                 }`}
                               >
                                 Section {section}
                               </button>
                             ))}
                           </div>
                         </>
                       )}
                     </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 sticky top-8">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <TicketIcon className="h-6 w-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>
              </div>

              <div className="p-6">
                {selectedSections.length === 0 && selectedTickets.length === 0 ? (
                  <div className="text-center py-8">
                    <TicketIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Select seats from the map to see pricing</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Event Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-400">{typeof event.venue === 'object' && event.venue.name ? event.venue.name : typeof event.venue === 'string' ? event.venue : 'Unknown Venue'}</p>
                    </div>

                    {/* Available Tickets for Selected Sections */}
                    {availableTicketsForSection.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-300">Available Tickets</h4>
                        <div className="space-y-3">
                          {availableTicketsForSection.map((ticketGroup) => (
                            <div key={ticketGroup.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-medium text-white">
                                    Section {ticketGroup.section}, Row {ticketGroup.row}
                                  </p>
                                  <p className="text-sm text-gray-400">{ticketGroup.format}</p>
                                  {ticketGroup.public_notes && (
                                    <p className="text-xs text-gray-500 mt-1">{ticketGroup.public_notes}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-green-400 text-lg">
                                    ${ticketGroup.retail_price?.toFixed(2) || ticketGroup.price?.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-400">per ticket</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addTicketToSelection(ticketGroup)}
                                disabled={selectedTickets.some(ticket => ticket.ticketGroupId === ticketGroup.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                              >
                                {selectedTickets.some(ticket => ticket.ticketGroupId === ticketGroup.id) ? 'Selected' : 'Select Tickets'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Ticket */}
                    {selectedTickets.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-300">Selected Ticket</h4>
                      {selectedTickets.map((ticket) => (
                        <div key={ticket.ticketGroupId} className="bg-gray-700/50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-white">
                                Section {typeof ticket.section === 'string' ? ticket.section : String(ticket.section)}, Row {typeof ticket.row === 'string' ? ticket.row : String(ticket.row)}
                              </p>
                              <p className="text-sm text-gray-400">{typeof ticket.format === 'string' ? ticket.format : String(ticket.format)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-400">
                                ${ticket.pricePerTicket.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400">per ticket</p>
                            </div>
                          </div>
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Quantity:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateTicketQuantity(ticket.ticketGroupId, ticket.quantity - 1)}
                                disabled={ticket.quantity <= 1}
                                className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-white font-medium">
                                {ticket.quantity}
                              </span>
                              <button
                                onClick={() => updateTicketQuantity(ticket.ticketGroupId, ticket.quantity + 1)}
                                disabled={ticket.quantity >= 8}
                                className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t border-gray-600">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">Subtotal:</span>
                              <span className="font-bold text-white">
                                ${ticket.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    )}

                    {/* Order Total */}
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-white">Total:</span>
                        <span className="text-2xl font-bold text-green-400">
                          ${totalOrderAmount.toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={handleCheckout}
                        disabled={selectedTickets.length === 0 || totalOrderAmount === 0}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>Proceed to Checkout</span>
                      </button>
                    </div>

                    {/* Guarantee Info */}
                    <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-sm font-medium text-blue-300 mb-1">
                            TixPort Guarantee
                          </h5>
                          <p className="text-xs text-blue-200">
                            All tickets are 100% guaranteed authentic and will arrive in time for your event.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
