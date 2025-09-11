'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  UsersIcon,
  PhotoIcon,
  TagIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers?: number;
  adminUsers?: number;
  heroSections?: number;
  categories?: number;
  lastSync?: string;
  // New statistics
  totalLikes?: number;
  totalMoneySaved?: number;
  totalTicketsSold?: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
        const token = localStorage.getItem('auth_session');
        
        if (!token) return;

        const session = JSON.parse(token);
        const response = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.data || {});
        } else {
          console.error('Failed to fetch dashboard stats');
          // Fallback to empty stats
          setStats({
            totalUsers: 0,
            heroSections: 0,
            categories: 0,
            lastSync: 'Never'
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Fallback to empty stats
        setStats({
          totalUsers: 0,
          heroSections: 0,
          categories: 0,
          lastSync: 'Never'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    {
      name: 'Manage Users',
      description: 'Add, edit, or manage user roles',
      href: '/admin/users',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Edit Hero Sections',
      description: 'Update homepage hero content',
      href: '/admin/hero-sections',
      icon: PhotoIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Sync Categories',
      description: 'Update categories from API',
      href: '/admin/categories',
      icon: TagIcon,
      color: 'bg-green-500'
    },
    {
      name: 'System Settings',
      description: 'Configure site settings',
      href: '/admin/settings',
      icon: CogIcon,
      color: 'bg-gray-500'
    },
    {
      name: 'Statistics',
      description: 'Manage public statistics',
      href: '/admin/statistics',
      icon: ChartBarIcon,
      color: 'bg-indigo-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'system',
      message: 'Admin panel initialized',
      time: 'Just now',
      icon: ExclamationTriangleIcon,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user?.email}. Here&apos;s what&apos;s happening with your TixPort admin panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalUsers || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PhotoIcon className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Hero Sections</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.heroSections || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TagIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-white">
                {loading ? '...' : stats.categories || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Last Sync</p>
              <p className="text-sm font-bold text-white">
                {loading ? '...' : stats.lastSync || 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Statistics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Public Statistics</h2>
          <a 
            href="/admin/statistics" 
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Manage →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-300">Total Likes</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {loading ? '...' : (stats.totalLikes ? (stats.totalLikes >= 1000 ? `${(stats.totalLikes/1000).toFixed(1)}K` : stats.totalLikes) : '0')}
                </p>
              </div>
              <div className="p-3 bg-pink-500/20 rounded-lg">
                ❤️
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300">Money Saved</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {loading ? '...' : `$${stats.totalMoneySaved ? (stats.totalMoneySaved >= 1000 ? `${(stats.totalMoneySaved/1000).toFixed(1)}K` : stats.totalMoneySaved) : '0'}`}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                💰
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300">Tickets Sold</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {loading ? '...' : (stats.totalTicketsSold ? (stats.totalTicketsSold >= 1000 ? `${(stats.totalTicketsSold/1000).toFixed(1)}K` : stats.totalTicketsSold) : '0')}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                🎫
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="group bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 ${action.color} rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentActivities.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex-shrink-0">
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-white">{activity.message}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
