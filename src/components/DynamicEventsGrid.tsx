'use client';

import { useState, useEffect } from 'react';
// import { configService } from '@/lib/configService';
import EventsGrid from '@/components/EventsGrid';

interface HomepageCategory {
  id: string;
  display_order: number;
  is_active: boolean;
  categories: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function DynamicEventsGrid() {
  const [homepageCategories, setHomepageCategories] = useState<HomepageCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomepageCategories = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE}/api/public/homepage-categories`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch homepage categories');
        }

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setHomepageCategories(data.data);
          setError(null);
          setInfo(null);
        } else {
          // No categories configured - show informational message
          setHomepageCategories([]);
          setError(null);
          setInfo('No featured categories configured. Please contact an administrator.');
        }
      } catch (err) {
        console.error('Error fetching homepage categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
        setInfo(null);
        setHomepageCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3 mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-3 bg-gray-700 border border-gray-600 rounded-lg">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="h-10 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error && homepageCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Failed to Load Categories</h3>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (info && homepageCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-blue-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-white font-semibold mb-2">Information</h3>
          <p className="text-gray-400 text-sm">{info}</p>
        </div>
      </div>
    );
  }

  // Determine grid layout based on number of categories
  const gridColsClass = (() => {
    switch (homepageCategories.length) {
      case 1:
        return 'grid grid-cols-1 max-w-md mx-auto';
      case 2:
        return 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8';
      case 3:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8';
      case 4:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8';
    }
  })();

  return (
    <div className={gridColsClass}>
      {homepageCategories.map((categoryData) => (
        <EventsGrid
          key={categoryData.id}
          title={`Local ${categoryData.categories.name} Events`}
          category={categoryData.categories.name}
          moreButtonText={`More ${categoryData.categories.name} Events`}
        />
      ))}
    </div>
  );
}
