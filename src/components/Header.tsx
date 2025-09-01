'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, UserIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState('Ashburn, VA');

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>Your Location: {location}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>(281) 392-9693</span>
            <span>demo-contact@tixport.com</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              TixPort
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/concerts" className="text-gray-700 hover:text-primary-600 font-medium">
              Concerts
            </Link>
            <Link href="/sports" className="text-gray-700 hover:text-primary-600 font-medium">
              Sports
            </Link>
            <Link href="/theater" className="text-gray-700 hover:text-primary-600 font-medium">
              Theater
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary-600 font-medium">
                Sports Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  <Link href="/sports/nfl" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">NFL Football</Link>
                  <Link href="/sports/mlb" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">MLB Baseball</Link>
                  <Link href="/sports/nba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">NBA Basketball</Link>
                  <Link href="/sports/nhl" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">NHL Hockey</Link>
                  <Link href="/sports/mls" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">MLS Soccer</Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events, artists, teams..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="text-gray-700 hover:text-primary-600">
              Contact us
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600">
              About Us
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-primary-600">
              <UserIcon className="h-5 w-5 inline mr-1" />
              Login
            </Link>
            <Link href="/register" className="text-gray-700 hover:text-primary-600">
              Register
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 relative">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link href="/concerts" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Concerts</Link>
              <Link href="/sports" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Sports</Link>
              <Link href="/theater" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Theater</Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-primary-600">Contact us</Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-primary-600">About Us</Link>
            </div>
          </div>
        )}
      </div>

      {/* Guarantee Banner */}
      <div className="bg-primary-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <p className="text-center text-sm text-primary-800">
            <strong>We are a resale marketplace.</strong> Prices may be above or below face value.
          </p>
        </div>
      </div>
    </header>
  );
}

