'use client';

import { useState, useEffect } from 'react';
import { MusicalNoteIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PageContainer } from '@/components/layout';
import { PageHeader } from '@/components/layout';
import { CategoryHeroSection } from '@/components/sections';
import { EventGrid } from '@/components/events';
import { Input, Select } from '@/components/ui';
import { Button } from '@/components/ui';
import { Loading, EmptyEvents } from '@/components/ui';
import Sidebar from '@/components/Sidebar';

// Mock concert data - will be replaced with API calls later
const mockConcerts = [
  {
    id: 1,
    name: 'Taylor Swift - The Eras Tour',
    title: 'Taylor Swift - The Eras Tour',
    venue: 'MetLife Stadium',
    location: 'East Rutherford, NJ',
    date: '2024-08-15',
    time: '8:00 PM',
    price: 'From $89',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Pop'
  },
  {
    id: 2,
    name: 'Ed Sheeran - Mathematics Tour',
    title: 'Ed Sheeran - Mathematics Tour',
    venue: 'Madison Square Garden',
    location: 'New York, NY',
    date: '2024-09-22',
    time: '7:30 PM',
    price: 'From $75',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'Pop'
  },
  {
    id: 3,
    name: 'Bruce Springsteen & The E Street Band',
    title: 'Bruce Springsteen & The E Street Band',
    venue: 'Barclays Center',
    location: 'Brooklyn, NY',
    date: '2024-10-05',
    time: '8:00 PM',
    price: 'From $95',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Rock'
  },
  {
    id: 4,
    name: 'Harry Styles - Love On Tour',
    title: 'Harry Styles - Love On Tour',
    venue: 'Prudential Center',
    location: 'Newark, NJ',
    date: '2024-11-12',
    time: '7:00 PM',
    price: 'From $85',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop',
    rating: 4.7,
    category: 'Pop'
  },
  {
    id: 5,
    name: 'The Weeknd - After Hours Tour',
    title: 'The Weeknd - After Hours Tour',
    venue: 'UBS Arena',
    location: 'Elmont, NY',
    date: '2024-12-03',
    time: '8:30 PM',
    price: 'From $79',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    rating: 4.8,
    category: 'R&B'
  },
  {
    id: 6,
    name: 'Coldplay - Music of the Spheres',
    title: 'Coldplay - Music of the Spheres',
    venue: 'Nassau Coliseum',
    location: 'Uniondale, NY',
    date: '2024-08-28',
    time: '7:30 PM',
    price: 'From $92',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    rating: 4.9,
    category: 'Alternative'
  }
];

const categories = [
  { name: 'All Concerts', count: 1247, active: true },
  { name: 'Pop', count: 423 },
  { name: 'Rock', count: 298 },
  { name: 'Hip Hop', count: 187 },
  { name: 'Electronic', count: 156 },
  { name: 'Jazz', count: 89 },
  { name: 'Country', count: 94 }
];

export default function ConcertsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Concerts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filteredConcerts, setFilteredConcerts] = useState(mockConcerts);

  useEffect(() => {
    let filtered = mockConcerts;

    // Filter by category
    if (selectedCategory !== 'All Concerts') {
      filtered = filtered.filter(concert => concert.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(concert =>
        concert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        concert.location.toLowerCase().includes(searchQuery.toLowerCase())
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

    setFilteredConcerts(filtered);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <PageContainer showSidebar={true} sidebar={<Sidebar />}>

      {/* Hero Section */}
      <CategoryHeroSection
        category="Concerts"
        description="Experience the spectacular Eras Tour featuring all of Taylor Swift's biggest hits spanning her incredible career. This once-in-a-lifetime concert promises an unforgettable night of music and memories."
        backgroundImage="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
      />

      {/* Filters and Search */}
      <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search concerts, artists, venues..."
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
          Showing {filteredConcerts.length} concerts
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'All Concerts' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Concerts Grid */}
      <EventGrid
        events={filteredConcerts}
        columns={3}
        emptyState={{
          title: 'No concerts found',
          description: 'Try adjusting your search or filters to find more concerts.',
          action: {
            label: 'Clear Filters',
            onClick: () => {
              setSearchQuery('');
              setSelectedCategory('All Concerts');
            }
          }
        }}
      />

      {/* Load More */}
      {filteredConcerts.length > 0 && (
        <div className="text-center mt-8 sm:mt-12">
          <Button variant="outline" size="lg">
            Load More Concerts
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
