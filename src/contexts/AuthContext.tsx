'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
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
  role?: string;
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
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: unknown }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/orders',
  '/settings',
  '/admin'
];

// Routes that are only for unauthenticated users
const AUTH_ONLY_ROUTES = [
  '/login',
  '/register',
  '/forgot-password'
];

// Routes that are always accessible (currently unused but kept for future functionality)
// const PUBLIC_ROUTES = [
//   '/',
//   '/about',
//   '/contact',
//   // Category routes are public by default - no need to list them all
//   '/category' // This covers all /category/* routes
// ];

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
  
  // Convert route pattern to regex (e.g., '/admin/.*' -> '/admin/.+')
  const protectedPatterns = ['/admin/.+'];
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
      if (!stored) return null;

      const session: Session = JSON.parse(stored);

      // Check if access token is expired
      if (session.expires_at && session.expires_at * 1000 < Date.now()) {
        // Token is expired, check if we can refresh it
        if (session.refresh_token) {
          console.log('Access token expired, attempting refresh...');
          return session; // Return session, let refresh logic handle it
        } else {
          // No refresh token available, clear session
          localStorage.removeItem('auth_session');
          return null;
        }
      }

      return session;
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

  // Function to refresh access token
  const refreshAccessToken = useCallback(async (refreshToken: string): Promise<Session | null> => {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.session) {
          const newSession = data.data.session;
          storeSession(newSession);
          return newSession;
        }
      }

      // Refresh failed, clear session
      storeSession(null);
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      storeSession(null);
      return null;
    }
  }, [API_BASE]);

  // Fetch user profile with token refresh capability
  const fetchProfile = useCallback(async (accessToken: string, refreshToken?: string): Promise<{ profile: UserProfile; newSession?: Session } | null> => {
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
          // Ensure role is present under profile for consistent checks
          const mergedProfile = data.data.role && (!data.data.profile || !data.data.profile.role)
            ? { ...(data.data.profile || {}), role: data.data.role }
            : data.data.profile;
          setProfile(mergedProfile);
          return { profile: mergedProfile };
        }
      }

      // If request failed due to auth error and we have refresh token, try refresh
      if ((response.status === 401 || response.status === 403) && refreshToken) {
        console.log('Profile fetch failed, attempting token refresh...');
        const newSession = await refreshAccessToken(refreshToken);
        if (newSession) {
          // Retry with new token
          const retryResponse = await fetch(`${API_BASE}/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${newSession.access_token}`,
              'Content-Type': 'application/json',
            },
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            if (retryData.success) {
              const mergedProfile = retryData.data.role && (!retryData.data.profile || !retryData.data.profile.role)
                ? { ...(retryData.data.profile || {}), role: retryData.data.role }
                : retryData.data.profile;
              setProfile(mergedProfile);
              return { profile: mergedProfile, newSession };
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, [API_BASE, refreshAccessToken]);

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
      await fetchProfile(session.access_token, session.refresh_token);
    }
  }, [session?.access_token, session?.refresh_token, fetchProfile]);

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
  const signUp = useCallback(async (email: string, password: string, metadata: Record<string, unknown> = {}) => {
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

  // Listen for auth events from API interceptors
  useEffect(() => {
    const handleSessionRefreshed = (event: CustomEvent) => {
      console.log('Session refreshed via API interceptor');
      const { session } = event.detail;
      setUser(session.user);
      setSession(session);
      // Profile will be updated automatically when needed
    };

    const handleLogout = () => {
      console.log('Logout triggered via API interceptor');
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push('/login');
    };

    window.addEventListener('auth:sessionRefreshed', handleSessionRefreshed as EventListener);
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:sessionRefreshed', handleSessionRefreshed as EventListener);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [router]);

  // Initialize auth state with improved error handling and token refresh
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get stored session
        const storedSession = getStoredSession();

        if (storedSession?.access_token) {
          console.log('Initializing auth with stored session...');

          // First, check if token is expired and try to refresh if needed
          let currentSession = storedSession;
          if (storedSession.expires_at && storedSession.expires_at * 1000 < Date.now()) {
            if (storedSession.refresh_token) {
              console.log('Stored token expired, attempting refresh during init...');
              const refreshedSession = await refreshAccessToken(storedSession.refresh_token);
              if (refreshedSession) {
                currentSession = refreshedSession;
              } else {
                // Refresh failed, session is invalid
                console.log('Token refresh failed during init, clearing session');
                storeSession(null);
                setLoading(false);
                setInitialized(true);
                return;
              }
            } else {
              // No refresh token, clear session
              console.log('No refresh token available, clearing expired session');
              storeSession(null);
              setLoading(false);
              setInitialized(true);
              return;
            }
          }

          // Verify session with backend using the potentially refreshed token
          const profileResult = await fetchProfile(currentSession.access_token, currentSession.refresh_token);

          if (profileResult) {
            setUser(currentSession.user);
            setSession(currentSession);
            setProfile(profileResult.profile);

            // If we got a new session from refresh, update state
            if (profileResult.newSession) {
              setSession(profileResult.newSession);
            }
          } else {
            // Session verification failed, clear it
            console.log('Session verification failed, clearing session');
            storeSession(null);
          }
        } else {
          console.log('No stored session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Only clear session if it's a critical error, not just network issues
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('Invalid token') || errorMessage.includes('expired')) {
          storeSession(null);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [API_BASE, refreshAccessToken, fetchProfile]);

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