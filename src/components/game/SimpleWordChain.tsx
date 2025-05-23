import React, { useState, useEffect } from 'react';

interface SimpleWordChainProps {
  startWord: string;
  endWord: string;
  chainLength: number;
  onComplete?: (attempts: number, time: number) => void;
  darkMode?: boolean;
}

export function SimpleWordChain({ 
  startWord, 
  endWord, 
  chainLength, 
  onComplete,
  darkMode = true
}: SimpleWordChainProps) {
  const [chain, setChain] = useState<string[]>(Array(chainLength).fill(''));
  const [attempts, setAttempts] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | ''>('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isChainComplete, setIsChainComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Theme classes
  const themeClasses = {
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    subtext: darkMode ? 'text-gray-400' : 'text-gray-600',
    inputBg: darkMode ? 'bg-gray-800' : 'bg-white',
    inputBorder: darkMode ? 'border-gray-700' : 'border-gray-300',
    inputFocus: darkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500',
    buttonPrimary: darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700',
    wordStart: darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800',
    wordEnd: darkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800',
    wordFilled: darkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800',
    wordEmpty: darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-400',
    feedbackSuccess: darkMode ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800',
    feedbackError: darkMode ? 'bg-red-900 text-red-100' : 'bg-red-50 text-red-800',
    feedbackWarning: darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-800',
  };

  // Initialize the chain with start and end words
  useEffect(() => {
    setChain(prevChain => {
      const newChain = [...prevChain];
      newChain[0] = startWord;
      newChain[chainLength - 1] = endWord;
      return newChain;
    });
    setStartTime(Date.now());
  }, [startWord, endWord, chainLength]);

  // Update elapsed time
  useEffect(() => {
    if (!isChainComplete) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isChainComplete]);

  // Check for chain completion
  useEffect(() => {
    const complete = chain.every(word => word !== '');
    
    if (complete && !isChainComplete) {
      setIsChainComplete(true);
      const finalTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(finalTime);
      
      if (onComplete) {
        onComplete(attempts, finalTime);
      }
      
      setFeedbackMessage('Chain complete! 🎉');
      setFeedbackType('success');
    }
  }, [chain, isChainComplete, attempts, startTime, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= startWord.length) {
      setInputValue(value);
    }
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
    
    // Here we'd ideally check against a dictionary API or local word list
    // For now, let's assume all words of the correct length are valid
    return word.length === startWord.length;
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
      setFeedbackMessage(`Word must be ${startWord.length} letters`);
      setFeedbackType('error');
      return;
    }
    
    setAttempts(attempts + 1);
    const isValid = validateWord(inputValue, currentIndex);
    
    if (isValid) {
      // Update the chain
      const newChain = [...chain];
      newChain[currentIndex] = inputValue;
      setChain(newChain);
      
      // Success feedback
      setFeedbackMessage('Valid word!');
      setFeedbackType('success');
      
      // Move to the next empty position, always skipping index 0 (the first word) and the last word
      const nextEmptyIndex = newChain.findIndex((word, idx) => idx > 0 && idx < chainLength - 1 && !word);
      if (nextEmptyIndex !== -1) {
        setCurrentIndex(nextEmptyIndex);
      }
      
      setInputValue('');
    } else {
      // Error feedback
      setFeedbackMessage('Invalid word. Try again.');
      setFeedbackType('error');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Game status bar */}
      <div className={`flex justify-between items-center mb-4 text-sm ${themeClasses.text}`}>
        <div>
          Attempts: <span className="font-bold">{attempts}</span>
        </div>
        <div>
          Time: <span className="font-bold">{elapsedTime}s</span>
        </div>
      </div>
      
      {/* Word chain display - mobile first */}
      <div className="flex flex-col space-y-3 mb-6">
        {chain.map((word, index) => (
          <div key={index} className="flex items-center">
            {/* Position indicator */}
            <div className={`w-8 text-center text-sm ${themeClasses.subtext}`}>
              {index === 0 ? 'Start' : index === chainLength - 1 ? 'End' : `#${index}`}
            </div>
            
            {/* Word box */}
            <div 
              className={`flex-1 h-12 flex items-center justify-center rounded-md font-bold text-xl ${
                index === 0 ? themeClasses.wordStart : 
                index === chainLength - 1 ? themeClasses.wordEnd : 
                word ? themeClasses.wordFilled : themeClasses.wordEmpty
              }`}
            >
              {word || (index === currentIndex && !isChainComplete ? '_' : '?')}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input form */}
      {!isChainComplete && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className={`flex-1 h-12 px-4 border ${themeClasses.inputBg} ${themeClasses.inputBorder} rounded-l-md text-lg uppercase focus:outline-none focus:ring-2 ${themeClasses.inputFocus} ${themeClasses.text}`}
              placeholder={`Enter ${startWord.length}-letter word`}
              aria-label={`Enter ${startWord.length}-letter word`}
              maxLength={startWord.length}
            />
            <button 
              type="submit"
              className={`${themeClasses.buttonPrimary} text-white px-6 py-3 rounded-r-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Try
            </button>
          </div>
        </form>
      )}
      
      {/* Feedback message */}
      {feedbackMessage && (
        <div className={`p-3 rounded-md text-center ${
          feedbackType === 'success' ? themeClasses.feedbackSuccess : 
          feedbackType === 'error' ? themeClasses.feedbackError : 
          feedbackType === 'warning' ? themeClasses.feedbackWarning : ''
        }`}>
          {feedbackMessage}
        </div>
      )}
      
      {/* Completion message */}
      {isChainComplete && (
        <div className={`mt-8 p-4 ${themeClasses.feedbackSuccess} rounded-md text-center`}>
          <h3 className="font-bold text-xl mb-2">Chain Complete! 🎉</h3>
          <p>You solved it in {attempts} attempts and {elapsedTime} seconds.</p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 ${themeClasses.buttonPrimary} text-white px-6 py-2 rounded-md font-medium`}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 