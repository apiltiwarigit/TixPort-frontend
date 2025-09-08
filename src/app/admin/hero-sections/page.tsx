'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface HeroSection {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export default function AdminHeroSectionsPage() {
  const { user } = useAuth();
  const [heroSections, setHeroSections] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  const fetchHeroSections = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHeroSections(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hero sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });

      if (response.ok) {
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
    }
  };

  const deleteHeroSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hero section?')) return;

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/hero-sections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        await fetchHeroSections();
      }
    } catch (error) {
      console.error('Error deleting hero section:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Hero Sections</h1>
        <p className="text-gray-400 mt-2">Manage homepage hero content</p>
      </div>

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Hero Section
        </button>
      </div>

      {/* Hero Sections Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading hero sections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroSections.map((section) => (
            <div key={section.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {section.image_url ? (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <img
                    src={section.image_url}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                  <PhotoIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white truncate">{section.title}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(section.id, section.is_active)}
                      className={`px-2 py-1 text-xs rounded ${
                        section.is_active
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {section.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                
                {section.subtitle && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{section.subtitle}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Order: {section.order}</span>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-yellow-400 hover:text-yellow-300">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteHeroSection(section.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && heroSections.length === 0 && (
        <div className="text-center py-8">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No hero sections found</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create your first hero section
          </button>
        </div>
      )}

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Create Hero Section</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subtitle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
