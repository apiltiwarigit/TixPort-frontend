export interface LocationData {
  city: string;
  state: string;
  country: string;
  region: string;
  timezone: string;
  ip: string;
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
    // Check cache first
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    try {
      // Try multiple IP geolocation services for better reliability
      const location = await this.fetchLocationWithFallback();
      
      // Cache the result
      this.cache = location;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;
      
      return location;
    } catch (error) {
      console.error('Location detection failed:', error);
      // Return default location as fallback
      return this.getDefaultLocation();
    }
  }

  private async fetchLocationWithFallback(): Promise<LocationData> {
    const services = [
      this.fetchFromIpapi,
      this.fetchFromIpinfo,
      this.fetchFromIpapiCo
    ];

    for (const service of services) {
      try {
        const location = await service();
        if (location && location.city && location.state) {
          return location;
        }
      } catch (error) {
        console.warn('Location service failed, trying next:', error);
        continue;
      }
    }

    throw new Error('All location services failed');
  }

  private async fetchFromIpapi(): Promise<LocationData> {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      city: data.city || 'Unknown',
      state: data.region || data.region_code || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown'
    };
  }

  private async fetchFromIpinfo(): Promise<LocationData> {
    const response = await fetch('https://ipinfo.io/json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const [city, state] = data.loc ? data.loc.split(',') : ['Unknown', 'Unknown'];
    
    return {
      city: data.city || city || 'Unknown',
      state: data.region || state || 'Unknown',
      country: data.country || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown'
    };
  }

  private async fetchFromIpapiCo(): Promise<LocationData> {
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      city: data.city || 'Unknown',
      state: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      ip: data.ip || 'Unknown'
    };
  }

  getDefaultLocation(): LocationData {
    return {
      city: 'New York',
      state: 'NY',
      country: 'United States',
      region: 'New York',
      timezone: 'America/New_York',
      ip: 'Unknown'
    };
  }

  // Method to manually set location (for testing or user preference)
  setLocation(location: LocationData): void {
    this.cache = location;
    this.cacheExpiry = Date.now() + this.CACHE_DURATION;
  }

  // Method to clear cache
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
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
