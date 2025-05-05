import React, { useState, useEffect } from 'react';

interface WordChainProps {
  startWord: string;
  endWord: string;
  chainLength: number;
  onComplete?: () => void;
}

export function WordChain({ startWord, endWord, chainLength, onComplete }: WordChainProps) {
  const [chain, setChain] = useState<string[]>(Array(chainLength).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string[]>(Array(chainLength).fill(''));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isChainComplete, setIsChainComplete] = useState(false);

  // Initialize the chain with start and end words
  useEffect(() => {
    const newChain = [...chain];
    newChain[0] = startWord;
    newChain[chainLength - 1] = endWord;
    setChain(newChain);
  }, [startWord, endWord, chainLength, chain]);

  // Check for chain completion
  useEffect(() => {
    const complete = chain.every(word => word !== '');
    setIsChainComplete(complete);
    
    if (complete && !isChainComplete && onComplete) {
      onComplete();
    }
  }, [chain, isChainComplete, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value.toUpperCase());
  };

  const validateWord = (word: string, index: number): boolean => {
    // For now, just check if the word differs by exactly one letter from adjacent words
    if (index > 0 && chain[index - 1]) {
      if (!differsByOneLetter(word, chain[index - 1])) {
        return false;
      }
    }
    
    if (index < chainLength - 1 && chain[index + 1]) {
      if (!differsByOneLetter(word, chain[index + 1])) {
        return false;
      }
    }
    
    return true;
  };

  const differsByOneLetter = (word1: string, word2: string): boolean => {
    if (word1.length !== word2.length) return false;
    
    let differences = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] !== word2[i]) {
        differences++;
      }
    }
    
    return differences === 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.length !== startWord.length) {
      setFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[currentIndex] = "Word must be the same length as the start word";
        return newFeedback;
      });
      return;
    }
    
    const isValid = validateWord(inputValue, currentIndex);
    setAttempts(attempts + 1);
    
    if (isValid) {
      // Update the chain
      const newChain = [...chain];
      newChain[currentIndex] = inputValue;
      setChain(newChain);
      
      // Update feedback
      setFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[currentIndex] = "Valid word!";
        return newFeedback;
      });
      
      // Move to the next empty position
      const nextEmptyIndex = newChain.findIndex((word, idx) => idx !== 0 && idx !== chainLength - 1 && !word);
      if (nextEmptyIndex !== -1) {
        setCurrentIndex(nextEmptyIndex);
      }
      
      setInputValue('');
    } else {
      setFeedback((prev) => {
        const newFeedback = [...prev];
        newFeedback[currentIndex] = "Invalid word. Try again.";
        return newFeedback;
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Word Chain Challenge</h2>
      
      <div className="flex flex-col space-y-4 mb-6">
        {chain.map((word, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg ${
                index === 0 ? 'bg-green-100' : 
                index === chainLength - 1 ? 'bg-red-100' : 
                word ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              {word || '?'}
            </div>
            
            <div className="flex-1">
              {index === currentIndex && !isChainComplete ? (
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="flex-1 p-2 border rounded"
                    placeholder="Enter word"
                    maxLength={startWord.length}
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Try
                  </button>
                </form>
              ) : null}
              
              {feedback[index] && (
                <div className={`mt-1 text-sm ${
                  feedback[index].includes('Valid') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback[index]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
        <div><strong>Attempts:</strong> {attempts}</div>
        <div><strong>Status:</strong> {isChainComplete ? 'Chain Complete! 🎉' : 'In Progress...'}</div>
      </div>
      
      {isChainComplete && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 rounded">
          Congratulations! You've completed the word chain.
        </div>
      )}
    </div>
  );
} 