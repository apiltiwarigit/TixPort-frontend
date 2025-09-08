'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TagIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CubeIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Category {
  id: number;
  name: string;
  slug: string;
  is_visible: boolean;
  parent_id?: number;
  children?: Category[];
}

interface FeaturedCategory {
  id: string;
  display_order: number;
  is_active: boolean;
  categories: {
    id: number;
    name: string;
    slug: string;
  };
}

export default function AdminFeaturedCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<FeaturedCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchFeaturedCategories()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
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
    }
  };

  const fetchFeaturedCategories = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/homepage-categories`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const featured = data.data || [];
        setFeaturedCategories(featured);
        // Set currently selected category IDs
        const activeIds = featured
          .filter((f: FeaturedCategory) => f.is_active)
          .sort((a: FeaturedCategory, b: FeaturedCategory) => a.display_order - b.display_order)
          .map((f: FeaturedCategory) => f.categories.id);
        setSelectedCategoryIds(activeIds);
      }
    } catch (error) {
      console.error('Error fetching featured categories:', error);
    }
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      
      if (selectedCategoryIds.length < 1 || selectedCategoryIds.length > 4) {
        setMessage({ type: 'error', text: 'Please select between 1-4 categories' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
      const token = localStorage.getItem('auth_session');
      
      if (!token) return;

      const session = JSON.parse(token);
      const response = await fetch(`${API_BASE}/api/admin/homepage-categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category_ids: selectedCategoryIds }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Featured categories updated successfully!' });
        await fetchFeaturedCategories();
        setTimeout(() => setMessage(null), 3000);
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: err.message || 'Failed to update featured categories' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setMessage({ type: 'error', text: 'Error saving configuration' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategorySelection = (categoryId: number) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else if (prev.length < 4) {
        return [...prev, categoryId];
      } else {
        setMessage({ type: 'error', text: 'Maximum 4 categories can be selected' });
        setTimeout(() => setMessage(null), 3000);
        return prev;
      }
    });
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    setSelectedCategoryIds(prev => {
      const newOrder = [...prev];
      if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      }
      return newOrder;
    });
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategoryIds(prev => prev.filter(id => id !== categoryId));
  };

  const getCategoryById = (id: number) => {
    return categories.find(cat => cat.id === id);
  };

  const availableCategories = categories.filter(cat => 
    cat.is_visible && 
    !selectedCategoryIds.includes(cat.id) &&
    (!searchQuery || cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const hasChanges = () => {
    const currentIds = featuredCategories
      .filter(f => f.is_active)
      .sort((a, b) => a.display_order - b.display_order)
      .map(f => f.categories.id);
    
    return JSON.stringify(currentIds) !== JSON.stringify(selectedCategoryIds);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Featured Categories</h1>
        <p className="text-gray-400 mt-2">Configure which categories appear on the homepage (1-4 categories)</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-900 border border-green-700 text-green-300'
            : 'bg-red-900 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <ExclamationTriangleIcon className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selected Categories */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <CubeIcon className="h-6 w-6 text-blue-500" />
                Selected Categories ({selectedCategoryIds.length}/4)
              </h2>
              <button
                onClick={saveConfiguration}
                disabled={saving || !hasChanges() || selectedCategoryIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>

            {selectedCategoryIds.length === 0 ? (
              <div className="text-center py-8">
                <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No categories selected</p>
                <p className="text-sm text-gray-500">Select 1-4 categories from the available list</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedCategoryIds.map((categoryId, index) => {
                  const category = getCategoryById(categoryId);
                  if (!category) return null;
                  
                  return (
                    <div key={categoryId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-white font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-400">/{category.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveCategory(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveCategory(index, 'down')}
                          disabled={index === selectedCategoryIds.length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeCategory(categoryId)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Remove"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedCategoryIds.length > 0 && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-800 rounded-lg">
                <p className="text-sm text-blue-300">
                  <strong>Preview:</strong> These categories will appear on the homepage in this order. 
                  Users will see event grids for each selected category.
                </p>
              </div>
            )}
          </div>

          {/* Available Categories */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <TagIcon className="h-6 w-6 text-green-500" />
                Available Categories
              </h2>
              <button
                onClick={fetchData}
                className="p-2 text-gray-400 hover:text-white"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Categories List */}
            <div className="max-h-96 overflow-y-auto space-y-2">
              {availableCategories.length === 0 ? (
                <div className="text-center py-8">
                  <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">
                    {searchQuery ? 'No categories found' : 'No available categories'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <TagIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="text-white font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-400">/{category.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCategorySelection(category.id)}
                      disabled={selectedCategoryIds.length >= 4}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Configuration Info */}
      {!loading && featuredCategories.length > 0 && (
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Live Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCategories
              .filter(f => f.is_active)
              .sort((a, b) => a.display_order - b.display_order)
              .map((featured, index) => (
                <div key={featured.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <EyeIcon className="h-4 w-4 text-green-400" />
                  </div>
                  <h4 className="text-white font-medium">{featured.categories.name}</h4>
                  <p className="text-sm text-gray-400">/{featured.categories.slug}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
