import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  overlay?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  children?: ReactNode;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  backgroundImage,
  overlay = true,
  primaryAction,
  secondaryAction,
  children,
  className = ''
}: HeroSectionProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      className={`relative py-16 sm:py-20 lg:py-24 ${backgroundImage ? 'text-white' : 'text-gray-900'} ${className}`}
      style={backgroundStyle}
    >
      {/* Background Overlay */}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Subtitle */}
          {subtitle && (
            <p className="text-purple-400 font-medium text-sm sm:text-base uppercase tracking-wide mb-4">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {/* Actions */}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {primaryAction && (
                <Button
                  size="lg"
                  onClick={primaryAction.onClick}
                  className="transform hover:scale-105"
                >
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={secondaryAction.onClick}
                  className="transform hover:scale-105"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}

          {/* Custom Content */}
          {children}
        </div>
      </div>
    </section>
  );
}

// Pre-built hero sections for common use cases
export function HomeHeroSection({ onBrowseEvents }: { onBrowseEvents?: () => void }) {
  return (
    <HeroSection
      title="Welcome to TixPort"
      subtitle="Premium Ticket Marketplace"
      description="Discover and buy tickets for concerts, sports, theater and more events. Get the best seats with guaranteed authenticity and instant delivery."
      backgroundImage="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
      primaryAction={{
        label: 'Browse Events',
        onClick: onBrowseEvents || (() => {}),
      }}
      secondaryAction={{
        label: 'Learn More',
        onClick: () => {},
      }}
    />
  );
}

export function CategoryHeroSection({
  category,
  description,
  backgroundImage,
  onBrowseEvents
}: {
  category: string;
  description?: string;
  backgroundImage?: string;
  onBrowseEvents?: () => void;
}) {
  return (
    <HeroSection
      title={`${category} Events`}
      subtitle="Live & In-Person"
      description={description || `Discover amazing ${category.toLowerCase()} events and get your tickets now.`}
      backgroundImage={backgroundImage}
      primaryAction={{
        label: `Find ${category} Tickets`,
        onClick: onBrowseEvents || (() => {}),
      }}
    />
  );
}
