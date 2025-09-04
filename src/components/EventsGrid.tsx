'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { eventsApi } from '@/lib/api';
import Link from 'next/link';
import { EventFilters, Event } from '@/types';
import { GridEventCard, CompactEventCard, ListEventCard } from '@/components/EventCard';
import { Loading, EmptyState } from '@/components/ui';
import { useCategories } from '@/contexts/CategoryContext';
import { useLocation } from '@/contexts/LocationContext';

export interface EventsGridProps {
  events?: Event[];
  loading?: boolean;
  error?: string | null;
  variant?: 'grid' | 'list' | 'compact' | 'home';
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  showImages?: boolean;
  showPrices?: boolean;
  showPerformers?: boolean;
  showCategories?: boolean;
  className?: string;
  emptyMessage?: string;
  onEventClick?: (event: Event) => void;
}

// Home page specific event card (keeping the original compact style)
function HomeEventCard({ event }: { event: Event }) {
  return (
    <Link href={`/event/${event.id}/buy`}>
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-xs sm:text-sm mb-1 truncate group-hover:text-green-400 transition-colors duration-300">{event.name}</div>
          <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-300">
            {event.date} | {event.time} | {event.venue?.name || 'Unknown Venue'} - {event.location}
          </div>
        </div>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-all duration-300 flex-shrink-0 ml-2 transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function EventsGrid({
  events = [],
  loading = false,
  error = null,
  variant = 'grid',
  columns = { sm: 1, md: 2, lg: 3 },
  showImages = false,
  showPrices = true,
  showPerformers = true,
  showCategories = false,
  className = '',
  emptyMessage = 'No events found',
  onEventClick
}: EventsGridProps) {
  
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm p-4 bg-red-900/20 border border-red-800 rounded">
        <div className="font-medium mb-1">Unable to load events</div>
        <div className="text-xs text-red-300">{error}</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState 
        title="No Events Found" 
        description={emptyMessage}
      />
    );
  }

  // Grid layout classes
  const getGridClasses = () => {
    if (variant === 'list') return 'space-y-4';
    if (variant === 'home') return 'space-y-2 sm:space-y-3';
    
    return `grid gap-4 sm:gap-6 ${
      `grid-cols-${columns.sm || 1} ` +
      `md:grid-cols-${columns.md || 2} ` +
      `lg:grid-cols-${columns.lg || 3}`
    }`;
  };

  const renderEventCard = (event: Event, index: number) => {
    const cardProps = {
      event,
      showImage: showImages,
      showPrice: showPrices,
      showPerformers: showPerformers,
      showCategory: showCategories,
      onButtonClick: onEventClick,
      key: event.id
    };

    const animationDelay = { animationDelay: `${index * 0.1}s` };

    switch (variant) {
      case 'home':
        return (
          <div key={event.id} style={animationDelay}>
            <HomeEventCard event={event} />
          </div>
        );
      case 'list':
        return (
          <div key={event.id} style={animationDelay}>
            <ListEventCard {...cardProps} />
          </div>
        );
      case 'compact':
        return (
          <div key={event.id} style={animationDelay}>
            <CompactEventCard {...cardProps} />
          </div>
        );
      case 'grid':
      default:
        return (
          <div key={event.id} style={animationDelay}>
            <GridEventCard {...cardProps} />
          </div>
        );
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {events.map((event, index) => renderEventCard(event, index))}
    </div>
  );
}

// Legacy EventsGrid component for home page (with API fetching)
interface LegacyEventsGridProps {
  title: string;
  category?: string;
  city?: string;
  state?: string;
  moreButtonText: string;
}

export default function LegacyEventsGrid({ 
  title, 
  category, 
  city, 
  state, 
  moreButtonText 
}: LegacyEventsGridProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { categories } = useCategories();
  const { location } = useLocation();

  // Resolve category ID using the CategoryContext
  useEffect(() => {
    if (!category) {
      setCategoryId(null);
      return;
    }

    // Handle "all" category specially
    if (category.toLowerCase() === 'all') {
      setCategoryId('all');
      return;
    }

    // Find category in the context data
    const findCategoryInTree = (cats: any[]): any => {
      for (const cat of cats) {
        if (cat.name.toLowerCase() === category.toLowerCase() || 
            cat.slug === category.toLowerCase()) {
          return cat;
        }
        if (cat.children && cat.children.length > 0) {
          const found = findCategoryInTree(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    const foundCategory = findCategoryInTree(categories);
    if (foundCategory) {
      setCategoryId(foundCategory.id.toString());
      console.log(`🏷️ [EventsGrid] Resolved category "${category}" to ID: ${foundCategory.id}`);
    } else {
      console.warn(`⚠️ [EventsGrid] Category "${category}" not found in context`);
      setCategoryId(null);
    }
  }, [category, categories]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🌐 [EventsGrid] Making API call with IP geolocation support');

        const filters: EventFilters = {};
        
        // Use resolved category ID for filtering
        if (categoryId) {
          if (categoryId === 'all') {
            // For "all" category, don't set category_id filter to get all events
            console.log(`🏷️ [EventsGrid] Using "all" category - no category filter applied`);
          } else {
            filters.category_id = categoryId;
            console.log(`🏷️ [EventsGrid] Using category ID ${categoryId} for "${category}"`);
          }
        }
        
        // Use IP geolocation for location-based results
        filters.only_with_available_tickets = true;
        filters.within = 60;

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
          console.log('📍 [EventsGrid] Using IP for geolocation:', location.ip);
        } else {
          filters.ip = 'auto';
          console.log('📍 [EventsGrid] No IP available, using auto-detection');
        }

        console.log('🎯 [EventsGrid] Props received:', { category, city, state });
        console.log('📤 [EventsGrid] Official API filters being sent:', filters);

        const response = await eventsApi.getEvents(filters, 1, 5);
        
        // Transform the API response to match our Event interface
        const transformedEvents: Event[] = response.data.events.map((event: any) => {
          const eventDateTime = event.occurs_at_local || event.occurs_at || event.date_time_local;
          const venueAddress = event.venue?.address || {};

          return {
            id: event.id,
            name: event.name,
            date_time_local: eventDateTime,
            venue: {
              id: event.venue?.id || 0,
              name: event.venue?.name || 'Unknown Venue',
              address: venueAddress.street_address || venueAddress.extended_address || '',
              city: venueAddress.locality || venueAddress.city || 'Unknown City',
              state_province: venueAddress.region || venueAddress.state || 'Unknown State',
              country: venueAddress.country_code || 'Unknown Country',
              postal_code: venueAddress.postal_code || '',
              latitude: venueAddress.latitude,
              longitude: venueAddress.longitude
            },
            category: {
              id: event.category?.id || 0,
              name: event.category?.name || 'Unknown Category',
              parent_id: event.category?.parent?.id
            },
            performers: (event.performances || []).map((performance: any) => ({
              id: performance.performer?.id || 0,
              name: performance.performer?.name || 'Unknown Performer',
              category: {
                id: performance.performer?.category?.id || 0,
                name: performance.performer?.category?.name || 'Unknown',
                parent_id: performance.performer?.category?.parent?.id
              },
              primary: performance.primary || false,
              home_team: performance.home_team,
              away_team: performance.away_team
            })),
            min_ticket_price: event.min_ticket_price,
            max_ticket_price: event.max_ticket_price,
            url: event.url || `/event/${event.id}/buy`,
            date: eventDateTime ? new Date(eventDateTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            }).toUpperCase() : 'Unknown Date',
            time: eventDateTime ? new Date(eventDateTime).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }) : 'Unknown Time',
            location: event.venue?.location || `${venueAddress.locality || 'Unknown City'}, ${venueAddress.region || 'Unknown State'}`
          };
        });
        
        setEvents(transformedEvents);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load events';
        setError(errorMessage);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch events when categoryId is resolved (or null for no category)
    if (categoryId !== undefined) {
      fetchEvents();
    }
  }, [categoryId, city, state]);

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
        <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">{title}</h3>
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg animate-pulse">
              <div className="h-3 sm:h-4 bg-gray-600 rounded mb-1 sm:mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full text-xs sm:text-sm opacity-50 cursor-not-allowed">
          {moreButtonText}
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6">
        <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">{title}</h3>
        <div className="text-red-400 text-xs sm:text-sm mb-3 sm:mb-4 p-2 sm:p-3 bg-red-900/20 border border-red-800 rounded">
          <div className="font-medium mb-1">Unable to load events</div>
          <div className="text-xs text-red-300">{error}</div>
        </div>
        <button className="btn-primary w-full text-xs sm:text-sm opacity-50 cursor-not-allowed">
          {moreButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in-up">
      <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">{title}</h3>
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div key={event.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <HomeEventCard event={event} />
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-xs sm:text-sm text-center py-3 sm:py-4 animate-fade-in">
            No events found
          </div>
        )}
      </div>
      <button className="btn-primary w-full text-xs sm:text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {moreButtonText}
      </button>
    </div>
  );
}