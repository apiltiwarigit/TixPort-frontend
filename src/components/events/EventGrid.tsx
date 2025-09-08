// import { ReactNode } from 'react';
import { EventCard, EventData } from './EventCard';
import { LoadingCard, EmptyEvents } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface EventGridProps {
  events: EventData[];
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured';
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

export function EventGrid({
  events,
  loading = false,
  error = null,
  title,
  subtitle,
  columns = 3,
  variant = 'default',
  showImages = true,
  showRatings = true,
  showPrices = true,
  showButtons = true,
  buttonText,
  moreButtonText,
  onMoreClick,
  onEventClick,
  className = '',
  emptyState
}: EventGridProps) {
  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
          </CardHeader>
        )}
        <div className={`grid ${gridColumns[columns]} gap-4 sm:gap-6 lg:gap-8`}>
          {[...Array(columns * 2)].map((_, i) => (
            <LoadingCard key={i} />
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
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
          </CardHeader>
        )}
        <Card>
          <CardContent>
            <div className="text-center py-8">
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
          </CardContent>
        </Card>
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
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
          </CardHeader>
        )}
        <Card>
          <CardContent>
            <EmptyEvents
              title={emptyTitle}
              description={emptyDescription}
              onBrowse={emptyAction?.onClick}
            />
          </CardContent>
        </Card>
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

      {/* Events Grid */}
      <div className={`grid ${gridColumns[columns]} gap-4 sm:gap-6 lg:gap-8 mb-8`}>
        {events.map((event, index) => (
          <div
            key={event.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <EventCard
              event={event}
              variant={variant}
              showImage={showImages}
              showRating={showRatings}
              showPrice={showPrices}
              showButton={showButtons}
              buttonText={buttonText}
              onButtonClick={onEventClick}
            />
          </div>
        ))}
      </div>

      {/* More Button */}
      {moreButtonText && onMoreClick && (
        <div className="text-center">
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

// Quick preset grids for common use cases
export function CompactEventGrid(props: Omit<EventGridProps, 'variant'>) {
  return <EventGrid {...props} variant="compact" columns={2} />;
}

export function FeaturedEventGrid(props: Omit<EventGridProps, 'variant'>) {
  return <EventGrid {...props} variant="featured" columns={2} />;
}

export function CategoryEventGrid({
  category,
  events,
  loading,
  error,
  onMoreClick,
  ...props
}: Omit<EventGridProps, 'title' | 'subtitle' | 'moreButtonText'> & {
  category: string;
}) {
  return (
    <EventGrid
      {...props}
      events={events}
      loading={loading}
      error={error}
      title={`${category} Events`}
      subtitle={`Discover amazing ${category.toLowerCase()} events`}
      moreButtonText={`More ${category} Events`}
      onMoreClick={onMoreClick}
    />
  );
}
