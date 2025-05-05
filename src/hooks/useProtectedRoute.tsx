import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { hasAccessToFeature } from '../utils/supabase-security';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredFeature?: string;
  fallback?: React.ReactNode;
}

/**
 * A hook to protect routes based on authentication and feature access
 * Use this to wrap components that should only be accessible to authenticated users
 * or users with specific feature access
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredFeature,
    fallback = <div className="p-8 text-center">Please sign in to access this page</div>
  }) => {
    const [hasAccess, setHasAccess] = useState<boolean>(false);
    const [checkingAccess, setCheckingAccess] = useState<boolean>(true);
    
    useEffect(() => {
      const checkAccess = async () => {
        setCheckingAccess(true);
        
        // First check if user is logged in
        if (!user) {
          setHasAccess(false);
          setCheckingAccess(false);
          return;
        }
        
        // If no specific feature is required, just being logged in is enough
        if (!requiredFeature) {
          setHasAccess(true);
          setCheckingAccess(false);
          return;
        }
        
        // Check if user has access to the required feature
        const access = await hasAccessToFeature(requiredFeature, user);
        setHasAccess(access);
        setCheckingAccess(false);
      };
      
      if (!loading) {
        checkAccess();
      }
    }, [user, loading, requiredFeature]);
    
    if (loading || checkingAccess) {
      return <div className="p-8 text-center">Loading...</div>;
    }
    
    return hasAccess ? <>{children}</> : <>{fallback}</>;
  };
  
  return { ProtectedRoute };
}

/**
 * Example usage:
 * 
 * const { ProtectedRoute } = useProtectedRoute();
 * 
 * function App() {
 *   return (
 *     <ProtectedRoute requiredFeature="tournaments">
 *       <TournamentPage />
 *     </ProtectedRoute>
 *   );
 * }
 */ 