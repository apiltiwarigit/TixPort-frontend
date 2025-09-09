export interface LocationData {
  city: string;
  state: string;
  country: string;
  region: string;
  timezone: string;
  ip: string;
  // New fields for precise coordinates
  lat?: number;
  lon?: number;
  source?: 'browser' | 'ip' | 'default';
  accuracy?: 'high' | 'medium' | 'low';
}

export interface LocationError {
  message: string;
  code?: string;
}

class LocationService {
  private cache: LocationData | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  async getCurrentLocation(): Promise<LocationData> {
    console.log('🌍 [LOCATION] Starting location detection...');

    // Check cache first
    if (this.cache && Date.now() < this.cacheExpiry) {
      console.log('📋 [LOCATION] Using cached location:', this.cache);
      return this.cache;
    }

    // Priority 1: Try browser geolocation first (highest accuracy)
    try {
      console.log('🎯 [LOCATION] Attempting browser geolocation (highest priority)...');
      const browserLocation = await this.getBrowserLocationWithCoordinates();
      console.log('✅ [LOCATION] Browser geolocation successful:', browserLocation);
      
      // Cache the result
      this.cache = browserLocation;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      return browserLocation;
    } catch (browserError) {
      console.log('⚠️ [LOCATION] Browser geolocation failed or denied:', browserError instanceof Error ? browserError.message : String(browserError));
    }

    // Priority 2: Fall back to IP geolocation (medium accuracy)
    try {
      console.log('🔍 [LOCATION] Falling back to location-based geolocation...');
      const ipLocation = await this.fetchLocationWithFallback();
      console.log('✅ [LOCATION] IP geolocation successful:', ipLocation);

      // Cache the result
      this.cache = ipLocation;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return ipLocation;
    } catch (ipError) {
      console.error('❌ [LOCATION] IP geolocation failed:', ipError instanceof Error ? ipError.message : String(ipError));
    }

    // Priority 3: Return default location (no coordinates)
    const defaultLocation = this.getDefaultLocation();
    console.log('📍 [LOCATION] Using default location (no geolocation available):', defaultLocation);
    
    // Cache even the default to avoid repeated failures
    this.cache = defaultLocation;
    this.cacheExpiry = Date.now() + (this.CACHE_DURATION / 6); // Shorter cache for default
    
    return defaultLocation;
  }

  private async fetchLocationWithFallback(): Promise<LocationData> {
    const services = [
      this.fetchFromIpapi,
      this.fetchFromIpinfo,
      this.fetchFromIpapiCo
    ];

    for (const service of services) {
      try {
        console.log('🔍 [LOCATION] Trying service:', service.name);
        const location = await service();
        console.log('📍 [LOCATION] Service result:', location);

        if (location && location.city && location.city !== 'Unknown' && location.state && location.state !== 'Unknown') {
          console.log('✅ [LOCATION] Valid location found:', location.city + ', ' + location.state);
          return location;
        } else {
          console.log('⚠️ [LOCATION] Invalid location data, trying next service');
        }
      } catch (error) {
        console.warn('❌ [LOCATION] Service failed:', service.name, error instanceof Error ? error.message : String(error));
        continue;
      }
    }

    throw new Error('All location services failed');
  }

  private async fetchFromIpapi(): Promise<LocationData> {
    console.log('🌐 [IPAPI] Fetching location from ipapi.co...');
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ [IPAPI] HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 [IPAPI] Raw response data:', data);

    const location = {
      city: data.city || 'Unknown',
      state: data.region || data.region_code || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown',
      source: 'ip' as const,
      accuracy: 'medium' as const
    };

    console.log('📍 [IPAPI] Processed location:', location);
    return location;
  }

  private async fetchFromIpinfo(): Promise<LocationData> {
    console.log('🌐 [IPINFO] Fetching location from ipinfo.io...');
    const response = await fetch('https://ipinfo.io/json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ [IPINFO] HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 [IPINFO] Raw response data:', data);

    const [city, state] = data.loc ? data.loc.split(',') : ['Unknown', 'Unknown'];

    const location = {
      city: data.city || city || 'Unknown',
      state: data.region || state || 'Unknown',
      country: data.country || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown',
      source: 'ip' as const,
      accuracy: 'medium' as const
    };

    console.log('📍 [IPINFO] Processed location:', location);
    return location;
  }

