'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { categoriesApi, eventsApi } from '@/lib/api';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import TopCounters from '@/components/TopCounters';
import { Event, Category } from '@/types';
import { useLocation } from '@/contexts/LocationContext';

interface CategoryPageData {
  category: Category | null;
  events: Event[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;
  const { location } = useLocation();

  const [data, setData] = useState<CategoryPageData>({
    category: null,
    events: [],
    loading: true,
    error: null,
    pagination: {
      current_page: 1,
      per_page: 20,
      total_entries: 0,
      total_pages: 0
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [locationBased, setLocationBased] = useState(false);

  useEffect(() => {
    loadCategoryData();
  }, [categoryId, currentPage, locationBased]);

  const loadCategoryData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      let eventsResponse;
      let categoryInfo;

      if (locationBased && categoryId !== 'all') {
        // When location-based is enabled for specific categories, we need to get category info separately
        try {
          const categoryResponse = await categoriesApi.getCategoryEvents(categoryId, 1, 1);
          if (categoryResponse.success && categoryResponse.data.events.length > 0) {
            categoryInfo = categoryResponse.data.events[0].category;
          }
        } catch (error) {
          console.warn('Failed to get category info:', error);
        }

        // Load events with location-based filtering
        const filters: any = {
          only_with_available_tickets: true,
          within: 60, // 60 mile radius
          category_id: categoryId // Always include category filter for specific categories
        };

        // Apply location-based filtering if we have location data
        if (location && location.city !== 'Unknown' && location.state !== 'Unknown') {
          filters.q = `${location.city}, ${location.state}`;
        } else {
          // Fallback to IP-based geolocation
          filters.ip = 'auto';
        }

        eventsResponse = await eventsApi.getEvents(filters, currentPage, 20);
      } else {
        // Load events for the category (original behavior)
        eventsResponse = await categoriesApi.getCategoryEvents(categoryId, currentPage, 20);
      }

      if (!eventsResponse.success) {
        throw new Error(eventsResponse.message || 'Failed to load events');
      }

      // Transform events data to match our Event interface
      const transformedEvents: Event[] = eventsResponse.data.events.map((event: any) => {
        const eventDateTime = event.occurs_at_local || event.occurs_at || event.date_time_local;
        const venueAddress = event.venue?.address || {};

        return {
          id: event.id,
          name: event.name,
          date_time_local: eventDateTime,
          venue: {
            id: event.venue?.id || 0,
            name: event.venue?.name || 'TBA',
            address: venueAddress.street_address || '',
            city: venueAddress.locality || venueAddress.city || 'TBA',
            state_province: venueAddress.region || venueAddress.state || 'TBA',
            country: venueAddress.country_code || 'US',
            postal_code: venueAddress.postal_code || '',
            latitude: event.venue?.latitude,
            longitude: event.venue?.longitude,
          },
          category: {
            id: event.category?.id || 0,
            name: event.category?.name || 'General',
            parent_id: event.category?.parent?.id,
          },
          performers: event.performers?.map((performer: any) => ({
            id: performer.id,
            name: performer.name,
            category: {
              id: performer.category?.id || 0,
              name: performer.category?.name || 'General',
            },
            primary: performer.primary || false,
            home_team: performer.home_team || false,
            away_team: performer.away_team || false,
          })) || [],
          min_ticket_price: event.stats?.min_ticket_price,
          max_ticket_price: event.stats?.max_ticket_price,
          url: event.url || '',
          // Derived fields for backward compatibility
          date: eventDateTime ? new Date(eventDateTime).toLocaleDateString() : 'TBA',
          time: eventDateTime ? new Date(eventDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA',
          location: `${venueAddress.locality || venueAddress.city || 'TBA'}, ${venueAddress.region || venueAddress.state || 'TBA'}`,
        };
      });

      // Extract category info from the first event if available
      if (!categoryInfo) {
        if (categoryId === 'all') {
          categoryInfo = {
            id: 0,
            name: 'All Events',
            parent_id: undefined
          };
        } else if (transformedEvents.length > 0) {
          // Try to find an event with the correct category ID first
          const matchingEvent = transformedEvents.find(event =>
            event.category.id.toString() === categoryId ||
            event.category.id === parseInt(categoryId)
          );

          if (matchingEvent) {
            categoryInfo = matchingEvent.category;
          } else if (transformedEvents[0].category.name && transformedEvents[0].category.name !== 'General') {
            // Use the first event's category if it has a real name
            categoryInfo = transformedEvents[0].category;
          } else {
            // Fallback to a generic category name based on ID
            categoryInfo = {
              id: parseInt(categoryId),
              name: `Category ${categoryId}`,
              parent_id: undefined
            };
          }
        } else {
          categoryInfo = {
            id: parseInt(categoryId),
            name: `Category ${categoryId}`,
            parent_id: undefined
          };
        }
      }

      setData({
        category: categoryInfo,
        events: transformedEvents,
        loading: false,
        error: null,
        pagination: eventsResponse.data.pagination
      });

    } catch (error: any) {
      console.error('Error loading events data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load events data'
      }));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= data.pagination.total_pages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  if (data.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
          <TopCounters />
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {/* Category Header Skeleton */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 sm:p-8 border border-gray-700">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gray-700/50 p-3 rounded-full">
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  </div>
                  <div>
                    <div
                      className="h-8 bg-gray-700 rounded mb-2 w-64"
                      style={{
                        animation: 'twinkle-blur 2s ease-in-out infinite',
                        filter: 'blur(1px)'
                      }}
                    ></div>
                    <div
                      className="h-5 bg-gray-700 rounded w-96"
                      style={{
                        animation: 'twinkle-blur 2s ease-in-out infinite',
                        filter: 'blur(0.8px)'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {/* Total Count Skeleton */}
                  <div className="bg-gray-700/50 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 mr-1">Total:</span>
                    <div
                      className="inline-block h-4 bg-gray-600 rounded w-8"
                      style={{
                        animation: 'twinkle-blur 2s ease-in-out infinite',
                        filter: 'blur(1px)'
                      }}
                    ></div>
                  </div>
                  {/* Showing Range Skeleton */}
                  <div className="bg-gray-700/50 px-3 py-2 rounded-lg">
                    <span className="text-gray-400 mr-1">Showing:</span>
                    <div
                      className="inline-block h-4 bg-gray-600 rounded w-12"
                      style={{
                        animation: 'twinkle-blur 2s ease-in-out infinite',
                        filter: 'blur(1px)'
                      }}
                    ></div>
                  </div>
                  {/* Location Toggle Skeleton */}
                  <div className="bg-gray-700/50 px-3 py-2 rounded-lg flex items-center">
                    <span className="text-gray-400 mr-2">Nearby:</span>
                    <div className="h-5 w-9 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animation: 'twinkle-blur 2s ease-in-out infinite',
                    filter: 'blur(1px)'
                  }}
                >
                  <div className="p-6">
                    {/* Event Title Skeleton */}
                    <div className="h-6 bg-gray-700 rounded mb-4 w-3/4 animate-pulse"></div>

                    <div className="space-y-3 mb-4">
                      {/* Date/Time Skeleton */}
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-600 rounded w-32 animate-pulse"></div>
                      </div>

                      {/* Location Skeleton */}
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-600 rounded mr-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-600 rounded w-40 animate-pulse"></div>
                      </div>

                      {/* Price Skeleton (sometimes shown) */}
                      {i % 3 === 0 && (
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-600 rounded mr-2 animate-pulse"></div>
                          <div className="h-4 bg-gray-600 rounded w-24 animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Bottom section */}
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-gray-600 rounded w-16 animate-pulse"></div>
                      <div className="h-8 bg-gray-700 rounded px-3 py-1 w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div
              className="flex justify-center items-center space-x-2"
              style={{
                animation: 'twinkle-blur 2s ease-in-out infinite',
                filter: 'blur(0.5px)'
              }}
            >
              <div className="h-10 bg-gray-700 rounded px-4 w-20"></div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 w-10 bg-gray-700 rounded"></div>
                ))}
              </div>
              <div className="h-10 bg-gray-700 rounded px-4 w-20"></div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
        <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
          <TopCounters />
        </div>
        <div className="flex flex-col lg:flex-row">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="text-center py-20">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2 text-xl">Error Loading Events</h3>
                <p className="text-gray-400">{data.error}</p>
                <button 
                  onClick={loadCategoryData}
                  className="mt-4 btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      {/* Top Counters */}
      <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
        <TopCounters />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Category Header */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 sm:p-8 border border-gray-700">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {data.category?.name === 'All Events' ? 'All Events' : `${data.category?.name || 'Category'} Events`}
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Discover amazing {data.category?.name === 'All Events' ? 'events from all categories' : `${data.category?.name?.toLowerCase() || 'category'} events`}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Stats */}
              <div className="flex flex-wrap gap-3 text-sm">
                {/* Total Count */}
                <div className="bg-gray-800/50 px-3 py-2 rounded-lg">
                  <span className="text-gray-400">Total: </span>
                  <span className="text-white font-semibold">{data.pagination.total_entries}</span>
                </div>

                {/* Currently Visible Range */}
                <div className="bg-gray-800/50 px-3 py-2 rounded-lg">
                  <span className="text-gray-400">Showing: </span>
                  <span className="text-white font-semibold">
                    {data.pagination.total_entries === 0
                      ? '0'
                      : `${((currentPage - 1) * data.pagination.per_page) + 1} - ${Math.min(currentPage * data.pagination.per_page, data.pagination.total_entries)}`
                    }
                  </span>
                </div>

                {/* Location Toggle */}
                <div className="bg-gray-800/50 px-3 py-2 rounded-lg flex items-center">
                  <span className="text-gray-400 mr-2">Nearby:</span>
                  <button
                    onClick={() => setLocationBased(!locationBased)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      locationBased ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        locationBased ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>

                </div>

                {/* Location Info (when location-based is active) */}
                {locationBased && location && (
                  <div className="bg-gray-800/50 px-3 py-2 rounded-lg">
                    <span className="text-gray-400">Location: </span>
                    <span className="text-white font-semibold">
                      {location.city !== 'Unknown' && location.state !== 'Unknown'
                        ? `${location.city}, ${location.state}`
                        : 'IP-based'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {data.events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.events.map((event) => (
                  <div key={event.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    <div className="p-6">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                        {event.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-300 text-sm">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {event.date} at {event.time}
                        </div>
                        
                        <div className="flex items-center text-gray-300 text-sm">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {event.venue.name}, {event.location}
                        </div>

                        {event.min_ticket_price && (
                          <div className="flex items-center text-green-400 text-sm font-semibold">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            From ${event.min_ticket_price}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-400">
                          {event.performers.length > 0 && (
                            <span>{event.performers[0].name}</span>
                          )}
                        </div>
                        <button className="btn-primary text-sm px-4 py-2">
                          View Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.total_pages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, data.pagination.total_pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            page === currentPage
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === data.pagination.total_pages}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2 text-xl">No Events Found</h3>
                <p className="text-gray-400">
                  {data.category?.name === 'All Events'
                    ? 'There are currently no events available.'
                    : `There are currently no events available in the ${data.category?.name || 'selected'} category.`
                  }
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
