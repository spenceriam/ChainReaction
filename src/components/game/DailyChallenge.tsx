import React, { useState, useEffect } from 'react';
import { WordChain } from './WordChain';
import { supabase } from '../../utils/supabaseClient';

interface Challenge {
  id: string;
  date: string;
  start_word: string;
  end_word: string;
  chain_length: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function DailyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    async function fetchDailyChallenge() {
      try {
        setLoading(true);
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Query for today's challenge
        const { data, error } = await supabase
          .from('daily_challenges')
          .select('*')
          .eq('date', today)
          .single();
        
        if (error) throw error;
        
        setChallenge(data);
        setStartTime(Date.now());
      } catch (err) {
        console.error('Error fetching daily challenge:', err);
        setError('Failed to load today\'s challenge. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDailyChallenge();
  }, []);
  
  const handleChainCompletion = async () => {
    if (!challenge || !startTime) return;
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000); // in seconds
    setCompletionTime(duration);
    setIsCompleted(true);
    
    try {
      // Save user's solution to the database
      const { error } = await supabase
        .from('user_solutions')
        .insert({
          challenge_id: challenge.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          completion_time: duration,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update user stats
      await supabase.rpc('update_user_stats_on_completion', {
        challenge_id: challenge.id,
        completion_time: duration
      });
      
    } catch (err) {
      console.error('Error saving solution:', err);
      // Continue showing the completion, even if saving failed
    }
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
  
  if (!challenge) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        <h3 className="font-bold">No Challenge Available</h3>
        <p>There is no challenge available for today. Please check back tomorrow!</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Daily Challenge</h1>
        <p className="text-gray-600">
          {new Date(challenge.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
        <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Difficulty: {challenge.difficulty}
        </div>
      </div>
      
      <WordChain 
        startWord={challenge.start_word}
        endWord={challenge.end_word}
        chainLength={challenge.chain_length}
        onComplete={handleChainCompletion}
      />
      
      {isCompleted && (
        <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg">
          <h3 className="font-bold">Challenge Completed!</h3>
          <p>You completed today's challenge in {formatTime(completionTime || 0)}.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.href = '/leaderboard'}
          >
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
} 