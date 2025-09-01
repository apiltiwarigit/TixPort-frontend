'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const featuredEvents = [
    {
      id: 1,
      title: "2024 Kentucky Derby May 4, 2024 Churchill Downs",
      description: "Experience the most exciting two minutes in sports at Churchill Downs. Join us for the 150th running of the Kentucky Derby with premium seating and exclusive access.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: 2,
      title: "Taylor Swift - The Eras Tour",
      description: "Don't miss Taylor Swift's spectacular Eras Tour featuring songs from all her albums. A once-in-a-lifetime concert experience with stunning visuals and unforgettable performances.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: 3,
      title: "Lakers vs Warriors - NBA Finals",
      description: "Witness basketball history in the making. The ultimate showdown for the championship with the best players in the world competing for glory.",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=800&fit=crop&crop=center&auto=format&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    setImageLoading(true);
    setImageError(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
    setImageLoading(true);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-8 h-80 sm:h-96 lg:h-[28rem] group">
      <div className="flex h-full">
        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-2xl">
            <h1 
              key={currentSlide}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight overflow-hidden animate-fade-in-up" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                animationDelay: '0.1s'
              }}
            >
              {featuredEvents[currentSlide].title}
            </h1>
            <p 
              key={`desc-${currentSlide}`}
              className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed overflow-hidden animate-fade-in-up" 
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                animationDelay: '0.2s'
              }}
            >
              {featuredEvents[currentSlide].description}
            </p>
            <button className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              Read More
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 lg:mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
        <div className="hidden lg:block w-80 xl:w-96 h-full overflow-hidden relative">
          {/* Image with enhanced styling */}
          <div className="relative w-full h-full">
            {/* Loading placeholder */}
            {imageLoading && (
              <div className="absolute inset-0 image-placeholder animate-shimmer"></div>
            )}
            
            {/* Error fallback */}
            {imageError ? (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📸</div>
                  <div className="text-sm">Image unavailable</div>
                </div>
              </div>
            ) : (
              <img
                key={`img-${currentSlide}`}
                src={featuredEvents[currentSlide].image}
                alt={featuredEvents[currentSlide].title}
                className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-110 hero-image image-enhanced ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                loading="eager"
                decoding="async"
                sizes="(max-width: 1024px) 0px, 400px"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-gray-900/20 group-hover:to-gray-900/10 transition-all duration-500"></div>
            
            {/* Subtle border and shadow */}
            <div className="absolute inset-0 border border-gray-600/30 rounded-r-lg group-hover:border-gray-500/50 transition-all duration-500"></div>
            
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
