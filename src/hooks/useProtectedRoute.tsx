import React from 'react';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A hook that returns a component that will only render its children
 * if the user is authenticated.
 * 
 * @returns A ProtectedRoute component
 */
export function useProtectedRoute() {
  const { user, loading } = useAuth();
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback = <div>Please sign in to view this content</div>
  }) => {
    // If still loading, show a loading indicator
    if (loading) {
      return <div>Loading...</div>;
    }
    
    // If not authenticated, show the fallback
    if (!user) {
      return <>{fallback}</>;
    }
    
    // If authenticated, show the children
    return <>{children}</>;
  };
  
  return ProtectedRoute;
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