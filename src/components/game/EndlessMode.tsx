import React, { useState, useEffect, useCallback } from 'react';
import { WordChain } from './WordChain';
import { supabase } from '../../utils/supabaseClient';

interface WordChainConfig {
  startWord: string;
  endWord: string;
  chainLength: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function EndlessMode() {
  const [score, setScore] = useState(0);
  const [chains, setChains] = useState<WordChainConfig[]>([]);
  const [currentChainIndex, setCurrentChainIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chainsCompleted, setChainsCompleted] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // Generate a batch of chains at the start
  const generateChains = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get a batch of chains from the database
      const { data, error } = await supabase
        .from('word_chains')
        .select('*')
        .eq('difficulty', difficultyLevel)
        .order('RANDOM()')
        .limit(5);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedChains = data.map(chain => ({
          startWord: chain.start_word,
          endWord: chain.end_word,
          chainLength: chain.chain_length,
          difficulty: difficultyLevel
        }));
        
        setChains(formattedChains);
      } else {
        // Fallback if no chains found in database
        const fallbackChains: Record<string, WordChainConfig[]> = {
          easy: [
            { startWord: 'WORD', endWord: 'GAME', chainLength: 4, difficulty: 'easy' },
            { startWord: 'HEAT', endWord: 'COLD', chainLength: 4, difficulty: 'easy' },
            { startWord: 'SHIP', endWord: 'DOCK', chainLength: 4, difficulty: 'easy' },
            { startWord: 'LAMP', endWord: 'DARK', chainLength: 4, difficulty: 'easy' },
            { startWord: 'TREE', endWord: 'LEAF', chainLength: 4, difficulty: 'easy' }
          ],
          medium: [
            { startWord: 'CHAIN', endWord: 'LINKS', chainLength: 5, difficulty: 'medium' },
            { startWord: 'BREAD', endWord: 'TOAST', chainLength: 5, difficulty: 'medium' },
            { startWord: 'STONE', endWord: 'BRICK', chainLength: 5, difficulty: 'medium' },
            { startWord: 'LIGHT', endWord: 'SHADE', chainLength: 5, difficulty: 'medium' },
            { startWord: 'WATER', endWord: 'STEAM', chainLength: 5, difficulty: 'medium' }
          ],
          hard: [
            { startWord: 'FRIEND', endWord: 'FAMILY', chainLength: 6, difficulty: 'hard' },
            { startWord: 'PLANET', endWord: 'GALAXY', chainLength: 6, difficulty: 'hard' },
            { startWord: 'SUMMER', endWord: 'WINTER', chainLength: 6, difficulty: 'hard' },
            { startWord: 'CASTLE', endWord: 'PALACE', chainLength: 6, difficulty: 'hard' },
            { startWord: 'FOREST', endWord: 'JUNGLE', chainLength: 6, difficulty: 'hard' }
          ]
        };
        
        setChains(fallbackChains[difficultyLevel]);
      }
    } catch (err) {
      console.error('Error generating chains:', err);
      setError('Failed to generate word chains. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [difficultyLevel]);
  
  // Initialize the game
  useEffect(() => {
    generateChains();
  }, [generateChains]);
  
  // Handle chain completion
  const handleChainComplete = useCallback(async () => {
    // Increase score based on difficulty
    const difficultyMultiplier = 
      difficultyLevel === 'hard' ? 3 :
      difficultyLevel === 'medium' ? 2 : 1;
    
    const pointsEarned = 100 * difficultyMultiplier;
    setScore(prev => prev + pointsEarned);
    
    // Increment chains completed
    const newChainsCompleted = chainsCompleted + 1;
    setChainsCompleted(newChainsCompleted);
    
    // Progress to the next chain or generate new ones if needed
    if (currentChainIndex < chains.length - 1) {
      setCurrentChainIndex(prev => prev + 1);
    } else {
      // Increase difficulty after every 5 chains
      if (newChainsCompleted % 5 === 0) {
        if (difficultyLevel === 'easy') {
          setDifficultyLevel('medium');
        } else if (difficultyLevel === 'medium') {
          setDifficultyLevel('hard');
        }
      }
      
      // Generate new chains and reset index
      await generateChains();
      setCurrentChainIndex(0);
    }
  }, [currentChainIndex, chains.length, difficultyLevel, chainsCompleted, generateChains]);
  
  // End the game and save score
  const endGame = async () => {
    try {
      setIsGameOver(true);
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user) {
        await supabase.from('user_scores').insert({
          user_id: user.id,
          score: score,
          mode: 'endless',
          chains_completed: chainsCompleted,
          max_difficulty: difficultyLevel,
          created_at: new Date().toISOString()
        });
        
        // Update user stats
        await supabase.rpc('update_user_endless_stats', {
          score_value: score,
          chains_completed: chainsCompleted,
          max_difficulty: difficultyLevel
        });
      }
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };
  
  if (loading && chains.length === 0) {
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
  
  const currentChain = chains[currentChainIndex];
  
  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Endless Mode</h1>
        <div className="mt-2 flex justify-between items-center">
          <div className="flex space-x-4">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
              Score: {score}
            </div>
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Chains: {chainsCompleted}
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium">
            {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
          </div>
        </div>
      </div>
      
      {isGameOver ? (
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Game Over!</h2>
          <p className="text-lg mb-2">Chains completed: {chainsCompleted}</p>
          <p className="text-lg mb-2">Final score: {score}</p>
          <p className="text-md mb-6">
            Highest difficulty: {difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setScore(0);
                setChainsCompleted(0);
                setDifficultyLevel('easy');
                setCurrentChainIndex(0);
                setIsGameOver(false);
                generateChains();
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
        <div>
          <WordChain
            startWord={currentChain.startWord}
            endWord={currentChain.endWord}
            chainLength={currentChain.chainLength}
            onComplete={handleChainComplete}
          />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={endGame}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              End Game
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
} 