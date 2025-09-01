'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import Footer from '@/components/Footer';
import { Event, EventFilters } from '@/types';
import { eventsApi } from '@/lib/api';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sample mock data for demonstration
  const mockEvents: Event[] = [
    {
      id: 1,
      name: "John Legend Live in Concert",
      date_time_local: "2024-09-02T20:00:00",
      venue: {
        id: 1,
        name: "Filene Center at Wolf Trap",
        address: "1551 Trap Road",
        city: "Vienna",
        state_province: "VA",
        country: "USA",
        postal_code: "22182"
      },
      category: { id: 1, name: "Concerts" },
      performers: [
        { id: 1, name: "John Legend", category: { id: 1, name: "Music" }, primary: true }
      ],
      min_ticket_price: 75,
      max_ticket_price: 350,
      url: "/events/1"
    },
    {
      id: 2,
      name: "The Waterboys",
      date_time_local: "2024-09-04T19:00:00",
      venue: {
        id: 2,
        name: "9:30 Club",
        address: "815 V Street NW",
        city: "Washington",
        state_province: "DC",
        country: "USA",
        postal_code: "20001"
      },
      category: { id: 1, name: "Concerts" },
      performers: [
        { id: 2, name: "The Waterboys", category: { id: 1, name: "Music" }, primary: true }
      ],
      min_ticket_price: 45,
      max_ticket_price: 125,
      url: "/events/2"
    },
    {
      id: 3,
      name: "Cirque du Soleil: Luzia",
      date_time_local: "2024-09-06T19:00:00",
      venue: {
        id: 3,
        name: "Under The Big Top - Lerner Town Square at Tysons II",
        address: "8025 Leesburg Pike",
        city: "Tysons",
        state_province: "VA",
        country: "USA",
        postal_code: "22182"
      },
      category: { id: 2, name: "Theatre" },
      performers: [
        { id: 3, name: "Cirque du Soleil", category: { id: 2, name: "Theatre" }, primary: true }
      ],
      min_ticket_price: 89,
      max_ticket_price: 199,
      url: "/events/3"
    },
    {
      id: 4,
      name: "San Antonio FC at Loudoun United FC",
      date_time_local: "2024-09-13T18:00:00",
      venue: {
        id: 4,
        name: "Segra Field",
        address: "42095 Loudoun United Drive",
        city: "Leesburg",
        state_province: "VA",
        country: "USA",
        postal_code: "20175"
      },
      category: { id: 3, name: "Sports" },
      performers: [
        { id: 4, name: "San Antonio FC", category: { id: 3, name: "Soccer" }, primary: false, away_team: true },
        { id: 5, name: "Loudoun United FC", category: { id: 3, name: "Soccer" }, primary: false, home_team: true }
      ],
      min_ticket_price: 25,
      max_ticket_price: 85,
      url: "/events/4"
    },
    {
      id: 5,
      name: "Trenton Thunder at Frederick Keys",
      date_time_local: "2024-09-01T12:00:00",
      venue: {
        id: 5,
        name: "Harry Grove Stadium",
        address: "21 Stadium Drive",
        city: "Frederick",
        state_province: "MD",
        country: "USA",
        postal_code: "21703"
      },
      category: { id: 3, name: "Sports" },
      performers: [
        { id: 6, name: "Trenton Thunder", category: { id: 3, name: "Baseball" }, primary: false, away_team: true },
        { id: 7, name: "Frederick Keys", category: { id: 3, name: "Baseball" }, primary: false, home_team: true }
      ],
      min_ticket_price: 15,
      max_ticket_price: 45,
      url: "/events/5"
    },
    {
      id: 6,
      name: "Arsenic and Old Lace",
      date_time_local: "2024-09-06T19:00:00",
      venue: {
        id: 6,
        name: "StageCoach Theatre Company",
        address: "44710 Ashburn Shopping Plaza",
        city: "Ashburn",
        state_province: "VA",
        country: "USA",
        postal_code: "20147"
      },
      category: { id: 2, name: "Theatre" },
      performers: [
        { id: 8, name: "StageCoach Theatre Company", category: { id: 2, name: "Theatre" }, primary: true }
      ],
      min_ticket_price: 35,
      max_ticket_price: 65,
      url: "/events/6"
    }
  ];

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data since we don't have the backend running yet
      // In production, uncomment the line below:
      // const response = await eventsApi.getEvents(filters, currentPage);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on search term and filters
      let filteredEvents = mockEvents;
      
      if (searchTerm) {
        filteredEvents = filteredEvents.filter(event =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.city.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.category) {
        filteredEvents = filteredEvents.filter(event =>
          event.category.name.toLowerCase() === filters.category?.toLowerCase()
        );
      }

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 6));
      
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm });
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Event
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover concerts, sports, theater and more with authentic tickets guaranteed
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search events, artists, teams, venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary-500 hover:bg-primary-400 px-6 py-3 rounded-r-lg font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Category:</label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="">All Categories</option>
                  <option value="concerts">Concerts</option>
                  <option value="sports">Sports</option>
                  <option value="theatre">Theatre</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {events.length} events found
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City, State"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange({ location: e.target.value || undefined })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <input
                    type="date"
                    value={filters.dateFrom || ''}
                    onChange={(e) => handleFilterChange({ dateFrom: e.target.value || undefined })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input
                    type="number"
                    placeholder="$1000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No events found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

