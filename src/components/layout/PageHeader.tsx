import { ReactNode } from 'react';
import Link from 'next/link';
import {
  ChevronLeftIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  backTo,
  backLabel,
  actions,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`mb-6 sm:mb-8 ${className}`}>
      {/* Back Navigation */}
      {backTo && (
        <Link
          href={backTo}
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          {backLabel || 'Back'}
        </Link>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          {icon && <div className="mr-4">{icon}</div>}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Quick preset headers for common use cases
export function HomePageHeader({ actions }: { actions?: ReactNode }) {
  return (
    <PageHeader
      title="Welcome to TixPort"
      subtitle="Discover and buy tickets for amazing events"
      icon={<HomeIcon className="h-8 w-8 text-purple-500" />}
      actions={actions}
    />
  );
}

export function CategoryPageHeader({
  category,
  count,
  actions
}: {
  category: string;
  count?: number;
  actions?: ReactNode;
}) {
  return (
    <PageHeader
      title={`${category} Events`}
      subtitle={count ? `Discover ${count} amazing ${category.toLowerCase()} events` : `Find the best ${category.toLowerCase()} events`}
      actions={actions}
    />
  );
}
