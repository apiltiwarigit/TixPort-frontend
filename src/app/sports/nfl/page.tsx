'use client';

import { PageContainer } from '@/components/layout';
import LocationDisplay from '@/components/LocationDisplay';
import Sidebar from '@/components/Sidebar';
import { Input, Select, Button } from '@/components/ui';
import { useState, useEffect } from 'react';
import {
  TrophyIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock NFL data - will be replaced with API calls later
const mockNFLEvents = [
  {
    id: 1,
    title: 'New York Giants vs Philadelphia Eagles',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    date: '2024-09-08',
    time: '1:00 PM',
    price: 'From $125',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.7,
    homeTeam: 'Giants',
    awayTeam: 'Eagles',
    week: 'Week 1'
  },
  {
    id: 2,
    title: 'New York Jets vs Buffalo Bills',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    date: '2024-09-15',
    time: '4:25 PM',
    price: 'From $115',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.8,
    homeTeam: 'Jets',
    awayTeam: 'Bills',
    week: 'Week 2'
  },
  {
    id: 3,
    title: 'New England Patriots vs New York Jets',
    venue: 'Gillette Stadium',
    location: 'Foxborough, MA',
    date: '2024-09-22',
    time: '1:00 PM',
    price: 'From $145',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.6,
    homeTeam: 'Patriots',
    awayTeam: 'Jets',
    week: 'Week 3'
  },
  {
    id: 4,
    title: 'Miami Dolphins vs New York Giants',
    venue: 'Hard Rock Stadium',
    location: 'Miami Gardens, FL',
    date: '2024-09-29',
    time: '1:00 PM',
    price: 'From $135',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.5,
    homeTeam: 'Dolphins',
    awayTeam: 'Giants',
    week: 'Week 4'
  },
  {
    id: 5,
    title: 'New York Giants vs Washington Commanders',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    date: '2024-10-06',
    time: '1:00 PM',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.4,
    homeTeam: 'Giants',
    awayTeam: 'Commanders',
    week: 'Week 5'
  },
  {
    id: 6,
    title: 'Dallas Cowboys vs New York Giants',
    venue: 'AT&T Stadium',
    location: 'Arlington, TX',
    date: '2024-10-13',
    time: '4:25 PM',
    price: 'From $185',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.9,
    homeTeam: 'Cowboys',
    awayTeam: 'Giants',
    week: 'Week 6'
  }
];

const teams = [
  'New York Giants', 'New York Jets', 'New England Patriots',
  'Philadelphia Eagles', 'Washington Commanders', 'Dallas Cowboys',
  'Buffalo Bills', 'Miami Dolphins'
];

export default function NFLPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState(mockNFLEvents);

  useEffect(() => {
    let filtered = mockNFLEvents;

    // Filter by team
    if (selectedTeam) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(selectedTeam.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return parseFloat(a.price.replace('$', '').replace('From ', '')) -
                 parseFloat(b.price.replace('$', '').replace('From ', ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [selectedTeam, searchQuery, sortBy]);

  return (
    <PageContainer showSidebar={true} sidebar={<Sidebar />}>
      <div>
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            {/* Back to Sports Link */}
            <Link
              href="/sports"
              className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Sports
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
                  <TrophyIcon className="h-8 w-8 mr-3 text-purple-500" />
                  NFL Football
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  National Football League games and tickets for the 2024 season
                </p>
              </div>
              <LocationDisplay
                className="text-lg sm:text-xl font-semibold"
                showChangeButton={true}
              />
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search teams, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                />
              </div>

              {/* Team Filter */}
              <div className="w-full lg:w-48">
                <Select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  fullWidth
                >
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </Select>
              </div>

              {/* Sort */}
              <div className="w-full lg:w-48">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  fullWidth
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-400 text-sm sm:text-base">
              Showing {filteredEvents.length} NFL games
              {searchQuery && ` for "${searchQuery}"`}
              {selectedTeam && ` featuring ${selectedTeam}`}
            </p>
          </div>

          {/* NFL Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover-lift transition-all duration-300 animate-fade-in-up"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    {event.week}
                  </div>
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-semibold">
                    NFL
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">{event.venue}, {event.location}</span>
                    </div>

                    <div className="flex items-center text-gray-300 text-sm">
                      <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300 text-sm">
                        <StarIcon className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                        <span>{event.rating}</span>
                      </div>
                      <div className="flex items-center text-green-400 font-semibold">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        <span>{event.price}</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/events/${event.id}/buy`}
                    className="inline-block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 text-center"
                  >
                    View Tickets
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredEvents.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <Button variant="outline" size="lg">
                Load More Games
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <TrophyIcon className="h-16 w-16 sm:h-20 sm:w-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No NFL games found</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Try adjusting your search or team filters to find more NFL games.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTeam('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
      </div>
    </PageContainer>
  );
}
