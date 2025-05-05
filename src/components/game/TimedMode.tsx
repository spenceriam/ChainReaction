import React, { useState, useEffect, useCallback } from 'react';
import { WordChain } from './WordChain';
import { supabase } from '../../utils/supabaseClient';

interface WordChainConfig {
  startWord: string;
  endWord: string;
  chainLength: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function TimedMode() {
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes to start
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentChain, setCurrentChain] = useState<WordChainConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chainsCompleted, setChainsCompleted] = useState(0);
  
  // Generate a new chain based on the current level
  const generateNewChain = useCallback(async () => {
    try {
      setLoading(true);
      
      // Determine difficulty based on level
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      if (level > 10) {
        difficulty = 'hard';
      } else if (level > 5) {
        difficulty = 'medium';
      }
      
      // Get a random word chain from the database
      const { data, error } = await supabase
        .from('word_chains')
        .select('*')
        .eq('difficulty', difficulty)
        .order('RANDOM()')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentChain({
          startWord: data.start_word,
          endWord: data.end_word,
          chainLength: data.chain_length,
          difficulty: difficulty
        });
      } else {
        // Fallback if no chains found in database
        const fallbackChains: Record<string, WordChainConfig[]> = {
          easy: [
            { startWord: 'WORD', endWord: 'GAME', chainLength: 4, difficulty: 'easy' },
            { startWord: 'HEAT', endWord: 'COLD', chainLength: 4, difficulty: 'easy' },
            { startWord: 'SHIP', endWord: 'DOCK', chainLength: 4, difficulty: 'easy' }
          ],
          medium: [
            { startWord: 'CHAIN', endWord: 'LINKS', chainLength: 5, difficulty: 'medium' },
            { startWord: 'BREAD', endWord: 'TOAST', chainLength: 5, difficulty: 'medium' },
            { startWord: 'STONE', endWord: 'BRICK', chainLength: 5, difficulty: 'medium' }
          ],
          hard: [
            { startWord: 'FRIEND', endWord: 'FAMILY', chainLength: 6, difficulty: 'hard' },
            { startWord: 'PLANET', endWord: 'GALAXY', chainLength: 6, difficulty: 'hard' },
            { startWord: 'SUMMER', endWord: 'WINTER', chainLength: 6, difficulty: 'hard' }
          ]
        };
        
        const randomIndex = Math.floor(Math.random() * fallbackChains[difficulty].length);
        setCurrentChain(fallbackChains[difficulty][randomIndex]);
      }
    } catch (err) {
      console.error('Error generating new chain:', err);
      setError('Failed to generate a new word chain. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [level]);
  
  // Initialize the game
  useEffect(() => {
    generateNewChain();
  }, [generateNewChain]);
  
  // Save the score to the database when game is over
  const saveScore = useCallback(async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user) {
        await supabase.from('user_scores').insert({
          user_id: user.id,
          score: score,
          mode: 'timed',
          level_reached: level,
          chains_completed: chainsCompleted,
          created_at: new Date().toISOString()
        });
        
        // Update user stats
        await supabase.rpc('update_user_timed_stats', {
          score_value: score,
          level_reached: level,
          chains_completed: chainsCompleted
        });
      }
    } catch (err) {
      console.error('Error saving score:', err);
    }
  }, [score, level, chainsCompleted]);
  
  // Timer countdown
  useEffect(() => {
    if (isGameOver || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        setIsGameOver(true);
        saveScore();
      }
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, isGameOver, saveScore]);
  
  // Handle chain completion
  const handleChainComplete = () => {
    // Increase score based on difficulty and time remaining
    const difficultyMultiplier = 
      currentChain?.difficulty === 'hard' ? 3 :
      currentChain?.difficulty === 'medium' ? 2 : 1;
    
    const pointsEarned = 100 * difficultyMultiplier;
    setScore(prev => prev + pointsEarned);
    
    // Add time based on difficulty
    const timeBonus = 
      currentChain?.difficulty === 'hard' ? 60 :
      currentChain?.difficulty === 'medium' ? 45 : 30;
    
    setTimeRemaining(prev => prev + timeBonus);
    
    // Increment level and chains completed
    setLevel(prev => prev + 1);
    setChainsCompleted(prev => prev + 1);
    
    // Generate a new chain
    generateNewChain();
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (loading && !currentChain) {
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
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Timed Mode</h1>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Level: {level}
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Score: {score}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full font-bold ${
            timeRemaining < 30 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            Time: {formatTime(timeRemaining)}
          </div>
        </div>
      </div>
      
      {isGameOver ? (
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
          <p className="text-lg mb-2">You reached level {level}</p>
          <p className="text-lg mb-4">Final score: {score}</p>
          <p className="text-md mb-6">Chains completed: {chainsCompleted}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setTimeRemaining(180);
                setScore(0);
                setLevel(1);
                setChainsCompleted(0);
                setIsGameOver(false);
                generateNewChain();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Play Again
            </button>
            <button 
              onClick={() => window.location.href = '/leaderboard'}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              View Leaderboards
            </button>
          </div>
        </div>
      ) : currentChain ? (
        <WordChain
          startWord={currentChain.startWord}
          endWord={currentChain.endWord}
          chainLength={currentChain.chainLength}
          onComplete={handleChainComplete}
        />
      ) : null}
    </div>
  );
} 