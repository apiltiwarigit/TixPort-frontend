'use client'

import { createContext, useContext, useRef, useState, ReactNode } from 'react'
import axios, { isAxiosError } from 'axios'

interface BraintreeContextType {
  clientToken: string | null
  loading: boolean
  error: string | null
  refreshClientToken: (clientId: number) => Promise<void>
}

const BraintreeContext = createContext<BraintreeContextType | null>(null)

interface BraintreeProviderProps {
  children: ReactNode
}

export default function BraintreeProvider({ children }: BraintreeProviderProps) {
  const [clientToken, setClientToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // In-flight requests keyed by clientId
  const inFlight = useRef<Map<number, Promise<string>>>(new Map())
  // Simple cache for client tokens per clientId with TTL
  const cache = useRef<Map<number, { token: string; expiresAt: number }>>(new Map())
  const TOKEN_TTL_MS = 5 * 60 * 1000 // 5 minutes

  const refreshClientToken = async (clientId: number) => {
    setError(null)

    // Serve from cache if valid
    const cached = cache.current.get(clientId)
    const now = Date.now()
    if (cached && cached.expiresAt > now) {
      setClientToken(cached.token)
      return
    }

    // Deduplicate concurrent requests
    if (inFlight.current.has(clientId)) {
      setLoading(true)
      try {
        const token = await inFlight.current.get(clientId)!
        setClientToken(token)
      } finally {
        setLoading(false)
      }
      return
    }

    const promise = (async (): Promise<string> => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout/payments/braintree/client-token`,
        { clientId },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      if (!response.data?.success || !response.data?.clientToken) {
        throw new Error(response.data?.message || 'Failed to get client token')
      }

      const token: string = response.data.clientToken
      cache.current.set(clientId, { token, expiresAt: Date.now() + TOKEN_TTL_MS })
      return token
    })()

    inFlight.current.set(clientId, promise)
    setLoading(true)
    try {
      const token = await promise
      setClientToken(token)
    } catch (err: unknown) {
      const errorMessage = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : (err as Error).message || 'Failed to initialize payment processing'
      setError(errorMessage)
      console.error('❌ Failed to get Braintree client token:', errorMessage)
      // On failure, clear any stale cache
      cache.current.delete(clientId)
      throw err
    } finally {
      inFlight.current.delete(clientId)
      setLoading(false)
    }
  }

  const value: BraintreeContextType = {
    clientToken,
    loading,
    error,
    refreshClientToken
  }

  return (
    <BraintreeContext.Provider value={value}>
      {children}
    </BraintreeContext.Provider>
  )
}

export function useBraintree() {
  const context = useContext(BraintreeContext)
  if (!context) {
    throw new Error('useBraintree must be used within a BraintreeProvider')
  }
  return context
}
