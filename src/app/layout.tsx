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
      <head>
        {/* Riskified Beacon for fraud protection */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function riskifiedBeaconLoad() {
                  var store_domain = '${process.env.NEXT_PUBLIC_STORE_DOMAIN || 'tixport.com'}';
                  var session_id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                  var script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.onerror = function() { console.warn('Riskified beacon failed to load'); };
                  script.src = 'https://beacon.riskified.com?shop=' + store_domain + '&sid=' + session_id;
                  document.head.appendChild(script);
                  window.riskifiedSessionId = session_id;
                }
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', riskifiedBeaconLoad);
                } else {
                  riskifiedBeaconLoad();
                }
              })();
            `
          }}
        />
      </head>
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

