'use client';

import Link from 'next/link';
import { Event } from '@/types';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  TicketIcon 
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface EventCardProps {
  event: Event;
  variant?: 'grid' | 'list' | 'compact';
  showImage?: boolean;
  showPrice?: boolean;
  showPerformers?: boolean;
  showCategory?: boolean;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
  onButtonClick?: (event: Event) => void;
}

export function EventCard({
  event,
  variant = 'grid',
  showImage = false,
  showPrice = true,
  showPerformers = true,
  showCategory = false,
  showButton = true,
  buttonText = 'View Tickets',
  className = '',
  onButtonClick
}: EventCardProps) {
  const isCompact = variant === 'compact';
  const isList = variant === 'list';
  const isGrid = variant === 'grid';

  const cardContent = (
    <>
      {/* Event Image (if enabled) */}
      {showImage && (
        <div className={`relative ${isCompact ? 'h-32' : 'h-48'} overflow-hidden rounded-t-lg`}>
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <TicketIcon className="h-12 w-12 text-gray-500" />
          </div>
          {showPrice && event.min_ticket_price && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
              From ${event.min_ticket_price}
            </div>
          )}
          {showCategory && event.category && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white px-2 py-1 rounded text-xs font-medium">
              {event.category.name}
            </div>
          )}
        </div>
      )}

      {/* Event Content */}
      <div className={`${isCompact ? 'p-4' : 'p-6'} ${isList ? 'flex-1' : ''}`}>
        {/* Title */}
        <h3 className={`font-semibold text-white mb-2 line-clamp-2 ${
          isCompact ? 'text-sm' : isGrid ? 'text-lg' : 'text-xl'
        }`}>
          {event.name}
        </h3>
        
        {/* Event Details */}
        <div className={`space-y-2 mb-4 ${isList ? 'flex flex-wrap gap-4' : ''}`}>
          {/* Date and Time */}
          <div className={`flex items-center text-gray-300 text-sm ${isList ? 'mr-4' : ''}`}>
            <CalendarDaysIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
            <span>{event.date}</span>
            <ClockIcon className="h-4 w-4 ml-3 mr-2 text-green-500 flex-shrink-0" />
            <span>{event.time}</span>
          </div>
          
          {/* Location */}
          <div className={`flex items-center text-gray-300 text-sm ${isList ? 'mr-4' : ''}`}>
            <MapPinIcon className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
            <span className="truncate">{event.venue.name}, {event.location}</span>
          </div>

          {/* Price */}
          {showPrice && event.min_ticket_price && !showImage && (
            <div className={`flex items-center text-green-400 text-sm font-semibold ${isList ? 'mr-4' : ''}`}>
              <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>From ${event.min_ticket_price}</span>
            </div>
          )}

          {/* Category (when not shown on image) */}
          {showCategory && event.category && !showImage && (
            <div className={`flex items-center text-gray-400 text-sm ${isList ? 'mr-4' : ''}`}>
              <TicketIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.category.name}</span>
            </div>
          )}
        </div>

        {/* Performers */}
        {showPerformers && event.performers && event.performers.length > 0 && !isList && (
          <div className="mb-4">
            <div className="text-xs text-gray-400">
              <span>{event.performers[0].name}</span>
              {event.performers.length > 1 && (
                <span className="ml-1">+{event.performers.length - 1} more</span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        {showButton && (
          <div className={isList ? 'ml-auto flex-shrink-0' : ''}>
            <Button
              size={isCompact ? 'sm' : 'md'}
              fullWidth={!isList}
              onClick={() => onButtonClick?.(event)}
              className="transform hover:scale-105"
            >
              {buttonText}
            </Button>
          </div>
        )}
      </div>
    </>
  );

  const cardClass = `
    ${isList ? 'flex items-center' : ''}
    hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
    cursor-pointer group transform animate-fade-in-up
    ${className}
  `;

  // Wrap in Link if no custom onClick provided
  if (!onButtonClick && showButton) {
    return (
      <Link href={`/event/${event.id}/buy`}>
        <Card className={cardClass} hover>
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={cardClass} hover={!!onButtonClick}>
      {cardContent}
    </Card>
  );
}

// Preset variants for common use cases
export function GridEventCard({ event, ...props }: Omit<EventCardProps, 'variant'>) {
  return <EventCard {...props} event={event} variant="grid" />;
}

export function ListEventCard({ event, ...props }: Omit<EventCardProps, 'variant'>) {
  return <EventCard {...props} event={event} variant="list" />;
}

export function CompactEventCard({ event, ...props }: Omit<EventCardProps, 'variant'>) {
  return <EventCard {...props} event={event} variant="compact" />;
}

export default EventCard;