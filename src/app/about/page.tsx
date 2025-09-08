'use client';

import { PageContainer } from '@/components/layout';
// import { Button } from '@/components/ui';
import TopCounters from '@/components/TopCounters';
import Image from 'next/image';
import {
  InformationCircleIcon,
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  StarIcon,
  UserGroupIcon,
  TrophyIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const stats = [
    { number: '2M+', label: 'Tickets Sold', icon: CheckBadgeIcon },
    { number: '500K+', label: 'Happy Customers', icon: UserGroupIcon },
    { number: '10K+', label: 'Events Listed', icon: TrophyIcon },
    { number: '99.9%', label: 'Uptime', icon: StarIcon }
  ];

  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Trusted & Secure',
      description: 'Your ticket purchases are protected with bank-level security and our satisfaction guarantee.'
    },
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do, ensuring the best ticket buying experience.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Reach',
      description: 'Access tickets for events worldwide with our extensive network of trusted sellers.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former event industry executive with 15+ years of experience in ticket marketplaces.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Technology leader specializing in scalable e-commerce platforms and secure payment systems.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Customer Success',
      bio: 'Dedicated to ensuring every customer has an exceptional experience with our platform.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <PageContainer showSidebar={true}>
      {/* Top Counters */}
      <div className="py-3 sm:py-4 border-t border-b border-gray-800/80 bg-gray-900/40 backdrop-blur">
        <TopCounters />
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 flex items-center justify-center">
              <InformationCircleIcon className="h-12 w-12 mr-4 text-purple-500" />
              About TixPort
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
              We&apos;re revolutionizing the way people discover, buy, and experience live events.
              Our mission is to make ticket buying simple, secure, and accessible to everyone.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover-lift transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-gray-300 text-base sm:text-lg leading-relaxed space-y-4">
                <p>
                  Founded in 2020, TixPort was born from a simple idea: ticket buying should be as exciting
                  as the events themselves. Our founders experienced firsthand the frustrations of complicated
                  ticket purchasing processes and decided to build a better solution.
                </p>
                <p>
                  Today, we&apos;re proud to be the trusted marketplace for millions of fans worldwide, connecting
                  people with unforgettable experiences while ensuring every transaction is secure and every
                  ticket is authentic.
                </p>
                <p>
                  We believe in transparency, innovation, and putting our customers first. Every feature we
                  build and every process we streamline is designed with one goal in mind: making live events
                  more accessible and enjoyable for everyone.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
                  alt="Concert crowd"
                  width={600}
                  height={400}
                  className="w-full h-64 sm:h-80 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover-lift transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <value.icon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Meet Our Team */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center hover-lift transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={150}
                    height={150}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 object-cover border-2 border-purple-500"
                  />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Why Choose TixPort?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">100% Authentic Tickets</h4>
                    <p className="text-gray-400 text-sm">Every ticket is verified and guaranteed authentic.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Instant Delivery</h4>
                    <p className="text-gray-400 text-sm">Receive your e-tickets immediately after purchase.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Best Price Guarantee</h4>
                    <p className="text-gray-400 text-sm">Find the best deals or we&apos;ll match the price.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">24/7 Customer Support</h4>
                    <p className="text-gray-400 text-sm">Our team is always here to help you.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Secure Payments</h4>
                    <p className="text-gray-400 text-sm">Bank-level security for all transactions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Mobile Friendly</h4>
                    <p className="text-gray-400 text-sm">Buy tickets anytime, anywhere on any device.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Experience the Best?
            </h2>
            <p className="text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
              Join millions of fans who trust TixPort for their ticket needs.
              Start exploring events today!
            </p>
            <a
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Browse Events
            </a>
          </div>
      </div>
    </PageContainer>
  );
}
