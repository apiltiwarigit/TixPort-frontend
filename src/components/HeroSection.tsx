'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredEvents = [
    {
      id: 1,
      title: "2024 Kentucky Derby May 4, 2024 Churchill Downs",
      description: "This is the description for the venue type slide in the Home Slider custom list. You can edit this in your custom list section of the admin panel.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Taylor Swift - The Eras Tour",
      description: "Experience the magic of Taylor Swift's record-breaking Eras Tour with hits from all her albums.",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Lakers vs Warriors - NBA Finals",
      description: "Witness the ultimate basketball showdown between two legendary teams in the NBA Finals.",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-8">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {featuredEvents[currentSlide].title}
            </h1>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              {featuredEvents[currentSlide].description}
            </p>
            <button className="btn-primary">
              Read More
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex space-x-2">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="hidden lg:block w-96">
          <img
            src={featuredEvents[currentSlide].image}
            alt={featuredEvents[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
