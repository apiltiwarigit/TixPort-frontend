'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locationService, LocationData } from '@/lib/locationService';

interface LocationContextType {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  updateLocation: (newLocation: LocationData) => void;
  refreshLocation: () => Promise<void>;
  formatLocation: () => string;
  formatFullLocation: () => string;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const locationData = await locationService.getCurrentLocation();
      setLocation(locationData);
    } catch (err) {
      console.error('Failed to fetch location:', err);
      setError('Unable to detect location');
      // Set default location on error
      const defaultLocation = locationService.getDefaultLocation();
      setLocation(defaultLocation);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const updateLocation = (newLocation: LocationData) => {
    setLocation(newLocation);
    locationService.setLocation(newLocation);
  };

  const refreshLocation = async () => {
    locationService.clearCache();
    await fetchLocation();
  };

  const formatLocation = () => {
    return location ? locationService.formatLocation(location) : 'Unknown Location';
  };

  const formatFullLocation = () => {
    return location ? locationService.formatFullLocation(location) : 'Unknown Location';
  };

  const value: LocationContextType = {
    location,
    loading,
    error,
    updateLocation,
    refreshLocation,
    formatLocation,
    formatFullLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
