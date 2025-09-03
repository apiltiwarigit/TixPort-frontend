'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

// Loading component to prevent flashing
function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized, isAuthenticating } = useAuth();
  const pathname = usePathname();

  // Show loading while auth is initializing (but NOT during user-initiated auth actions)
  if (!initialized || (loading && !isAuthenticating)) {
    return <AuthLoading />;
  }

  // Define route types
  const authOnlyRoutes = ['/login', '/register', '/forgot-password'];
  const protectedRoutes = ['/cart', '/profile', '/orders', '/settings'];
  const protectedPatterns = ['/event/.+/buy'];
  
  const isAuthOnlyRoute = authOnlyRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.includes(pathname) || 
    protectedPatterns.some(pattern => new RegExp(`^${pattern}$`).test(pathname));

  // For auth-only routes: if user is logged in, redirect happens in AuthContext
  // For protected routes: if user is not logged in, redirect happens in AuthContext
  // For all other routes: show content

  // The actual redirects are handled in AuthContext to prevent flashing
  // This component just ensures we don't render content during transitions
  if (isAuthOnlyRoute && user) {
    return <AuthLoading />; // Show loading while redirect happens
  }

  if (isProtectedRoute && !user) {
    return <AuthLoading />; // Show loading while redirect happens
  }

  // Render children for all valid states
  return <>{children}</>;
}
