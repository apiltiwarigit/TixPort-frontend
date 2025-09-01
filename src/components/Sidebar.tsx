'use client';

import Link from 'next/link';
import { 
  GlobeAltIcon, 
  UserIcon, 
  ShoppingCartIcon,
  PhoneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
      {/* Location Section */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          GET TICKETS
        </h3>
        <div className="mb-4">
          <h4 className="text-gray-300 text-xs font-medium mb-2">YOUR LOCATION</h4>
          <div className="flex items-center text-white text-sm">
            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>Edison, NJ</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mb-8">
        <nav className="space-y-2">
          <Link href="/concerts" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors">
            Concerts
          </Link>
          <Link href="/theatre" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors">
            Theatre
          </Link>
          <Link href="/sports" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors">
            Sports
          </Link>
          <Link href="/sports/nfl" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4">
            NFL Football
          </Link>
          <Link href="/sports/mlb" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4">
            MLB Baseball
          </Link>
          <Link href="/sports/nba" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4">
            NBA Basketball
          </Link>
          <Link href="/sports/nhl" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4">
            NHL Hockey
          </Link>
          <Link href="/sports/mls" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4">
            MLS Soccer
          </Link>
        </nav>
      </div>

      {/* Account Section */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-sm mb-4">ACCOUNT</h3>
        <nav className="space-y-2">
          <Link href="/login" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            Login
          </Link>
          <Link href="/register" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors">
            Register
          </Link>
          <Link href="/cart" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            Cart
          </Link>
        </nav>
      </div>

      {/* Contact Section */}
      <div className="mb-8">
        <nav className="space-y-2">
          <Link href="/contact" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Contact us
          </Link>
          <Link href="/about" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            About Us
          </Link>
        </nav>
      </div>
    </div>
  );
}
