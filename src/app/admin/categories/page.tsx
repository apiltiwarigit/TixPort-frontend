'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TagIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  is_visible: boolean;
  parent_id?: number;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCategories = async () => {
    try {
      setSyncing(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/categories/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchCategories(); // Refresh the list
        alert('Categories synced successfully!');
      } else {
        alert('Failed to sync categories');
      }
    } catch (error) {
      console.error('Error syncing categories:', error);
      alert('Error syncing categories');
    } finally {
      setSyncing(false);
    }
  };

  const toggleVisibility = async (categoryId: number, isVisible: boolean) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/categories/${categoryId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_visible: !isVisible }),
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category visibility:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">{category.name}</h3>
              <p className="text-sm text-gray-400">/{category.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleVisibility(category.id, category.is_visible)}
              className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                category.is_visible
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}
            >
              {category.is_visible ? (
                <>
                  <EyeIcon className="h-3 w-3" />
                  Visible
                </>
              ) : (
                <>
                  <EyeSlashIcon className="h-3 w-3" />
                  Hidden
                </>
              )}
            </button>
          </div>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="ml-4">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Categories</h1>
        <p className="text-gray-400 mt-2">Manage event categories and visibility</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={syncCategories}
          disabled={syncing}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowPathIcon className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from API'}
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-2">Loading categories...</p>
          </div>
        ) : (
          <>
            {filteredCategories.length > 0 ? (
              renderCategoryTree(filteredCategories)
            ) : (
              <div className="text-center py-8">
                <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No categories found</p>
                <button
                  onClick={syncCategories}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Sync categories from API
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      {!loading && categories.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <div className="text-sm text-gray-400">Total Categories</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {categories.filter(c => c.is_visible).length}
            </div>
            <div className="text-sm text-gray-400">Visible Categories</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {categories.filter(c => !c.is_visible).length}
            </div>
            <div className="text-sm text-gray-400">Hidden Categories</div>
          </div>
        </div>
      )}
    </div>
  );
}
