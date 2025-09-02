'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  UserIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { location, loading, error, formatLocation } = useLocation();

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden sm:block bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            {/* Left - Disclaimer */}
            <div className="flex items-center">
              <div className="hidden md:block text-gray-300 text-xs">
                We are a resale marketplace. Prices may be above or below face value.
              </div>
            </div>

            {/* Center - Contact Info */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-300">
                <PhoneIcon className="h-4 w-4" />
                <span>(281) 392-9693</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <EnvelopeIcon className="h-4 w-4" />
                <span>demo-contact@tixport.com</span>
              </div>
            </div>

            {/* Right - Social Media */}
            <div className="hidden md:flex items-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex items-center">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-bold text-lg">TIXPORT</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-2 sm:mx-4 lg:mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Mobile Navigation Icons */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Link href="/login" className="text-gray-300 hover:text-white p-2 transform transition-all duration-300 hover:scale-110">
                <UserIcon className="h-5 w-5" />
              </Link>
              <Link href="/cart" className="text-gray-300 hover:text-white p-2 relative transform transition-all duration-300 hover:scale-110">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  0
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium flex items-center space-x-1 transform transition-all duration-300 hover:scale-105">
                <UserIcon className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link href="/register" className="text-gray-300 hover:text-white text-sm font-medium transform transition-all duration-300 hover:scale-105">
                Register
              </Link>
              <Link href="/cart" className="text-gray-300 hover:text-white text-sm font-medium relative transform transition-all duration-300 hover:scale-105">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  0
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 animate-fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out animate-slide-in-left" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Logo */}
            <div className="mb-6">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity" onClick={() => setIsMenuOpen(false)}>
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-bold text-lg">TIXPORT</span>
              </Link>
            </div>

            {/* Mobile Menu Content - Same as Sidebar */}
            <div className="mb-8">
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                GET TICKETS
              </h3>
              <div className="mb-4">
                <h4 className="text-gray-300 text-xs font-medium mb-2">YOUR LOCATION</h4>

                {loading ? (
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent mr-2"></div>
                    <span>Detecting...</span>
                  </div>
                ) : location ? (
                  <div className="flex items-center text-white text-sm">
                    <MapPinIcon className="h-4 w-4 mr-2 text-green-500" />
                    <span>{formatLocation()}</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center text-yellow-400 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    <span>Using default</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 text-sm">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <span>Unknown</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Navigation */}
            <div className="mb-8">
              <nav className="space-y-2">
                <Link href="/concerts" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Concerts
                </Link>
                <Link href="/theatre" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Theatre
                </Link>
                <Link href="/sports" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Sports
                </Link>
                <Link href="/sports/nfl" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4" onClick={() => setIsMenuOpen(false)}>
                  NFL Football
                </Link>
                <Link href="/sports/mlb" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4" onClick={() => setIsMenuOpen(false)}>
                  MLB Baseball
                </Link>
                <Link href="/sports/nba" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4" onClick={() => setIsMenuOpen(false)}>
                  NBA Basketball
                </Link>
                <Link href="/sports/nhl" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4" onClick={() => setIsMenuOpen(false)}>
                  NHL Hockey
                </Link>
                <Link href="/sports/mls" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ml-4" onClick={() => setIsMenuOpen(false)}>
                  MLS Soccer
                </Link>
              </nav>
            </div>

            {/* Account Section */}
            <div className="mb-8">
              <h3 className="text-white font-semibold text-sm mb-4">ACCOUNT</h3>
              <nav className="space-y-2">
                <Link href="/login" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link href="/register" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
                <Link href="/cart" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Cart
                </Link>
              </nav>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <nav className="space-y-2">
                <Link href="/contact" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Contact us
                </Link>
                <Link href="/about" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <InformationCircleIcon className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}