'use client';

import { MapPinIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';

interface LocationDisplayProps {
  className?: string;
  showFullLocation?: boolean;
  showChangeButton?: boolean;
}

export default function LocationDisplay({ 
  className = '', 
  showFullLocation = false,
  showChangeButton = true
}: LocationDisplayProps) {
  const { location, loading, error, formatLocation, formatFullLocation } = useLocation();

  const handleChangeLocation = () => {
    // This will be implemented later for manual location selection
    console.log('Change location clicked');
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
        <span className="text-gray-400 text-sm">Detecting location...</span>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
        <span className="text-yellow-500 text-sm">{error}</span>
      </div>
    );
  }

  if (!location) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1 animate-fade-in-up">
        <MapPinIcon className="h-4 w-4 text-green-500 animate-pulse" />
        <span className="text-white font-medium text-sm sm:text-base">
          Events Near {formatLocation()}
        </span>
      </div>
      
      {showFullLocation && (
        <div className="flex items-center space-x-1 text-gray-400 text-xs animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <GlobeAltIcon className="h-3 w-3" />
          <span>{formatFullLocation()}</span>
        </div>
      )}
      
      {showChangeButton && (
        <button
          onClick={handleChangeLocation}
          className="text-green-500 hover:text-green-400 text-sm font-medium transition-all duration-200 hover:underline transform hover:scale-105 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          (change location)
        </button>
      )}
      
      {error && (
        <div className="flex items-center space-x-1 text-yellow-500 text-xs animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <ExclamationTriangleIcon className="h-3 w-3" />
          <span>Using default</span>
        </div>
      )}
    </div>
  );
}
