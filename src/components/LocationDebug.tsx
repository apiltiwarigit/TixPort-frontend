'use client';

import { useLocation } from '@/contexts/LocationContext';
import { MapPinIcon, GlobeAltIcon, ClockIcon, WifiIcon } from '@heroicons/react/24/outline';

export default function LocationDebug() {
  const { location, loading, error, refreshLocation } = useLocation();

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          <span className="text-gray-400 text-sm">Detecting your location...</span>
        </div>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm flex items-center space-x-2">
          <MapPinIcon className="h-4 w-4 text-green-500" />
          <span>Location Detected</span>
        </h3>
        <button
          onClick={refreshLocation}
          className="text-green-500 hover:text-green-400 text-xs font-medium transition-colors duration-200 hover:underline"
        >
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">City:</span>
          <span className="text-white font-medium">{location.city}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <GlobeAltIcon className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">State:</span>
          <span className="text-white font-medium">{location.state}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <GlobeAltIcon className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">Country:</span>
          <span className="text-white font-medium">{location.country}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">Timezone:</span>
          <span className="text-white font-medium">{location.timezone}</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:col-span-2">
          <WifiIcon className="h-3 w-3 text-gray-400" />
          <span className="text-gray-300">IP:</span>
          <span className="text-white font-medium font-mono">{location.ip}</span>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-800 rounded text-yellow-400 text-xs">
          <span className="font-medium">Note:</span> {error} - Using default location
        </div>
      )}
    </div>
  );
}
