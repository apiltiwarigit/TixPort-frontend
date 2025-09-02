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

// Search and Filter Types
export interface EventFilters {
  category?: string;
  location?: string;
  city?: string;
  state?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface LocationInfo {
  city: string;
  state: string;
  country: string;
}

