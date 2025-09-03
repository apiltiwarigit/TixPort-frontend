'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  GlobeAltIcon,
  UserIcon,
  ShoppingCartIcon,
  PhoneIcon,
  InformationCircleIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';
import { categoriesApi } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
  children?: Category[];
}

export default function Sidebar() {
  const { location, loading, error, formatLocation } = useLocation();
  // Categories state - will be cached in Supabase later
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError(null);

      const response = await categoriesApi.getCategories();

      // Transform categories into tree structure
      const transformedCategories = transformCategoriesToTree(response.data || []);
      setCategories(transformedCategories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setCategoriesError('Unable to load categories. Categories will be cached in Supabase soon.');
      setCategories([]); // Clear categories on error
    } finally {
      setCategoriesLoading(false);
    }
  };

  const transformCategoriesToTree = (categories: any[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create all category objects
    categories.forEach(cat => {
      const category: Category = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        parent: cat.parent,
        children: []
      };
      categoryMap.set(cat.id, category);
    });

    // Second pass: build tree structure
    categories.forEach(cat => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parent && cat.parent.id) {
        // This is a child category
        const parentCategory = categoryMap.get(cat.parent.id);
        if (parentCategory) {
          parentCategory.children!.push(category);
        }
      } else {
        // This is a root category
        rootCategories.push(category);
      }
    });

    return rootCategories;
  };

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const generateCategoryLink = (category: Category): string => {
    // Create dynamic links based on category structure
    if (category.parent) {
      // Child category - use parent/child structure
      return `/sports/${category.slug}`;
    } else {
      // Root category
      switch (category.slug) {
        case 'concerts':
        case 'music':
          return '/concerts';
        case 'sports':
          return '/sports';
        case 'theater':
        case 'theatre':
          return '/theatre';
        default:
          return `/${category.slug}`;
      }
    }
  };

  // Tree Item Component for rendering categories
  const CategoryTreeItem: React.FC<{
    category: Category;
    isExpanded: boolean;
    onToggle: () => void;
    generateLink: (category: Category) => string;
    level?: number;
  }> = ({ category, isExpanded, onToggle, generateLink, level = 0 }) => {
    const hasChildren = category.children && category.children.length > 0;
    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
      <div>
        <Link
          href={generateCategoryLink(category)}
          className={`flex items-center text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors ${indentClass}`}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              className="mr-2 focus:outline-none"
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-3 w-3" />
              ) : (
                <ChevronRightIcon className="h-3 w-3" />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}
          <span className="truncate">{category.name}</span>
        </Link>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map((childCategory) => (
              <CategoryTreeItem
                key={childCategory.id}
                category={childCategory}
                isExpanded={expandedCategories.has(childCategory.id)}
                onToggle={() => toggleCategory(childCategory.id)}
                generateLink={generateLink}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen p-6">
      {/* Location Section */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          GET TICKETS
        </h3>
        <div className="mb-4">
          <h4 className="text-gray-300 text-xs font-medium mb-2">YOUR LOCATION</h4>

          {loading ? (
            <div className="flex items-center text-gray-400 text-sm">
              <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent mr-2"></div>
              <span>Detecting...</span>
            </div>
          ) : location ? (
            <div className="flex items-center text-white text-sm">
              <MapPinIcon className="h-4 w-4 mr-2 text-green-500" />
              <span>{formatLocation()}</span>
            </div>
          ) : error ? (
            <div className="flex items-center text-yellow-400 text-sm">
              <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
              <span>Using default</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400 text-sm">
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              <span>Unknown</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center">
          <GlobeAltIcon className="h-4 w-4 mr-2" />
          CATEGORIES
        </h3>

        {categoriesLoading ? (
          <div className="space-y-2">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20 ml-4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-20 ml-4 mb-2"></div>
            </div>
          </div>
        ) : categoriesError ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-400 text-sm font-medium">Categories Unavailable</p>
                <p className="text-red-300 text-xs mt-1">
                  {categoriesError}
                </p>
                <button
                  onClick={fetchCategories}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                  disabled={categoriesLoading}
                >
                  {categoriesLoading ? 'Retrying...' : 'Retry'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <nav className="space-y-1">
            {categories.map((category) => (
              <CategoryTreeItem
                key={category.id}
                category={category}
                isExpanded={expandedCategories.has(category.id)}
                onToggle={() => toggleCategory(category.id)}
                generateLink={generateCategoryLink}
              />
            ))}
          </nav>
        )}
      </div>

      {/* Account Section */}
      <div className="mb-8">
        <h3 className="text-white font-semibold text-sm mb-4">ACCOUNT</h3>
        <nav className="space-y-2">
          <Link href="/login" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <UserIcon className="h-4 w-4 mr-2" />
            Login
          </Link>
          <Link href="/register" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors">
            Register
          </Link>
          <Link href="/cart" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            Cart
          </Link>
        </nav>
      </div>

      {/* Contact Section */}
      <div className="mb-8">
        <nav className="space-y-2">
          <Link href="/contact" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <PhoneIcon className="h-4 w-4 mr-2" />
            Contact us
          </Link>
          <Link href="/about" className="block text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors flex items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            About Us
          </Link>
        </nav>
      </div>
    </div>
  );
}
