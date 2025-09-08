// Config service to fetch and cache project configuration
class ConfigService {
  private cache: Map<string, any> = new Map();
  private lastFetch: number = 0;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private inflight: Promise<Record<string, any>> | null = null;

  private async fetchConfig(): Promise<Record<string, any>> {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE}/api/public/config`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch config');
      }
    } catch (error) {
      console.error('Error fetching config:', error);
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): Record<string, any> {
    // Minimal operational defaults only (avoid branding/contact hardcoding)
    return {
      location_search_radius: 60,
      api_cache_duration: 300
    };
  }

  async getConfig(forceRefresh: boolean = false): Promise<Record<string, any>> {
    const now = Date.now();
    
    // Check if we need to refresh the cache
    if (forceRefresh || !this.cache.has('config') || (now - this.lastFetch) > this.cacheTimeout) {
      if (!this.inflight) {
        this.inflight = (async () => {
          const config = await this.fetchConfig();
          this.cache.set('config', config);
          this.lastFetch = Date.now();
          this.inflight = null;
          return config;
        })();
      }
      return this.inflight;
    }

    // Return cached config
    return this.cache.get('config') || this.getDefaultConfig();
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    const config = await this.getConfig();
    return config[key] !== undefined ? config[key] : defaultValue;
  }

  async getLocationSearchRadius(): Promise<number> {
    const radius = await this.getValue('location_search_radius', 60);
    return typeof radius === 'number' ? radius : parseInt(radius) || 60;
  }

  async getContactInfo(): Promise<{
    email: string;
    phone: string;
    address: string;
  }> {
    const config = await this.getConfig();
    return {
      email: config.contact_email || 'support@tixport.com',
      phone: config.contact_phone || '+1-555-123-4567',
      address: config.contact_address || '123 Main St, City, State 12345'
    };
  }

  async getSiteName(): Promise<string> {
    return await this.getValue('site_name', 'TixPort');
  }

  // Clear cache (useful for development or when config changes)
  clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
    console.log('🧹 [ConfigService] Cache cleared');
  }
}

// Export singleton instance
export const configService = new ConfigService();
