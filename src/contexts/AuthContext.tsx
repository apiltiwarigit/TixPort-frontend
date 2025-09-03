'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
  phone?: string;
}

interface Session {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user: User;
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  newsletter_subscribed?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  isAuthenticating: boolean; // New flag for user-initiated auth actions
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/cart',
  '/event/*/buy',
  '/profile',
  '/orders',
  '/settings'
];

// Routes that are only for unauthenticated users
const AUTH_ONLY_ROUTES = [
  '/login',
  '/register',
  '/forgot-password'
];

// Routes that are always accessible
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/category/concerts',
  '/category/sports',
  '/category/theatre'
];

// Helper function to determine route type
function getRouteType(pathname: string): 'protected' | 'auth-only' | 'public' {
  // Check auth-only routes first
  if (AUTH_ONLY_ROUTES.includes(pathname)) {
    return 'auth-only';
  }
  
  // Check protected routes and patterns
  if (PROTECTED_ROUTES.includes(pathname)) {
    return 'protected';
  }
  
  // Convert route pattern to regex (e.g., '/event/*/buy' -> '/event/.+/buy')
  const protectedPatterns = ['/event/.+/buy'];
  for (const pattern of protectedPatterns) {
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(pathname)) {
      return 'protected';
    }
  }
  
  return 'public';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // API base URL
  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/api`;

  // Helper function to get stored session
  const getStoredSession = (): Session | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('auth_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  // Helper function to store session
  const storeSession = (session: Session | null) => {
    if (typeof window === 'undefined') return;
    if (session) {
      localStorage.setItem('auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('auth_session');
    }
  };

  // Fetch user profile
  const fetchProfile = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data.profile);
          return data.data.profile;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [API_BASE]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!session?.access_token) {
      return { error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data.profile);
        return {};
      } else {
        return { error: data.message };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'Failed to update profile' };
    }
  }, [session?.access_token, API_BASE]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  }, [session?.access_token, fetchProfile]);

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setIsAuthenticating(false);
        return { error: { message: data.message, code: data.code } };
      }

      // Set auth state
      setUser(data.data.user);
      setSession(data.data.session);
      setProfile(data.data.profile);

      // Store session
      storeSession(data.data.session);

      setIsAuthenticating(false);
      return {};
    } catch (error) {
      setIsAuthenticating(false);
      return { error: { message: 'Network error' } };
    }
  }, [API_BASE]);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, metadata: any = {}) => {
    setIsAuthenticating(true);
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, metadata }),
      });

      const data = await response.json();

      if (!data.success) {
        setIsAuthenticating(false);
        return { error: { message: data.message, code: data.code } };
      }

      // Set auth state if user was immediately created (no email confirmation)
      if (data.data.user) {
        setUser(data.data.user);
        setSession(data.data.session);
        setProfile(data.data.profile);
        storeSession(data.data.session);
      }

      setIsAuthenticating(false);
      return {};
    } catch (error) {
      setIsAuthenticating(false);
      return { error: { message: 'Network error' } };
    }
  }, [API_BASE]);

  // Sign out function
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      if (session?.access_token) {
        await fetch(`${API_BASE}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // Clear state regardless of API response
      setUser(null);
      setProfile(null);
      setSession(null);
      storeSession(null);
      setLoading(false);
      router.push('/');
    }
  }, [session?.access_token, API_BASE, router]);

  // Handle route protection
  useEffect(() => {
    if (!initialized) return;

    const routeType = getRouteType(pathname);
    
    // No flashing - immediate decisions based on current auth state
    if (routeType === 'protected' && !user) {
      // Protected route but no user - redirect to login
      router.replace('/login');
    } else if (routeType === 'auth-only' && user) {
      // Auth-only route but user is logged in - redirect to home
      router.replace('/');
    }
  }, [pathname, user, initialized, router]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get stored session
        const storedSession = getStoredSession();
        
        if (storedSession?.access_token) {
          // Verify session with backend
          const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${storedSession.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data.user);
              setSession(storedSession);
              setProfile(data.data.profile);
            } else {
              // Invalid session, clear it
              storeSession(null);
            }
          } else {
            // Invalid session, clear it
            storeSession(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        storeSession(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [API_BASE]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    initialized,
    isAuthenticating,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}