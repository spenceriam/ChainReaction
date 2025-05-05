import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ChainReaction</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </a>
              <a href="/daily" className="text-gray-500 hover:text-gray-900">
                Daily Challenge
              </a>
              <a href="/leaderboard" className="text-gray-500 hover:text-gray-900">
                Leaderboard
              </a>
              {user && (
                <a href="/profile" className="text-gray-500 hover:text-gray-900">
                  Profile
                </a>
              )}
            </nav>
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <a
                    href="/signin"
                    className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ChainReaction. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 