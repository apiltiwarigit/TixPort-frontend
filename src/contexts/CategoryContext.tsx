'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 CategoryContext: Fetching categories from API...');
      const response = await categoriesApi.getCategories();

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch categories');
      }

      // Transform categories into tree structure
      // Backend returns categories directly in data, not nested under data.categories
      const categoriesList = response.data || [];
      const transformedCategories = transformCategoriesToTree(categoriesList);
      
      setCategories(transformedCategories);
      console.log(`✅ CategoryContext: Loaded ${categoriesList.length} categories (${transformedCategories.length} root categories)`);
    } catch (err: any) {
      console.error('❌ CategoryContext: Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const transformCategoriesToTree = (categories: any[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    // First pass: create all category objects
    categories.forEach((cat) => {
      const category: Category = {
        id: Number(cat.id),
        name: cat.name,
        slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        parent: cat.parent ? {
          id: Number(cat.parent.id),
          name: cat.parent.name,
          slug: cat.parent.slug || cat.parent.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        } : undefined,
        children: []
      };
      categoryMap.set(Number(cat.id), category);
    });

    // Second pass: build tree structure
    categoryMap.forEach((category) => {
      if (category.parent) {
        const parentCategory = categoryMap.get(category.parent.id);
        if (parentCategory) {
          parentCategory.children = parentCategory.children || [];
          parentCategory.children.push(category);
        } else {
          // Parent not found, treat as root
          rootCategories.push(category);
        }
      } else {
        rootCategories.push(category);
      }
    });

    // Sort categories alphabetically
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => a.name.localeCompare(b.name));
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children);
        }
      });
    };

    sortCategories(rootCategories);
    return rootCategories;
  };

  const refetchCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const value: CategoryContextType = {
    categories,
    loading,
    error,
    refetchCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories(): CategoryContextType {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}

export default CategoryContext;
