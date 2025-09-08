'use client';

import { useLocation } from '@/contexts/LocationContext';
import { MapPinIcon, GlobeAltIcon, ClockIcon, WifiIcon } from '@heroicons/react/24/outline';

export default function LocationDebug() {
  const { location, loading, error, refreshLocation, updateLocation } = useLocation();

  const handleManualLocation = () => {
    const newLocation = {
      city: 'New York',
      state: 'NY',
      country: 'United States',
      region: 'New York',
      timezone: 'America/New_York',
      ip: 'Manual-Override'
    };
    console.log('🔧 [MANUAL] Setting manual location:', newLocation);
    updateLocation(newLocation);
  };

  const handleTestServices = async () => {
    console.log('🧪 Starting location service tests...');
    // Import the location service dynamically to avoid circular dependencies
    const { locationService } = await import('@/lib/locationService');
    await locationService.testLocationServices();
  };

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
          <span>Location Debug Info</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleTestServices}
            className="text-blue-500 hover:text-blue-400 text-xs font-medium transition-colors duration-200 hover:underline"
            title="Test all location services"
          >
            Test Services
          </button>
          <button
            onClick={handleManualLocation}
            className="text-orange-500 hover:text-orange-400 text-xs font-medium transition-colors duration-200 hover:underline"
            title="Set to New York, NY"
          >
            Manual NY
          </button>
          <button
            onClick={refreshLocation}
            className="text-green-500 hover:text-green-400 text-xs font-medium transition-colors duration-200 hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
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
          <span className="text-gray-300">IP Address:</span>
          <span className="text-white font-medium font-mono">{location.ip}</span>
        </div>

        <div className="flex items-center space-x-2 sm:col-span-2">
          <MapPinIcon className="h-3 w-3 text-blue-400" />
          <span className="text-gray-300">Full Location:</span>
          <span className="text-blue-400 font-medium">{location.city}, {location.state}, {location.country}</span>
        </div>
      </div>

      <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-gray-500">Detection Method:</span>
          <span className="text-green-400">
            {location.ip === 'Browser-Geolocation' ? 'Browser GPS' :
             location.ip === 'Manual-Override' ? 'Manual Override' :
             location.ip === 'Default' ? 'Default Fallback' : 'IP Geolocation'}
          </span>
        </div>
        <div className="text-gray-500 space-y-1">
          <div>💡 If location is incorrect:</div>
          <div className="ml-4 text-xs">
            • Click &quot;Test Services&quot; to debug each location service<br/>
            • Click &quot;Manual NY&quot; to force New York location<br/>
            • Check browser location permissions<br/>
            • Try &quot;Refresh&quot; to re-detect location<br/>
            • Check console logs for detailed debugging info
          </div>
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
