import { ReactNode } from 'react';
import Link from 'next/link';
import {
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { EventData } from './EventCard';
import { LoadingSkeleton, EmptyEvents } from '@/components/ui';
import { Button } from '@/components/ui/Button';

interface EventListProps {
  events: EventData[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  showImages?: boolean;
  showRatings?: boolean;
  showPrices?: boolean;
  showButtons?: boolean;
  buttonText?: string;
  moreButtonText?: string;
  onMoreClick?: () => void;
  onEventClick?: (event: EventData) => void;
  className?: string;
  emptyState?: {
    title?: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export function EventList({
  events,
  loading = false,
  error = null,
  title,
  subtitle,
  showImages = false,
  showRatings = true,
  showPrices = true,
  showButtons = true,
  buttonText = 'View Tickets',
  moreButtonText,
  onMoreClick,
  onEventClick,
  className = '',
  emptyState
}: EventListProps) {
  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {title && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <LoadingSkeleton className="h-5 w-3/4 mb-2" />
                  <LoadingSkeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center space-x-4">
                  <LoadingSkeleton className="h-8 w-20" />
                  <LoadingSkeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        {title && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-2">Unable to load events</div>
          <div className="text-red-300 text-sm">{error}</div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!events || events.length === 0) {
    const emptyTitle = emptyState?.title || 'No events found';
    const emptyDescription = emptyState?.description || 'Try adjusting your search or filters to find more events.';
    const emptyAction = emptyState?.action;

    return (
      <div className={className}>
        {title && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <EmptyEvents
          title={emptyTitle}
          description={emptyDescription}
          onBrowse={emptyAction?.onClick}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm sm:text-base">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Events List */}
      <div className="space-y-3">
        {events.map((event, index) => {
          const eventContent = (
            <div className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:shadow-lg animate-fade-in-up">
              {/* Event Image (optional) */}
              {showImages && event.image && (
                <div className="w-16 h-16 flex-shrink-0 mr-4 overflow-hidden rounded-lg">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-medium text-sm sm:text-base truncate group-hover:text-green-400 transition-colors duration-300">
                    {event.name}
                  </h3>
                  {showRatings && event.rating && (
                    <div className="flex items-center text-yellow-500 ml-2 flex-shrink-0">
                      <StarIcon className="h-4 w-4 mr-1 fill-current" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  )}
                </div>

                <div className="text-gray-400 text-xs sm:text-sm space-y-1">
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span>{event.date}</span>
                    <ClockIcon className="h-3 w-3 ml-3 mr-2 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.venue}, {event.location}</span>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center space-x-4 ml-4">
                {showPrices && event.price && (
                  <div className="text-green-400 font-semibold text-sm sm:text-base flex-shrink-0">
                    {event.price}
                  </div>
                )}

                {showButtons && (
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className="transform hover:scale-105"
                    >
                      {buttonText}
                    </Button>
                  </div>
                )}

                <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover:text-white transition-all duration-300 flex-shrink-0 transform group-hover:translate-x-1" />
              </div>
            </div>
          );

          // Wrap in Link if no custom onClick provided
          if (!onEventClick && showButtons) {
            return (
              <Link key={event.id} href={`/event/${event.id}/buy`}>
                {eventContent}
              </Link>
            );
          }

          return (
            <div
              key={event.id}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => onEventClick?.(event)}
            >
              {eventContent}
            </div>
          );
        })}
      </div>

      {/* More Button */}
      {moreButtonText && onMoreClick && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onMoreClick}
            className="transform hover:scale-105"
          >
            {moreButtonText}
          </Button>
        </div>
      )}
    </div>
  );
}

// Search results variant
export function SearchEventList(props: Omit<EventListProps, 'showImages' | 'showRatings' | 'showPrices'>) {
  return <EventList {...props} showImages={true} showRatings={true} showPrices={true} />;
}
