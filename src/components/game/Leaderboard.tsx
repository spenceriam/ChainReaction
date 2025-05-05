import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface LeaderboardEntry {
  username: string;
  user_id: string;
  completion_time: number;
  completed_at: string;
  attempts: number;
}

interface LeaderboardProps {
  type?: 'daily' | 'weekly';
  limit?: number;
}

export function Leaderboard({ type = 'daily', limit = 10 }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        
        let query;
        if (type === 'daily') {
          // Today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split('T')[0];
          
          // Get leaderboard for today's challenge
          const { data, error } = await supabase
            .rpc('get_daily_leaderboard', { challenge_date: today, entries_limit: limit });
            
          if (error) throw error;
          query = data;
        } else {
          // Get leaderboard for this week
          const { data, error } = await supabase
            .rpc('get_weekly_leaderboard', { entries_limit: limit });
            
          if (error) throw error;
          query = data;
        }
        
        setEntries(query || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, [type, limit]);
  
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
  
  if (entries.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        <h3 className="font-bold">No Data Available</h3>
        <p>There are no entries for this leaderboard yet. Be the first to complete the challenge!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="text-xl font-bold p-4 bg-blue-50">
        {type === 'daily' ? 'Daily' : 'Weekly'} Leaderboard
      </h2>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attempts
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry, index) => (
            <tr key={entry.user_id} className={index === 0 ? 'bg-yellow-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.username}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTime(entry.completion_time)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.attempts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 