'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface HeroSection {
  id: string;
  title: string;
  description: string;
  image_url: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  display_order: number;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero sections from API
  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE}/api/public/hero-sections`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch hero sections');
        }

        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          setFeaturedEvents(data.data);
        } else {
          // Fallback to default hero sections if no data
          setFeaturedEvents([
            {
              id: 'default-1',
              title: "Welcome to TixPort",
              description: "Discover and buy tickets for concerts, sports, theater and more events. Get the best seats with guaranteed authenticity and instant delivery.",
              image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
              primary_button_text: "Browse Events",
              primary_button_url: "/category/all",
              secondary_button_text: "Learn More",
              secondary_button_url: "/about",
              display_order: 1
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching hero sections:', err);
        
        // Fallback to default hero section on error
        setFeaturedEvents([
          {
            id: 'fallback-1',
            title: "Welcome to TixPort",
            description: "Discover and buy tickets for concerts, sports, theater and more events. Get the best seats with guaranteed authenticity and instant delivery.",
            image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center&auto=format&q=80",
            primary_button_text: "Browse Events",
            primary_button_url: "/category/all",
            secondary_button_text: "Learn More",
            secondary_button_url: "/about",
            display_order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSections();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    setImageError(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePrimaryButtonClick = () => {
    if (featuredEvents[currentSlide]?.primary_button_url) {
      window.location.href = featuredEvents[currentSlide].primary_button_url;
    }
  };

  const handleSecondaryButtonClick = () => {
    if (featuredEvents[currentSlide]?.secondary_button_url) {
      window.location.href = featuredEvents[currentSlide].secondary_button_url;
    }
  };

  if (loading) {
    return (
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-400">Loading hero content...</span>
      </div>
    );
  }

  if (featuredEvents.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden h-80 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>No hero content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden h-80 group">
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-2xl">
            <h1 
              key={currentSlide}
              className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 leading-tight overflow-hidden animate-fade-in-up" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                animationDelay: '0.1s'
              }}
            >
              {featuredEvents[currentSlide].title}
            </h1>
            <p 
              key={`desc-${currentSlide}`}
              className="text-gray-300 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 leading-relaxed overflow-hidden animate-fade-in-up" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                animationDelay: '0.2s'
              }}
            >
              {featuredEvents[currentSlide].description}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <button 
                onClick={handlePrimaryButtonClick}
                className="btn-primary text-xs sm:text-sm px-4 py-2 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {featuredEvents[currentSlide].primary_button_text}
              </button>
              <button 
                onClick={handleSecondaryButtonClick}
                className="text-xs sm:text-sm px-4 py-2 rounded-md border border-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                {featuredEvents[currentSlide].secondary_button_text}
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-3 sm:mt-5 lg:mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex space-x-2">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === currentSlide ? 'bg-green-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 sm:p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden lg:block w-72 xl:w-80 h-full overflow-hidden relative">
          {/* Image with enhanced styling */}
          <div className="relative w-full h-full">
            {/* Error fallback */}
            {imageError ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm">Image unavailable</div>
                </div>
              </div>
            ) : (
              <Image
                key={`img-${currentSlide}`}
                src={featuredEvents[currentSlide].image_url}
                alt={featuredEvents[currentSlide].title}
                width={1200}
                height={800}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-110 hero-image image-enhanced opacity-100 scale-100"
                priority
                onError={handleImageError}
              />
            )}

            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-900/20 group-hover:to-gray-900/10 transition-all duration-500"></div>

            {/* Image quality indicator */}
            {!imageError && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-medium">HD</span>
              </div>
            )}
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  );
}
