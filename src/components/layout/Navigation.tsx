import { ReactNode } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <Link
        href="/"
        className="text-gray-400 hover:text-purple-400 transition-colors flex items-center"
      >
        <HomeIcon className="h-4 w-4 mr-1" />
        Home
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 text-gray-500 mx-2" />
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? 'text-white font-medium' : 'text-gray-400'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

interface TabItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  className?: string;
}

export function Tabs({ tabs, className = '' }: TabsProps) {
  return (
    <div className={`border-b border-gray-700 ${className}`}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isCurrent = tab.current;
          const content = (
            <span
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                isCurrent
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </span>
          );

          if (tab.href) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="block"
                aria-current={isCurrent ? 'page' : undefined}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={tab.onClick}
              className="block"
              aria-current={isCurrent ? 'page' : undefined}
            >
              {content}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className = '' }: StepIndicatorProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                isCompleted
                  ? 'bg-green-600 text-white'
                  : isCurrent
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            <span
              className={`ml-2 text-sm ${
                isCurrent ? 'text-white font-medium' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="ml-4 w-8 h-px bg-gray-600" />
            )}
          </div>
        );
      })}
    </div>
  );
}
