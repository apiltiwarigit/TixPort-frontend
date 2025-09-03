'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroSection from '@/components/HeroSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import EventsGrid from '@/components/EventsGrid';
import Footer from '@/components/Footer';
import LocationDisplay from '@/components/LocationDisplay';

import TopCounters from '@/components/TopCounters';
import { useLocation } from '@/contexts/LocationContext';
import { useEffect, useState } from 'react';
import { locationService } from '@/lib/locationService';

export default function Home() {
  const { location, loading, error } = useLocation();
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<string | null>(null);

  useEffect(() => {
    // Clear cache on component mount to ensure fresh location detection
    locationService.clearCache();
    console.log('🧹 [HOME] Cleared location cache for fresh detection');

    if (location && location.city !== 'Unknown' && location.state !== 'Unknown') {
      console.log('🏙️ [HOME] Using detected location:', location.city, location.state);
      setCurrentCity(location.city);
      setCurrentState(location.state);
    } else {
      console.log('📍 [HOME] No valid location detected');
      setCurrentCity(null);
      setCurrentState(null);
    }
  }, [location]);

  // Debug: Log current values being used
  console.log('🔍 [HOME] Current values for EventsGrid:', { currentCity, currentState });
  console.log('📍 [HOME] Location context state:', { location, loading, error });
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      {/* Top Counters */}
      <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
        <TopCounters />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Guarantee Section */}
          <div className="mb-6 sm:mb-8">
            <GuaranteeSection />
          </div>



          {/* Events Near Location */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <LocationDisplay 
                className="text-xl sm:text-2xl font-bold"
                showChangeButton={true}
              />
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-400">Detecting your location...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
                <div className="text-yellow-400 mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">Location Detection Failed</h3>
                <p className="text-gray-400 text-sm">
                  Unable to detect your location. Please enable location services or try refreshing the page.
                </p>
              </div>
            </div>
          ) : (
            // Always show events using IP geolocation - no need to wait for location detection
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <EventsGrid
                title={`Local Concerts Events`}
                category="Concerts"
                moreButtonText="More Concerts Events"
              />
              <EventsGrid
                title={`Local Sports Events`}
                category="Sports"
                moreButtonText="More Sports Events"
              />
              <EventsGrid
                title={`Local Theatre Events`}
                category="Theater"
                moreButtonText="More Theatre Events"
              />
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}