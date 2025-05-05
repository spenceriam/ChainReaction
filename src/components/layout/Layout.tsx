import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
                ChainReaction
              </Link>
              <nav className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/daily-challenge"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/daily-challenge'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Daily Challenge
                </Link>
                <Link
                  to="/timed-mode"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/timed-mode'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Timed Mode
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/leaderboard'
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Leaderboards
                </Link>
              </nav>
            </div>
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button 
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
                  Sign In
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile navigation */}
          <div className="md:hidden mt-3 pb-2">
            <div className="flex space-x-2">
              <Link
                to="/"
                className={`px-3 py-1 rounded-md text-sm ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/daily-challenge"
                className={`px-3 py-1 rounded-md text-sm ${
                  location.pathname === '/daily-challenge'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Daily
              </Link>
              <Link
                to="/timed-mode"
                className={`px-3 py-1 rounded-md text-sm ${
                  location.pathname === '/timed-mode'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Timed
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-1 rounded-md text-sm ${
                  location.pathname === '/leaderboard'
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            ChainReaction © {new Date().getFullYear()} - Word Chain Game
          </p>
        </div>
      </footer>
    </div>
  );
} 