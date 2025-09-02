'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrophyIcon, MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon, StarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { PageContainer } from '@/components/layout';
import { CategoryHeroSection } from '@/components/sections';
import { EventGrid } from '@/components/events';
import { Input, Select } from '@/components/ui';
import { Button } from '@/components/ui';
import Sidebar from '@/components/Sidebar';

// Mock sports data - will be replaced with API calls later
const mockSportsEvents = [
  {
    id: 1,
    title: 'New York Yankees vs Boston Red Sox',
    venue: 'Yankee Stadium',
    location: 'Bronx, NY',
    date: '2024-08-25',
    time: '7:05 PM',
    price: 'From $45',
    image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'MLB Baseball'
  },
  {
    id: 2,
    title: 'New York Knicks vs Brooklyn Nets',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    date: '2024-09-18',
    time: '7:30 PM',
    price: 'From $89',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'NBA Basketball'
  },
  {
    id: 3,
    title: 'New York Giants vs Philadelphia Eagles',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    date: '2024-10-13',
    time: '1:00 PM',
    price: 'From $125',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop',
    rating: 4.7,
    category: 'NFL Football'
  },
  {
    id: 4,
    title: 'New York Rangers vs Boston Bruins',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    date: '2024-11-08',
    time: '7:00 PM',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'NHL Hockey'
  },
  {
    id: 5,
    title: 'New York City FC vs Inter Miami',
    venue: 'Yankee Stadium',
    location: 'Bronx, NY',
    date: '2024-08-31',
    time: '7:30 PM',
    price: 'From $55',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rating: 4.6,
    category: 'MLS Soccer'
  },
  {
    id: 6,
    title: 'New Jersey Devils vs Pittsburgh Penguins',
    venue: 'Prudential Center',
    location: 'Newark, NJ',
    date: '2024-12-15',
    time: '7:00 PM',
    price: 'From $75',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rating: 4.7,
    category: 'NHL Hockey'
  }
];

const categories = [
  { name: 'All Sports', count: 1247, active: true },
  { name: 'NFL Football', count: 312, href: '/sports/nfl' },
  { name: 'MLB Baseball', count: 298, href: '/sports/mlb' },
  { name: 'NBA Basketball', count: 234, href: '/sports/nba' },
  { name: 'NHL Hockey', count: 189, href: '/sports/nhl' },
  { name: 'MLS Soccer', count: 145, href: '/sports/mls' },
  { name: 'College Sports', count: 69 }
];

export default function SportsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Sports');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState(mockSportsEvents);

  useEffect(() => {
    let filtered = mockSportsEvents;

    // Filter by category
    if (selectedCategory !== 'All Sports') {
      filtered = filtered.filter(event => event.category === selectedCategory);
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
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <PageContainer showSidebar={true} sidebar={<Sidebar />}>

      {/* Hero Section */}
      <CategoryHeroSection
        category="Sports"
        description="Catch all the action with tickets to professional sports events, from NFL and MLB to NBA and NHL games."
        backgroundImage="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=1920&h=1080&fit=crop"
      />

          {/* Filters and Search */}
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search teams, venues, events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
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

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                category.href ? (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-700 text-gray-300 hover:bg-gray-600"
                  >
                    {category.name} ({category.count})
                  </Link>
                ) : (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-400 text-sm sm:text-base">
              Showing {filteredEvents.length} sports events
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory !== 'All Sports' && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Sports Events Grid */}
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
                    {event.category}
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

                  <Link href={`/events/${event.id}/buy`}>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                      View Tickets
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredEvents.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
                Load More Events
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <TrophyIcon className="h-16 w-16 sm:h-20 sm:w-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No sports events found</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-6">
                Try adjusting your search or filters to find more sports events.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Sports');
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}
    </PageContainer>
  );
}
