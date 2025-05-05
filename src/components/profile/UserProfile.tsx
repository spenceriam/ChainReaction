import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

interface UserStats {
  challenges_completed: number;
  total_score: number;
  streak: number;
  last_completed_date: string;
  timed_games_played: number;
  timed_chains_completed: number;
  timed_high_score: number;
  timed_best_level: number;
  endless_games_played: number;
  endless_chains_completed: number;
  endless_high_score: number;
  endless_max_difficulty: string;
}

interface UserProfile {
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export function UserProfile() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'timed' | 'endless'>('overview');
  
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, email, avatar_url, created_at')
          .eq('id', user.id)
          .single();
        
        if (profileError) throw profileError;
        
        // Get user stats
        const { data: statsData, error: statsError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        
        setUserProfile(profileData || {
          username: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          created_at: user.created_at
        });
        
        setUserStats(statsData || {
          challenges_completed: 0,
          total_score: 0,
          streak: 0,
          last_completed_date: null,
          timed_games_played: 0,
          timed_chains_completed: 0,
          timed_high_score: 0,
          timed_best_level: 0,
          endless_games_played: 0,
          endless_chains_completed: 0,
          endless_high_score: 0,
          endless_max_difficulty: 'easy'
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);
  
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        <h3 className="font-bold">No Profile Found</h3>
        <p>Your profile information could not be loaded.</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="bg-blue-700 text-white p-6">
          <div className="flex items-center">
            <div className="h-24 w-24 rounded-full bg-white text-blue-700 flex items-center justify-center text-3xl font-bold">
              {userProfile.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold">{userProfile.username}</h1>
              <p className="text-blue-100">Member since {formatDate(userProfile.created_at)}</p>
              {userStats?.total_score ? (
                <div className="mt-2 px-3 py-1 bg-blue-800 text-white inline-block rounded-full">
                  Total Score: {userStats.total_score}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'daily'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Daily Challenges
            </button>
            <button
              onClick={() => setActiveTab('timed')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'timed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Timed Mode
            </button>
            <button
              onClick={() => setActiveTab('endless')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'endless'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Endless Mode
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Daily Challenges</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-2xl font-bold">{userStats?.challenges_completed || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Current Streak</p>
                    <p className="text-2xl font-bold">{userStats?.streak || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Timed Mode</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Games Played</p>
                    <p className="text-2xl font-bold">{userStats?.timed_games_played || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Best Score</p>
                    <p className="text-2xl font-bold">{userStats?.timed_high_score || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Endless Mode</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Chains Completed</p>
                    <p className="text-2xl font-bold">{userStats?.endless_chains_completed || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Best Score</p>
                    <p className="text-2xl font-bold">{userStats?.endless_high_score || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Total Score</p>
                    <p className="text-2xl font-bold">{userStats?.total_score || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Last Activity</p>
                    <p className="text-sm font-medium">{formatDate(userStats?.last_completed_date || null)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'daily' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Challenge Statistics</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Challenges Completed</p>
                    <p className="text-3xl font-bold">{userStats?.challenges_completed || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Current Streak</p>
                    <p className="text-3xl font-bold">{userStats?.streak || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Last Completed</p>
                    <p className="text-lg font-medium">{formatDate(userStats?.last_completed_date || null)}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Challenge History</h4>
                  {userStats?.challenges_completed ? (
                    <p className="text-gray-600">
                      Challenge history will be available in a future update.
                    </p>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
                      You haven't completed any daily challenges yet. Try today's challenge!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'timed' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timed Mode Statistics</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Games Played</p>
                    <p className="text-3xl font-bold">{userStats?.timed_games_played || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">High Score</p>
                    <p className="text-3xl font-bold">{userStats?.timed_high_score || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Best Level</p>
                    <p className="text-3xl font-bold">{userStats?.timed_best_level || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Chains Completed</p>
                    <p className="text-3xl font-bold">{userStats?.timed_chains_completed || 0}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Games</h4>
                  {userStats?.timed_games_played ? (
                    <p className="text-gray-600">
                      Game history will be available in a future update.
                    </p>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
                      You haven't played any timed mode games yet. Try it now!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'endless' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Endless Mode Statistics</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm">Games Played</p>
                    <p className="text-3xl font-bold">{userStats?.endless_games_played || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">High Score</p>
                    <p className="text-3xl font-bold">{userStats?.endless_high_score || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Max Difficulty</p>
                    <p className="text-3xl font-bold capitalize">{userStats?.endless_max_difficulty || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Chains Completed</p>
                    <p className="text-3xl font-bold">{userStats?.endless_chains_completed || 0}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Games</h4>
                  {userStats?.endless_games_played ? (
                    <p className="text-gray-600">
                      Game history will be available in a future update.
                    </p>
                  ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
                      You haven't played any endless mode games yet. Try it now!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 