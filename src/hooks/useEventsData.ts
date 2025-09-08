import { useState, useEffect, useRef } from 'react';
import { eventsApi } from '@/lib/api';
import { Event, EventFilters } from '@/types';
import { useLocation } from '@/contexts/LocationContext';
import { configService } from '@/lib/configService';

interface UseEventsDataOptions {
  categoryId?: string | null;
  city?: string;
  state?: string;
  limit?: number;
  page?: number;
}

interface UseEventsDataReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
}

// Global cache to prevent duplicate API calls
const eventCache = new Map<string, { data: Event[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds
const pendingRequests = new Map<string, Promise<Event[]>>();

export function useEventsData({
  categoryId,
  city,
  state,
  limit = 5,
  page = 1
}: UseEventsDataOptions): UseEventsDataReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useLocation();
  const isRequestInProgress = useRef(false);

  useEffect(() => {
    const fetchEvents = async () => {
      // Prevent duplicate calls while already loading
      if (isRequestInProgress.current) {
        console.log('⏳ [useEventsData] Request already in progress, skipping duplicate call');
        return;
      }

      // Create cache key
      const cacheKey = JSON.stringify({
        categoryId,
        city,
        state,
        limit,
        page,
        ip: location?.ip || 'auto'
      });

      // Check cache first
      const cached = eventCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📋 [useEventsData] Using cached data for key:', cacheKey);
        setEvents(cached.data);
        setLoading(false);
        setError(null);
        return;
      }

      // Check if there's already a pending request for this key
      if (pendingRequests.has(cacheKey)) {
        console.log('⏳ [useEventsData] Waiting for pending request for key:', cacheKey);
        try {
          const data = await pendingRequests.get(cacheKey);
          if (data) {
            setEvents(data);
            setLoading(false);
            setError(null);
            return;
          }
        } catch (err) {
          console.error('❌ [useEventsData] Pending request failed:', err);
        }
      }

      try {
        isRequestInProgress.current = true;
        setLoading(true);
        setError(null);
        
        console.log('🌐 [useEventsData] Making API call with IP geolocation support');

        const filters: EventFilters = {};
        
        // Use resolved category ID for filtering
        if (categoryId) {
          if (categoryId === 'all') {
            // For "all" category, don't set category_id filter to get all events
            console.log(`🏷️ [useEventsData] Using "all" category - no category filter applied`);
          } else {
            filters.category_id = categoryId;
            console.log(`🏷️ [useEventsData] Using category ID ${categoryId}`);
          }
        }
        
        // Use IP geolocation for location-based results
        filters.only_with_available_tickets = true;
        filters.within = await configService.getLocationSearchRadius();

        // For first page, explicitly request IP geolocation
        if (!city && !state) {
          filters.ip = 'auto';
        } else if (city || state) {
          const locationParts = [];
          if (city) locationParts.push(city);
          if (state) locationParts.push(state);
          filters.q = locationParts.join(', ');
        }

        // Use IP geolocation - same logic as category page
        if (location && location.ip && location.ip !== 'Unknown' && location.ip !== 'Browser-Geolocation') {
          filters.ip = location.ip;
          console.log('📍 [useEventsData] Using IP for geolocation:', location.ip);
        } else {
          filters.ip = 'auto';
          console.log('📍 [useEventsData] No IP available, using auto-detection');
        }

        console.log('🎯 [useEventsData] Options received:', { categoryId, city, state });
        console.log('📤 [useEventsData] Official API filters being sent:', filters);

        // Create the request promise
        const requestPromise = eventsApi.getEvents(filters, page, limit).then(response => {
        // Transform the API response to match our Event interface
        const transformedEvents: Event[] = (response.data.events as unknown as Array<Record<string, unknown>>).map((event: Record<string, unknown>) => {
            const eventDateTime = event.occurs_at_local || event.occurs_at || event.date_time_local;
            const venueAddress = (event.venue as Record<string, unknown>)?.address as Record<string, unknown> || {};

            return {
              id: event.id as number,
              name: event.name as string,
              date_time_local: eventDateTime as string,
              venue: {
                id: ((event.venue as Record<string, unknown>)?.id as number) || 0,
                name: ((event.venue as Record<string, unknown>)?.name as string) || 'TBA',
                address: (venueAddress.street_address as string) || '',
                city: (venueAddress.locality as string) || (venueAddress.city as string) || 'TBA',
                state_province: (venueAddress.region as string) || (venueAddress.state as string) || 'TBA',
                country: (venueAddress.country_code as string) || 'US',
                postal_code: (venueAddress.postal_code as string) || '',
                latitude: (event.venue as Record<string, unknown>)?.latitude as number,
                longitude: (event.venue as Record<string, unknown>)?.longitude as number,
              },
              category: {
                id: ((event.category as Record<string, unknown>)?.id as number) || 0,
                name: ((event.category as Record<string, unknown>)?.name as string) || 'General',
                parent_id: (((event.category as Record<string, unknown>)?.parent as Record<string, unknown>)?.id as number),
              },
              performers: (event.performers as Array<Record<string, unknown>>)?.map((performer: unknown) => {
                const p = performer as { 
                  id: number; 
                  name: string; 
                  category?: { 
                    id?: number; 
                    name?: string; 
                  }; 
                  primary?: boolean; 
                  home_team?: boolean; 
                  away_team?: boolean; 
                };
                return {
                  id: p.id,
                  name: p.name,
                  category: {
                    id: p.category?.id || 0,
                    name: p.category?.name || 'General',
                  },
                  primary: p.primary || false,
                  home_team: p.home_team || false,
                  away_team: p.away_team || false,
                };
              }) || [],
              min_ticket_price: ((event.stats as Record<string, unknown>)?.min_ticket_price as number),
              max_ticket_price: ((event.stats as Record<string, unknown>)?.max_ticket_price as number),
              url: (event.url as string) || '',
              // Derived fields for backward compatibility
              date: eventDateTime ? new Date(eventDateTime as string).toLocaleDateString() : 'TBA',
              time: eventDateTime ? new Date(eventDateTime as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA',
              location: `${(venueAddress.locality as string) || (venueAddress.city as string) || 'TBA'}, ${(venueAddress.region as string) || (venueAddress.state as string) || 'TBA'}`,
            };
          });

          // Cache the result
          eventCache.set(cacheKey, {
            data: transformedEvents,
            timestamp: Date.now()
          });

          // Remove from pending requests
          pendingRequests.delete(cacheKey);

          return transformedEvents;
        });

        // Store the pending request
        pendingRequests.set(cacheKey, requestPromise);

        const transformedEvents = await requestPromise;
        setEvents(transformedEvents);
        setError(null);

      } catch (err: unknown) {
        console.error('Error fetching events:', err);
        const errorMessage = (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || 
                            (err as { message?: string })?.message || 'Failed to load events';
        setError(errorMessage);
        setEvents([]);
        
        // Remove from pending requests on error
        pendingRequests.delete(cacheKey);
      } finally {
        isRequestInProgress.current = false;
        setLoading(false);
      }
    };

    // Only fetch events when categoryId is resolved (or null for no category)
    if (categoryId !== undefined) {
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        fetchEvents();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [categoryId, city, state, location, limit, page]);

  return { events, loading, error };
}
