'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TagIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon
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
  // Flat list for stats and utilities
  const [categories, setCategories] = useState<Category[]>([]);
  // Tree list for rendering
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

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
        const list: Category[] = (data.data || []) as Category[];
        setCategories(list);
        setCategoryTree(buildCategoryTree(list));
        // Collapse all on fresh load
        setExpanded(new Set());
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

  const buildCategoryTree = (list: Category[]): Category[] => {
    const byId = new Map<number, Category & { children: Category[] }>();
    list.forEach((c) => {
      byId.set(c.id, { ...c, children: [] });
    });
    const roots: Category[] = [];
    list.forEach((c) => {
      const node = byId.get(c.id)!;
      if (c.parent_id && byId.has(c.parent_id)) {
        byId.get(c.parent_id)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  };

  const filterTree = (nodes: Category[], query: string): Category[] => {
    const q = query.trim().toLowerCase();
    if (!q) return nodes;
    const filterNode = (node: Category): Category | null => {
      const children = (node.children || []).map(filterNode).filter(Boolean) as Category[];
      const matches = node.name.toLowerCase().includes(q) || node.slug.toLowerCase().includes(q);
      if (matches || children.length > 0) {
        return { ...node, children };
      }
      return null;
    };
    return nodes.map(filterNode).filter(Boolean) as Category[];
  };

  const filteredTree = filterTree(categoryTree, searchQuery);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className={`${level > 0 ? 'ml-6' : ''}`}>
        <div className="flex items-center justify-between p-3 bg-gray-800 border border-gray-700 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            {category.children && category.children.length > 0 ? (
              <button
                onClick={() => toggleExpand(category.id)}
                className="flex-shrink-0 text-gray-300 hover:text-white"
                aria-label="Toggle expand"
              >
                {searchQuery || expanded.has(category.id) ? (
                  <ChevronDownIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </button>
            ) : (
              <div className="flex-shrink-0 w-5 h-5" />
            )}
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
        {category.children && category.children.length > 0 && (searchQuery || expanded.has(category.id)) && (
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
            {filteredTree.length > 0 ? (
              renderCategoryTree(filteredTree)
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
