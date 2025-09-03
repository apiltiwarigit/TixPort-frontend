'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import EventsGrid from '@/components/EventsGrid'

interface CategoryPageConfig {
  title: string
  description: string
  heroImage: string
  categoryId?: number
}

// Dynamic category configuration - will be fetched from API
let categoryConfig: Record<string, CategoryPageConfig> = {};

// Default fallback configuration for common categories
const defaultCategoryConfig: Record<string, CategoryPageConfig> = {
  concerts: {
    title: 'Concerts',
    description: 'Experience the best live music performances from your favorite artists.',
    heroImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3'
  },
  sports: {
    title: 'Sports',
    description: 'Catch all the action from professional sports teams and leagues.',
    heroImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3'
  },
  theatre: {
    title: 'Theatre',
    description: 'Discover amazing theatrical performances, musicals, and stage shows.',
    heroImage: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3'
  },
  theater: {
    title: 'Theater',
    description: 'Discover amazing theatrical performances, musicals, and stage shows.',
    heroImage: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3'
  },
  comedy: {
    title: 'Comedy',
    description: 'Laugh out loud with the best stand-up comedians and comedy shows.',
    heroImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3'
  },
  family: {
    title: 'Family',
    description: 'Fun events perfect for the whole family to enjoy together.',
    heroImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3'
  },
  music: {
    title: 'Music',
    description: 'Discover amazing live music events across all genres.',
    heroImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3'
  }
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<CategoryPageConfig | null>(null)

  useEffect(() => {
    const loadCategoryConfig = async () => {
      try {
        // Try to get config from API categories first
        const { categoriesApi } = await import('@/lib/api');
        const response = await categoriesApi.getCategories();
        
        // Build dynamic config from API response
        const apiConfig: Record<string, CategoryPageConfig> = {};
        response.data?.forEach((category: any) => {
          const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          apiConfig[categorySlug] = {
            title: category.name,
            description: `Discover amazing ${category.name.toLowerCase()} events happening near you.`,
            heroImage: getCategoryHeroImage(category.name),
            categoryId: category.id
          };
        });
        
        categoryConfig = { ...defaultCategoryConfig, ...apiConfig };
        setConfig(categoryConfig[slug] || defaultCategoryConfig[slug] || null);
      } catch (error) {
        console.warn('Failed to load categories from API, using default config:', error);
        // Fallback to default configuration
        categoryConfig = defaultCategoryConfig;
        setConfig(defaultCategoryConfig[slug] || null);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryConfig();
  }, [slug])

  // Helper function to get hero image based on category name
  const getCategoryHeroImage = (categoryName: string): string => {
    const name = categoryName.toLowerCase();
    if (name.includes('music') || name.includes('concert')) {
      return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3';
    } else if (name.includes('sport')) {
      return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3';
    } else if (name.includes('theater') || name.includes('theatre')) {
      return 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3';
    } else if (name.includes('comedy')) {
      return 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3';
    } else if (name.includes('family')) {
      return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3';
    } else {
      return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {slug} events...</p>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600">The category "{slug}" doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={config.heroImage}
            alt={config.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-white text-center p-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.title}</h1>
            <p className="text-lg md:text-xl max-w-2xl">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upcoming {config.title} Events
          </h2>
          <p className="text-gray-600">
            Find the best {config.title.toLowerCase()} events happening near you.
          </p>
        </div>

        <EventsGrid 
          title={`${config.title} Events`}
          category={slug}
          moreButtonText={`View More ${config.title}`}
        />
      </div>
    </div>
  )
}
