import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LocationProvider } from '@/contexts/LocationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CategoryProvider } from '@/contexts/CategoryContext'
import AuthGuard from '@/components/AuthGuard'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TixPort - Premium Ticket Marketplace',
  description: 'Find and buy tickets for concerts, sports, theater and more events. Premium ticket marketplace with authentic tickets guaranteed.',
  keywords: 'tickets, concerts, sports, theater, events, marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <CategoryProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </CategoryProvider>
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

