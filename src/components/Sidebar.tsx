'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import {
  GlobeAltIcon,
  UserIcon,
  PhoneIcon,
  InformationCircleIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useLocation } from '@/contexts/LocationContext';
import { useCategories } from '@/contexts/CategoryContext';

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
  const pathname = usePathname();
  // Use cached categories from context
  const { categories, loading: categoriesLoading, error: categoriesError, refetchCategories } = useCategories();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const lastPathname = useRef<string>('');

  // Find the path from root to a specific category (returns array of category IDs)
  const findCategoryPath = useCallback((targetId: number, categories: Category[], currentPath: number[] = []): number[] => {
    for (const category of categories) {
      const newPath = [...currentPath, category.id];

      if (category.id === targetId) {
        return newPath;
      }

      if (category.children && category.children.length > 0) {
        const childPath = findCategoryPath(targetId, category.children, newPath);
        if (childPath.length > 0) {
          return childPath;
        }
      }
    }
    return [];
  }, []);

  // Find a category by ID in the categories tree
  const findCategoryById = useCallback((targetId: number, categories: Category[]): Category | null => {
    for (const category of categories) {
      if (category.id === targetId) {
        return category;
      }

      if (category.children && category.children.length > 0) {
        const found = findCategoryById(targetId, category.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }, []);

  // Get current category ID from URL to highlight active category
  const getCurrentCategoryId = useCallback((): number | null => {
    const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
    const match = path.match(/\/category\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }, [pathname]);

  // Auto-expand categories based on current URL when categories load or URL changes
  useEffect(() => {
    if (categories.length > 0 && pathname !== lastPathname.current) {
      lastPathname.current = pathname;

      const currentCategoryId = getCurrentCategoryId();
      if (currentCategoryId) {
        const pathToExpand = findCategoryPath(currentCategoryId, categories);
        if (pathToExpand.length > 0) {
          // Get parent categories that need to be expanded
          const parentsToExpand = pathToExpand.filter(catId => catId !== currentCategoryId);

          // Check if current category has children and should be expanded
          const currentCategory = findCategoryById(currentCategoryId, categories);
          const shouldExpandCurrent = currentCategory && currentCategory.children && currentCategory.children.length > 0;

          // Add parent categories and current category (if it has children) to expanded set
          setExpandedCategories(prevExpanded => {
            const newExpanded = new Set(prevExpanded); // Keep existing expansions
            parentsToExpand.forEach(catId => {
              newExpanded.add(catId);
            });

            // Expand current category if it has children
            if (shouldExpandCurrent) {
              newExpanded.add(currentCategoryId);
            }

            console.log(`🌲 Auto-expanded categories for path to ${currentCategoryId}:`, Array.from(newExpanded));
            return newExpanded;
          });
        }
      }
    }
  }, [categories, pathname, findCategoryById, findCategoryPath, getCurrentCategoryId]); // Include all dependencies

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
    // Use category ID for the new ID-based routing system
    return `/category/${category.id}`;
  };

  // No separate featured fetch - categories already prioritized by backend

  // Check if a category is in the current active path
  const isInActivePath = (categoryId: number): boolean => {
    const currentCategoryId = getCurrentCategoryId();
    if (!currentCategoryId) return false;

    const activePath = findCategoryPath(currentCategoryId, categories);
    return activePath.includes(categoryId);
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
    const currentCategoryId = getCurrentCategoryId();
    const isActive = currentCategoryId === category.id;
    const isInPath = isInActivePath(category.id);
    // Use static Tailwind classes to avoid dynamic class issues
    const indentClasses = ['', 'ml-4', 'ml-8', 'ml-12', 'ml-16', 'ml-20', 'ml-24'];
    const indentClass = indentClasses[Math.min(level, indentClasses.length - 1)];

    return (
      <div>
        {/* Category item with separate expand button and link */}
        <div className={`flex items-center py-1 text-sm ${indentClass} group`}>
          {hasChildren ? (
            <button
              onClick={onToggle}
              className="mr-2 p-1 hover:bg-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-green-500 transition-all duration-200"
              aria-label={isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
            >
              {isExpanded ? (
                <ChevronDownIcon className="h-3 w-3 text-gray-400 group-hover:text-white transition-colors" />
              ) : (
                <ChevronRightIcon className="h-3 w-3 text-gray-400 group-hover:text-white transition-colors" />
              )}
            </button>
          ) : (
            <div className="w-5" /> // Spacer for alignment
          )}

          <Link
            href={generateCategoryLink(category)}
            className={`flex-1 px-2 py-1 rounded transition-all duration-200 truncate font-medium ${isActive
                ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25'
                : isInPath
                  ? 'text-white bg-blue-500/20 border border-blue-400/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
          >
            {category.name}
          </Link>
        </div>

        {/* Render children if expanded with animation */}
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l border-gray-700/50 pl-2 mt-1">
            {category.children!.map((childCategory: Category) => (
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
                  onClick={refetchCategories}
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
            {/* All Events Item */}
            <div className="py-1 text-sm group">
              <div className="flex items-center py-1 text-sm group">
                <div className="w-5" /> {/* Spacer for alignment */}
                <Link
                  href="/category/all"
                  className={`flex-1 px-2 py-1 rounded transition-all duration-200 truncate font-medium ${pathname === '/category/all'
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                >
                  All Events
                </Link>
              </div>
            </div>

            {/* Categories (already ordered with featured first by backend) */}
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
