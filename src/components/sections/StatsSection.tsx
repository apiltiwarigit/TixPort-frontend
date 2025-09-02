import { ReactNode } from 'react';

interface Stat {
  number: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  columns?: 2 | 3 | 4;
  backgroundColor?: 'dark' | 'darker';
  className?: string;
}

export function StatsSection({
  title,
  subtitle,
  stats,
  columns = 4,
  backgroundColor = 'dark',
  className = ''
}: StatsSectionProps) {
  const backgroundClasses = {
    dark: 'bg-gray-800',
    darker: 'bg-gray-900',
  };

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  };

  return (
    <section className={`${backgroundClasses[backgroundColor]} py-16 sm:py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={`grid ${gridColumns[columns]} gap-8`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              {stat.icon && (
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-purple-600/20 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              )}

              {/* Number */}
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>

              {/* Label */}
              <div className="text-lg sm:text-xl font-semibold text-purple-400 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              {stat.description && (
                <div className="text-gray-400 text-sm max-w-xs mx-auto">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pre-built stats sections
export function DefaultStatsSection() {
  const stats = [
    {
      number: '2M+',
      label: 'Tickets Sold',
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      number: '500K+',
      label: 'Happy Customers',
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      number: '10K+',
      label: 'Events Listed',
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-8 0H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-4" />
        </svg>
      ),
    },
    {
      number: '99.9%',
      label: 'Uptime',
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return <StatsSection stats={stats} title="Trusted by Millions" />;
}
