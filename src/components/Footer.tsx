'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TixPort</h3>
            <p className="text-gray-300 mb-4">
              Your trusted marketplace for authentic event tickets. We specialize in premium and sold-out tickets nationwide.
            </p>
            <div className="text-sm text-gray-400">
              <p>(281) 392-9693</p>
              <p>demo-contact@tixport.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/concerts" className="hover:text-white transition-colors">Concerts</Link></li>
              <li><Link href="/sports" className="hover:text-white transition-colors">Sports</Link></li>
              <li><Link href="/theater" className="hover:text-white transition-colors">Theatre</Link></li>
              <li><Link href="/sports/mlb" className="hover:text-white transition-colors">MLB</Link></li>
              <li><Link href="/sports/nba" className="hover:text-white transition-colors">NBA</Link></li>
              <li><Link href="/sports/nfl" className="hover:text-white transition-colors">NFL</Link></li>
              <li><Link href="/sports/nhl" className="hover:text-white transition-colors">NHL</Link></li>
            </ul>
          </div>

          {/* Guarantee */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Guarantee</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <strong className="text-white">Valid tickets</strong>
                  <p className="text-sm">All tickets 100% authentic and valid for entry!</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <strong className="text-white">On time</strong>
                  <p className="text-sm">Tickets will arrive in time for your event.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <strong className="text-white">Seats together</strong>
                  <p className="text-sm">All seats are side by side unless otherwise noted.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <strong className="text-white">Full refund</strong>
                  <p className="text-sm">Full refund for events that are canceled and not rescheduled.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              *TixPort is an independently owned and operated, licensed ticket broker that specializes in obtaining premium and sold out tickets to events nationwide. Ticket prices are dependent upon the current market price, which is usually above the face value printed on the tickets. We are not affiliated with Ticketmaster or any venues, teams, performers or organizations.
            </p>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              © 2025 TixPort | All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

