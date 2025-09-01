
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';
import { formatDate, formatPrice } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date_time_local);
  const imageUrl = `https://via.placeholder.com/400x300?text=${encodeURIComponent(event.name)}`;

  return (
    <div className="ticket-card overflow-hidden">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={event.name}
          width={400}
          height={300}
          className="event-image"
        />
        {event.min_ticket_price && (
          <div className="absolute top-4 right-4">
            <span className="price-tag">
              From {formatPrice(event.min_ticket_price)}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(eventDate)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="line-clamp-1">
              {event.venue.name}, {event.venue.city}, {event.venue.state_province}
            </span>
          </div>
          
          {event.category && (
            <div className="flex items-center">
              <TicketIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.category.name}</span>
            </div>
          )}
        </div>

        {event.performers && event.performers.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {event.performers.slice(0, 3).map((performer) => (
                <span
                  key={performer.id}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {performer.name}
                </span>
              ))}
              {event.performers.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  +{event.performers.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {event.min_ticket_price && event.max_ticket_price && (
              <span>
                {formatPrice(event.min_ticket_price)} - {formatPrice(event.max_ticket_price)}
              </span>
            )}
          </div>
          <Link
            href={`/events/${event.id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200"
          >
            Buy Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
