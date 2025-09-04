'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useEffect, useState } from 'react'

interface StripeProviderProps {
  children: React.ReactNode
}

let stripePromise: Promise<any> | null = null

export default function StripeProvider({ children }: StripeProviderProps) {
  const [publishableKey, setPublishableKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/stripe-config`)
        if (!response.ok) {
          throw new Error('Failed to fetch Stripe configuration')
        }
        
        const config = await response.json()
        setPublishableKey(config.publishableKey)
        
        // Initialize Stripe with the publishable key
        if (config.publishableKey && !stripePromise) {
          stripePromise = loadStripe(config.publishableKey)
        }
      } catch (err) {
        console.error('Error fetching Stripe config:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchStripeConfig()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-400">Loading payment system...</div>
      </div>
    )
  }

  if (error || !publishableKey || !stripePromise) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-400">Payment system unavailable</div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#8B5CF6',
            colorBackground: '#1F2937',
            colorText: '#F9FAFB',
            colorDanger: '#EF4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
          rules: {
            '.Input': {
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
            },
            '.Input:focus': {
              border: '1px solid #8B5CF6',
              boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)',
            },
            '.Label': {
              color: '#D1D5DB',
              fontWeight: '500',
            },
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
