import { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  };
  children?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  children
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16">
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm sm:text-base mb-6 max-w-md mx-auto">
        {description}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || 'primary'}
        >
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
}

// Pre-built common empty states
export function EmptyEvents({
  onBrowse,
  title = 'No events found',
  description = 'Try adjusting your search or filters to find more events.'
}: {
  onBrowse?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={onBrowse ? {
        label: 'Browse All Events',
        onClick: onBrowse
      } : undefined}
    />
  );
}

export function EmptyCart({
  onBrowse,
  title = 'Your cart is empty',
  description = 'Add some tickets to get started!'
}: {
  onBrowse?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={onBrowse ? {
        label: 'Browse Events',
        onClick: onBrowse
      } : undefined}
    />
  );
}
