'use client';

import { useState, useEffect } from 'react';
import { FilmIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageContainer } from '@/components/layout';
import { CategoryHeroSection } from '@/components/sections';
import { EventGrid } from '@/components/events';
import { Input, Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { Loading, EmptyEvents } from '@/components/ui';
import Sidebar from '@/components/Sidebar';

// Mock theatre data - will be replaced with API calls later
const mockTheatreEvents = [
  {
    id: 1,
    name: 'Hamilton',
    title: 'Hamilton',
    venue: 'Richard Rodgers Theatre',
    location: 'New York, NY',
    date: '2024-08-20',
    time: '7:00 PM',
    price: 'From $149',
    image: 'https://images.unsplash.com/photo-1489599529050-350975f057dc?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Broadway'
  },
  {
    id: 2,
    name: 'The Lion King',
    title: 'The Lion King',
    venue: ' Minskoff Theatre',
    location: 'New York, NY',
    date: '2024-09-15',
    time: '8:00 PM',
    price: 'From $129',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'Broadway'
  },
  {
    id: 3,
    name: 'Wicked',
    title: 'Wicked',
    venue: 'Gershwin Theatre',
    location: 'New York, NY',
    date: '2024-10-08',
    time: '7:30 PM',
    price: 'From $139',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Broadway'
  },
  {
    id: 4,
    name: 'Chicago',
    title: 'Chicago',
    venue: 'Ambassador Theatre',
    location: 'New York, NY',
    date: '2024-11-22',
    time: '8:00 PM',
    price: 'From $99',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    rating: 4.7,
    category: 'Broadway'
  },
  {
    id: 5,
    name: 'Jersey Boys',
    title: 'Jersey Boys',
    venue: 'Newark Theater',
    location: 'Newark, NJ',
    date: '2024-08-30',
    time: '7:30 PM',
    price: 'From $89',
    image: 'https://images.unsplash.com/photo-1489599529050-350975f057dc?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'Musical'
  },
  {
    id: 6,
    name: 'A Chorus Line',
    title: 'A Chorus Line',
    venue: 'Paper Mill Playhouse',
    location: 'Millburn, NJ',
    date: '2024-12-01',
    time: '8:00 PM',
    price: 'From $79',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    rating: 4.6,
    category: 'Musical'
  }
];

const categories = [
  { name: 'All Theatre', count: 856, active: true },
  { name: 'Broadway', count: 234 },
  { name: 'Off-Broadway', count: 189 },
  { name: 'Musical', count: 156 },
  { name: 'Play', count: 134 },
  { name: 'Comedy', count: 78 },
  { name: 'Drama', count: 65 }
];

export default function TheatrePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Theatre');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredEvents, setFilteredEvents] = useState(mockTheatreEvents);

  useEffect(() => {
    let filtered = mockTheatreEvents;

    // Filter by category
    if (selectedCategory !== 'All Theatre') {
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
        category="Theatre"
        description="Experience world-class theatre productions and Broadway shows that captivate audiences night after night."
        backgroundImage="https://images.unsplash.com/photo-1489599529050-350975f057dc?w=1920&h=1080&fit=crop"
      />

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search shows, productions, venues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            />
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
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 sm:mb-6">
        <p className="text-gray-400 text-sm sm:text-base">
          Showing {filteredEvents.length} theatre events
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'All Theatre' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Theatre Events Grid */}
      <EventGrid
        events={filteredEvents}
        columns={3}
        emptyState={{
          title: 'No theatre events found',
          description: 'Try adjusting your search or filters to find more theatre productions.',
          action: {
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setSelectedCategory('All Theatre');
            }
          }
        }}
      />

      {/* Load More */}
      {filteredEvents.length > 0 && (
        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="lg">
            Load More Shows
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
