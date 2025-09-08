import axios from 'axios';
import { Event, EventsResponse, TicketsResponse, EventFilters } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Global token refresh promise to prevent multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get stored session
const getStoredSession = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_session');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Helper function to store session
const storeSession = (session: any) => {
  if (typeof window === 'undefined') return;
  if (session) {
    localStorage.setItem('auth_session', JSON.stringify(session));
  } else {
    localStorage.removeItem('auth_session');
  }
};

// Function to refresh token
const refreshToken = async () => {
  const session = getStoredSession();
  if (!session?.refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${session.refresh_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success) {
      const newSession = response.data.data.session;
      storeSession(newSession);

      // Dispatch custom event to notify AuthContext of session update
      window.dispatchEvent(new CustomEvent('auth:sessionRefreshed', {
        detail: { session: newSession }
      }));

      return newSession.access_token;
    }

    throw new Error('Token refresh failed');
  } catch (error) {
    console.error('Token refresh failed:', error);
    storeSession(null);

    // Dispatch event to notify AuthContext of logout
    window.dispatchEvent(new CustomEvent('auth:logout'));

    throw error;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);

    // Add auth token to requests if available
    const session = getStoredSession();
    if (session?.access_token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with automatic token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('API Error:', error.response?.data || error.message);

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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



  // Get events for a specific category
  getCategoryEvents: async (id: string | number, page = 1, limit = 20, filters?: any) => {
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

    const response = await api.get(`/categories/${id}/events?${params.toString()}`);
    return response.data;
  },
};

export default api;

