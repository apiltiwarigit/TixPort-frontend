// import { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  backgroundColor?: 'gradient' | 'dark' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CTASection({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundColor = 'gradient',
  size = 'md',
  className = ''
}: CTASectionProps) {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
    dark: 'bg-gray-900',
    purple: 'bg-purple-600',
  };

  const sizeClasses = {
    sm: 'py-12 sm:py-16',
    md: 'py-16 sm:py-20',
    lg: 'py-20 sm:py-24',
  };

  return (
    <section className={`${backgroundClasses[backgroundColor]} ${sizeClasses[size]} ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtitle */}
        {subtitle && (
          <p className="text-purple-200 font-medium text-sm sm:text-base uppercase tracking-wide mb-4">
            {subtitle}
          </p>
        )}

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant={backgroundColor === 'dark' ? 'primary' : 'secondary'}
            onClick={primaryAction.onClick}
            className="transform hover:scale-105"
          >
            {primaryAction.label}
          </Button>

          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
              className="transform hover:scale-105 border-white text-white hover:bg-white hover:text-gray-900"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// Pre-built CTA sections for common use cases
export function NewsletterCTA({ onSubscribe }: { onSubscribe?: () => void }) {
  return (
    <CTASection
      title="Stay in the Loop"
      subtitle="Newsletter"
      description="Get exclusive access to ticket presales, special offers, and the latest event announcements."
      primaryAction={{
        label: 'Subscribe Now',
        onClick: onSubscribe || (() => {}),
      }}
      backgroundColor="purple"
      size="md"
    />
  );
}

export function BrowseEventsCTA({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <CTASection
      title="Ready to Experience Something Amazing?"
      subtitle="Start Exploring"
      description="Browse thousands of events and find your perfect night out. Tickets start at just $10!"
      primaryAction={{
        label: 'Browse Events',
        onClick: onBrowse || (() => {}),
      }}
      secondaryAction={{
        label: 'View Categories',
        onClick: () => {},
      }}
      backgroundColor="gradient"
      size="lg"
    />
  );
}

export function JoinCommunityCTA({ onJoin }: { onJoin?: () => void }) {
  return (
    <CTASection
      title="Join Our Community"
      subtitle="Connect & Discover"
      description="Connect with fellow event enthusiasts, share experiences, and discover new events together."
      primaryAction={{
        label: 'Join Community',
        onClick: onJoin || (() => {}),
      }}
      backgroundColor="dark"
      size="md"
    />
  );
}
