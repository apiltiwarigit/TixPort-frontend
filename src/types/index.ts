// Event and Ticket Types
export interface Event {
  id: number;
  name: string;
  date_time_local: string;
  venue: Venue;
  category: Category;
  performers: Performer[];
  min_ticket_price?: number;
  max_ticket_price?: number;
  url: string;
  // Simplified fields for backward compatibility (derived from above fields)
  date?: string;
  time?: string;
  location?: string;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state_province: string;
  country: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
}

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
}

export interface Performer {
  id: number;
  name: string;
  category: Category;
  primary: boolean;
  home_team?: boolean;
  away_team?: boolean;
}

export interface Ticket {
  id: number;
  event_id: number;
  section: string;
  row: string;
  seat_from: string;
  seat_to: string;
  quantity: number;
  price: number;
  total_price: number;
  type: string;
  retail_price?: number;
  zone?: string;
  notes?: string;
}

// API Response Types
export interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    pagination: {
      current_page: number;
      per_page: number;
      total_entries: number;
      total_pages: number;
    };
    filters: any;
  };
}

export interface TicketsResponse {
  tickets: Ticket[];
  current_page: number;
  per_page: number;
  total_entries: number;
}

// Search and Filter Types - Official TicketEvolution API Parameters
export interface EventFilters {
  // Official API parameters
  name?: string;                    // Exact name of the event
  venue_id?: number;               // Venue at which the event occurs
  performer_id?: number;           // Show only events at which this performer will perform
  primary_performer?: boolean;     // Only events where performer_id is primary
  category_id?: string;            // Show only events in this category
  category_tree?: boolean;         // Include sub-categories
  q?: string;                      // Full-text search events
  fuzzy?: boolean;                 // Fuzzy full text search
  'occurs_at.gte'?: string;        // Date from (ISO 8601)
  'occurs_at.lte'?: string;        // Date to (ISO 8601)
  updated_at?: string;             // Updated at filter
  popularity_score?: number;       // Long term popularity score
  short_term_popularity_score?: number; // Short term popularity score
  office_id?: number;              // Show only events for which this office has tickets
  
  // Geolocation parameters
  lat?: number;                    // Latitude for geolocated searches
  lon?: number;                    // Longitude for geolocated searches
  within?: number;                 // Radius in miles (default 15)
  ip?: string;                     // Infer location by IP address
  postal_code?: string;            // Infer location by postal code
  city_state?: string;             // Infer location by city and state
  country_code?: string;           // ISO 3166 Alpha-2 country code
  
  // Ticket filtering
  only_with_tickets?: boolean;     // Show only events with inventory
  only_with_available_tickets?: boolean; // Show only events with available tickets
  only_discounted?: boolean;       // Show only events with discounted tickets
  
  // Time and ordering
  by_time?: 'day' | 'night';       // Show events during day (4AM-4PM) or night
  order_by?: string;               // Order by parameter and sorting order
  
  // Legacy support (will be removed)
  category?: string;               // @deprecated - use category_id
  city?: string;                   // @deprecated - use ip, lat/lon, or q
  state?: string;                  // @deprecated - use ip, lat/lon, or q
  search?: string;                 // @deprecated - use q
  dateFrom?: string;               // @deprecated - use occurs_at.gte
  dateTo?: string;                 // @deprecated - use occurs_at.lte
  minPrice?: number;               // Client-side filtering
  maxPrice?: number;               // Client-side filtering
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
}

