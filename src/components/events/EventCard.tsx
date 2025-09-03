import { ReactNode } from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface EventData {
  id: number;
  name: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  image?: string;
  price?: string;
  category?: string;
  rating?: number;
  description?: string;
  organizer?: string;
  availableTickets?: number;
}

interface EventCardProps {
  event: EventData;
  variant?: 'default' | 'compact' | 'featured';
  showImage?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showButton?: boolean;
  buttonText?: string;
  className?: string;
  onButtonClick?: (event: EventData) => void;
}

export function EventCard({
  event,
  variant = 'default',
  showImage = true,
  showRating = true,
  showPrice = true,
  showButton = true,
  buttonText = 'View Tickets',
  className = '',
  onButtonClick
}: EventCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  const cardContent = (
    <>
      {/* Event Image */}
      {showImage && event.image && (
        <div className={`relative ${isCompact ? 'h-32' : isFeatured ? 'h-64' : 'h-48'} overflow-hidden rounded-t-xl`}>
          <img
            src={event.image}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          {event.category && (
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white px-2 py-1 rounded text-xs font-medium">
              {event.category}
            </div>
          )}
          {showPrice && event.price && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
              {event.price}
            </div>
          )}
        </div>
      )}

      {/* Event Content */}
      <div className={`${isCompact ? 'p-4' : 'p-6'}`}>
        {/* Title and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-bold text-white line-clamp-2 ${isCompact ? 'text-sm' : isFeatured ? 'text-xl' : 'text-lg'}`}>
            {event.name}
          </h3>
          {showRating && event.rating && (
            <div className="flex items-center text-yellow-500 ml-2 flex-shrink-0">
              <StarIcon className="h-4 w-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{event.rating}</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300 text-sm">
            <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>{event.date}</span>
            <ClockIcon className="h-4 w-4 ml-3 mr-2 text-gray-400 flex-shrink-0" />
            <span>{event.time}</span>
          </div>

          <div className="flex items-center text-gray-300 text-sm">
            <MapPinIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>

          {event.availableTickets && (
            <div className="flex items-center text-green-400 text-sm">
              <TicketIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{event.availableTickets.toLocaleString()} tickets available</span>
            </div>
          )}
        </div>

        {/* Description for featured variant */}
        {isFeatured && event.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Action Button */}
        {showButton && (
          <Button
            size={isCompact ? 'sm' : 'md'}
            fullWidth
            onClick={() => onButtonClick?.(event)}
            className="transform hover:scale-105"
          >
            {buttonText}
          </Button>
        )}
      </div>
    </>
  );

  // Wrap in Link if no custom onClick provided
  if (!onButtonClick && showButton) {
    return (
      <Link href={`/event/${event.id}/buy`}>
        <Card
          className={`cursor-pointer hover-lift transition-all duration-300 animate-fade-in-up ${className}`}
          hover
        >
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card
      className={`animate-fade-in-up ${className}`}
      hover={!!onButtonClick}
    >
      {cardContent}
    </Card>
  );
}

// Quick presets for common use cases
export function CompactEventCard({ event, ...props }: Omit<EventCardProps, 'variant'>) {
  return <EventCard {...props} event={event} variant="compact" />;
}

export function FeaturedEventCard({ event, ...props }: Omit<EventCardProps, 'variant'>) {
  return <EventCard {...props} event={event} variant="featured" />;
}