  private async fetchFromIpapiCo(): Promise<LocationData> {
    console.log('🌐 [IPAPICO] Fetching location from ipapi.co (fallback)...');
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ [IPAPICO] HTTP error:', response.status, response.statusText);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 [IPAPICO] Raw response data:', data);

    const location = {
      city: data.city || 'Unknown',
      state: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown',
      source: 'ip' as const,
      accuracy: 'medium' as const
    };

    console.log('📍 [IPAPICO] Processed location:', location);
    return location;
  }

  private async getBrowserLocationWithCoordinates(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Extract precise coordinates
            const { latitude, longitude, accuracy } = position.coords;
            console.log('📍 [BROWSER] Got precise coordinates:', { latitude, longitude, accuracy });

            // Use reverse geocoding to get city/state from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );

            if (!response.ok) {
              console.warn('⚠️ [BROWSER] Reverse geocoding failed, using coordinates only');
              // Still return coordinates even if reverse geocoding fails
              const location: LocationData = {
                city: 'Unknown',
                state: 'Unknown',
                country: 'Unknown',
                region: 'Unknown',
                timezone: 'Unknown',
                ip: 'Browser-Geolocation',
                lat: latitude,
                lon: longitude,
                source: 'browser',
                accuracy: accuracy && accuracy < 100 ? 'high' : 'medium'
              };
              resolve(location);
              return;
            }

            const data = await response.json();
            console.log('📍 [BROWSER] Reverse geocoding result:', data);

            const location: LocationData = {
              city: data.city || data.locality || 'Unknown',
              state: data.principalSubdivision || data.principalSubdivisionCode || 'Unknown',
              country: data.countryName || 'Unknown',
              region: data.principalSubdivision || 'Unknown',
              timezone: data.timeZone?.ianaTimeId || 'Unknown',
              ip: 'Browser-Geolocation',
              lat: latitude,
              lon: longitude,
              source: 'browser',
              accuracy: accuracy && accuracy < 100 ? 'high' : 'medium'
            };

            resolve(location);
          } catch (error) {
            console.error('❌ [BROWSER] Reverse geocoding failed:', error instanceof Error ? error.message : String(error));
            reject(error);
          }
        },
        (error) => {
          console.error('❌ [BROWSER] Geolocation error:', error);
          let errorMessage = 'Browser geolocation failed';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'User denied location permission';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,  // Increased timeout for better accuracy
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Keep the old method for compatibility and testing
  private async getBrowserLocation(): Promise<LocationData> {
    // Just call the new method for now
    return this.getBrowserLocationWithCoordinates();
  }

  getDefaultLocation(): LocationData {
    console.log('📍 [DEFAULT] No default location - returning unknown');
    return {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      region: 'Unknown',
      timezone: 'Unknown',
      ip: 'Unknown',
      source: 'default',
      accuracy: 'low'
    };
  }

  // Method to manually set location (for testing or user preference)
  setLocation(location: LocationData): void {
    this.cache = location;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
  }

  // Method to clear cache
  clearCache(): void {
    console.log('🗑️ [CACHE] Clearing location cache');
    this.cache = null;
    this.cacheExpiry = 0;
  }

  // Method to test IP geolocation services directly
  async testLocationServices(): Promise<void> {
    console.log('🧪 [TEST] Testing all location services...');

    const services = [
      { name: 'IPAPI', fn: this.fetchFromIpapi.bind(this) },
      { name: 'IPINFO', fn: this.fetchFromIpinfo.bind(this) },
      { name: 'IPAPICO', fn: this.fetchFromIpapiCo.bind(this) }
    ];

    for (const service of services) {
      try {
        console.log(`🔍 [TEST] Testing ${service.name}...`);
        const result = await service.fn();
        console.log(`✅ [TEST] ${service.name} result:`, result);
      } catch (error) {
        console.error(`❌ [TEST] ${service.name} failed:`, error instanceof Error ? error.message : String(error));
      }
    }

    // Test browser geolocation
    try {
      console.log('🔍 [TEST] Testing browser geolocation...');
      const browserResult = await this.getBrowserLocation();
      console.log('✅ [TEST] Browser geolocation result:', browserResult);
    } catch (error) {
      console.error('❌ [TEST] Browser geolocation failed:', error instanceof Error ? error.message : String(error));
    }
  }

  // Get formatted location string
  formatLocation(location: LocationData): string {
    return `${location.city}, ${location.state}`;
  }

  // Get full location string
  formatFullLocation(location: LocationData): string {
    return `${location.city}, ${location.state}, ${location.country}`;
  }
}

export const locationService = new LocationService();
