import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TopCounters from '@/components/TopCounters';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showSidebar?: boolean;
  sidebar?: ReactNode;
  fullWidth?: boolean;
  showTopCounters?: boolean;
}

export function PageContainer({
  children,
  className = '',
  showSidebar = false,
  sidebar,
  fullWidth = false,
  showTopCounters = true
}: PageContainerProps) {
  const containerClasses = fullWidth
    ? 'max-w-full'
    : 'max-w-7xl mx-auto';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      {showTopCounters && (
        <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
          <TopCounters />
        </div>
      )}

      <div className={`flex flex-col lg:flex-row ${containerClasses} p-4 sm:p-6 lg:p-8 ${className}`}>
        {showSidebar && sidebar && (
          <div className="hidden lg:block mb-6 lg:mb-0 lg:mr-8">
            {sidebar}
          </div>
        )}

        <main className={`flex-1 ${showSidebar ? 'lg:ml-0' : ''}`}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
