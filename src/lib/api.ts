import axios from 'axios';
import { Event, EventsResponse, TicketsResponse, EventFilters } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Events API
export const eventsApi = {
  // Get all events with optional filters
  getEvents: async (filters?: EventFilters, page = 1, limit = 20): Promise<EventsResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Get single event by ID
  getEvent: async (eventId: number): Promise<Event> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Get events by category
  getEventsByCategory: async (categoryId: number, page = 1, limit = 20): Promise<EventsResponse> => {
    const response = await api.get(`/events/category/${categoryId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get events by location
  getEventsByLocation: async (city: string, state?: string, page = 1, limit = 20): Promise<EventsResponse> => {
    const params = new URLSearchParams();
    params.append('city', city);
    if (state) params.append('state', state);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get(`/events/location?${params.toString()}`);
    return response.data;
  },
};

// Tickets API
export const ticketsApi = {
  // Get tickets for an event
  getEventTickets: async (eventId: number, page = 1, limit = 20): Promise<TicketsResponse> => {
    const response = await api.get(`/tickets/event/${eventId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get ticket details
  getTicket: async (ticketId: number) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get popular categories
  getPopularCategories: async () => {
    const response = await api.get('/categories/popular');
    return response.data;
  },
};

export default api;
