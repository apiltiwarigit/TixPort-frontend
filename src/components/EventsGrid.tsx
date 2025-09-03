'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { eventsApi } from '@/lib/api';
import Link from 'next/link';
import { EventFilters } from '@/types';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  location: string;
}

interface EventsGridProps {
  title: string;
  category?: string;
  city?: string;
  state?: string;
  moreButtonText: string;
}

function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}/buy`}>
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-xs sm:text-sm mb-1 truncate group-hover:text-green-400 transition-colors duration-300">{event.name}</div>
          <div className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors duration-300">
            {event.date} | {event.time} | {event.venue} - {event.location}
          </div>
        </div>
        <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-all duration-300 flex-shrink-0 ml-2 transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default function EventsGrid({ title, category, city, state, moreButtonText }: EventsGridProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Allow API call even without city/state since we use IP geolocation
        console.log('🌐 [EventsGrid] Making API call with IP geolocation support');

        const filters: EventFilters = {};
        
        // Use official TicketEvolution API parameters
        if (category) {
          // Map category names to TicketEvolution category IDs
          const categoryMapping: Record<string, string> = {
            'Concerts': '1',
            'Music': '1',
            'Sports': '2',
            'Baseball': '2',
            'Basketball': '2', 
            'Football': '2',
            'Hockey': '2',
            'Theater': '3',
            'Theatre': '3',
            'Comedy': '4'
          };
          filters.category_id = categoryMapping[category] || category;
        }
        
        // Use IP geolocation for location-based results (no city/state needed)
        // The backend will automatically detect the client's IP and use it for geolocation
        filters.only_with_available_tickets = true;
        filters.within = 25; // 25 mile radius
        
        // For first page, explicitly request IP geolocation
        if (!city && !state) {
          // This will trigger backend IP auto-detection
          filters.ip = 'auto'; // Special flag to request IP geolocation
        } else if (city || state) {
          // If city/state are provided, use them as search query (for backward compatibility)
          const locationParts = [];
          if (city) locationParts.push(city);
          if (state) locationParts.push(state);
          filters.q = locationParts.join(', ');
        }

        // Debug: Log what EventsGrid is sending
        console.log('🎯 [EventsGrid] Props received:', { category, city, state });
        console.log('📤 [EventsGrid] Official API filters being sent:', filters);
        console.log('✅ [EventsGrid] Location search query:', filters.q);

        const response = await eventsApi.getEvents(filters, 1, 5);
        
        // Transform the API response to match our Event interface
        const transformedEvents: Event[] = response.data.events.map((event: any) => ({
          id: event.id,
          name: event.name,
          date: new Date(event.event_date || event.date_time_local).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }).toUpperCase(),
          time: new Date(event.event_date || event.date_time_local).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          venue: event.venue?.name || 'Unknown Venue',
          location: `${event.venue?.city || 'Unknown City'}, ${event.venue?.state || 'Unknown State'}`
        }));
        
        setEvents(transformedEvents);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load events';
        setError(errorMessage);
        // Fallback to empty array if API fails
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [category, city, state]);

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
              <EventCard event={event} />
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


