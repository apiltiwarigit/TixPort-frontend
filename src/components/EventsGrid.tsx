'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { eventsApi } from '@/lib/api';

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
    <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer group">
      <div className="flex-1">
        <div className="text-white font-medium text-sm mb-1">{event.name}</div>
        <div className="text-gray-400 text-xs">
          {event.date} | {event.time} | {event.venue} - {event.location}
        </div>
      </div>
      <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
    </div>
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
        
        const filters: any = {};
        if (category) filters.category = category;
        if (city) filters.city = city;
        if (state) filters.state = state;
        
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
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
        <div className="space-y-3 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-700 border border-gray-600 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <button className="btn-primary w-full text-sm opacity-50 cursor-not-allowed">
          {moreButtonText}
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
        <div className="text-red-400 text-sm mb-4 p-3 bg-red-900/20 border border-red-800 rounded">
          <div className="font-medium mb-1">Unable to load events</div>
          <div className="text-xs text-red-300">{error}</div>
        </div>
        <button className="btn-primary w-full text-sm opacity-50 cursor-not-allowed">
          {moreButtonText}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      <div className="space-y-3 mb-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="text-gray-400 text-sm text-center py-4">
            No events found
          </div>
        )}
      </div>
      <button className="btn-primary w-full text-sm">
        {moreButtonText}
      </button>
    </div>
  );
}


