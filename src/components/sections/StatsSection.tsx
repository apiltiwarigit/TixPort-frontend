'use client';

import { useState, useEffect } from 'react';

interface PublicStats {
  totalLikes: number;
  totalMoneySaved: number;
  totalTicketsSold: number;
}

export default function StatsSection() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicStats();
  }, []);

  const fetchPublicStats = async () => {
    try {
      // Fetch from public config API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api/public/config`);
      
      if (response.ok) {
        const data = await response.json();
        const config = data.data || {};
        
        // Extract stats from config with fallbacks
        setStats({
          totalLikes: parseInt(config.stats_manual_likes) || 12847,
          totalMoneySaved: parseInt(config.stats_manual_money_saved) || 12847,
          totalTicketsSold: parseInt(config.stats_manual_tickets_sold) || 12847
        });
      } else {
        throw new Error('Failed to fetch config');
      }
    } catch (error) {
      console.error('Error fetching public stats:', error);
      // Use fallback values
      setStats({
        totalLikes: 12847,
        totalMoneySaved: 12847,
        totalTicketsSold: 12847
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ emoji, label, value, color }: { 
    emoji: string; 
    label: string; 
    value: number; 
    color: string;
  }) => (
    <div className={`relative overflow-hidden rounded-2xl ${color} p-8 text-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="relative">
        <div className="text-4xl mb-3">{emoji}</div>
        <div className="text-3xl font-bold text-white mb-2">
          {loading ? '...' : formatNumber(value)}
        </div>
        <div className="text-white/80 font-medium">{label}</div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Thousands of Happy Customers
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            See why TixPort is the trusted choice for ticket buyers worldwide
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <StatCard
            emoji="❤️"
            label="Happy Customers"
            value={stats?.totalLikes || 12847}
            color="bg-gradient-to-br from-pink-500 to-rose-600"
          />
          <StatCard
            emoji="💰"
            label="Money Saved"
            value={stats?.totalMoneySaved || 12847}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
          />
          <StatCard
            emoji="🎫"
            label="Tickets Sold"
            value={stats?.totalTicketsSold || 12847}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="flex items-center justify-center">
              <div className="text-white font-semibold">🔒 Secure Payments</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-white font-semibold">⚡ Instant Delivery</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-white font-semibold">🎯 Best Prices</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-white font-semibold">🔄 Easy Refunds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}