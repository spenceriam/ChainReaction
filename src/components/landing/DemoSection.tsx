'use client'

import React, { useState, useEffect } from 'react';

type DemoStep = {
  chain: string[];
  currentIndex: number;
  message: string;
};

export default function DemoSection() {
  const [step, setStep] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typedWord, setTypedWord] = useState('');
  
  const startWord = 'COLD';
  const endWord = 'WARM';
  const solution = ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'];
  
  const demoSteps: DemoStep[] = [
    {
      chain: ['COLD', '', '', '', 'WARM'],
      currentIndex: -1,
      message: 'The goal is to transform the start word "COLD" into the end word "WARM" by changing one letter at a time.'
    },
    {
      chain: ['COLD', '', '', '', 'WARM'],
      currentIndex: 1,
      message: 'Let\'s start by changing "COLD" to "CORD" - replacing L with R.'
    },
    {
      chain: ['COLD', 'CORD', '', '', 'WARM'],
      currentIndex: 2,
      message: 'Next, let\'s change "CORD" to "CARD" - replacing O with A.'
    },
    {
      chain: ['COLD', 'CORD', 'CARD', '', 'WARM'],
      currentIndex: 3,
      message: 'Now, let\'s change "CARD" to "WARD" - replacing C with W.'
    },
    {
      chain: ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'],
      currentIndex: -1,
      message: 'Finally, we change "WARD" to "WARM" - replacing D with M. Chain complete!'
    }
  ];
  
  // Auto advance through demo
  useEffect(() => {
    if (!autoplayEnabled || isTyping) return;
    
    const timer = setTimeout(() => {
      if (step < demoSteps.length - 1) {
        setStep(step + 1);
      } else {
        // Restart demo after a longer pause
        setTimeout(() => setStep(0), 3000);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [step, autoplayEnabled, isTyping]);
  
  // Handle typing animation
  useEffect(() => {
    const currentStep = demoSteps[step];
    if (currentStep.currentIndex === -1 || !autoplayEnabled) return;
    
    const targetWord = solution[currentStep.currentIndex];
    if (!targetWord) return;
    
    setIsTyping(true);
    setTypedWord('');
    
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < targetWord.length) {
        setTypedWord(targetWord.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsTyping(false);
        }, 500);
      }
    }, 150);
    
    return () => clearInterval(typingInterval);
  }, [step, autoplayEnabled]);
  
  const handleTryDemo = () => {
    setAutoplayEnabled(false);
    setStep(0);
  };
  
  const currentStep = demoSteps[step];
  
  return (
    <section className="py-12 bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Word Chain Demo</h3>
            {autoplayEnabled ? (
              <button 
                onClick={handleTryDemo}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try It Yourself
              </button>
            ) : (
              <button 
                onClick={() => setAutoplayEnabled(true)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Watch Demo
              </button>
            )}
          </div>
          
          {/* Chain visualization */}
          <div className="flex justify-center items-center space-x-3 mb-8">
            {currentStep.chain.map((word, index) => (
              <React.Fragment key={index}>
                <div 
                  className={`w-16 h-16 flex items-center justify-center rounded-lg font-bold text-lg
                    ${index === 0 ? 'bg-green-100 text-green-800' : 
                    index === currentStep.chain.length - 1 ? 'bg-red-100 text-red-800' : 
                    word ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {index === currentStep.currentIndex && isTyping ? typedWord || '_' : word || '?'}
                </div>
                {index < currentStep.chain.length - 1 && (
                  <div className="text-gray-400">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Instruction message */}
          <div className="text-center mb-6 h-12">
            <p className="text-md text-gray-700">{currentStep.message}</p>
          </div>
          
          {/* Interactive input */}
          {!autoplayEnabled && currentStep.currentIndex !== -1 && (
            <div className="flex justify-center mt-4">
              <form 
                className="flex items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const inputEl = e.currentTarget.elements.namedItem('wordInput') as HTMLInputElement;
                  const value = inputEl.value.toUpperCase();
                  
                  if (value === solution[currentStep.currentIndex]) {
                    const newChain = [...currentStep.chain];
                    newChain[currentStep.currentIndex] = value;
                    
                    if (step < demoSteps.length - 1) {
                      setStep(step + 1);
                    }
                    
                    inputEl.value = '';
                  }
                }}
              >
                <input
                  type="text"
                  name="wordInput"
                  maxLength={4}
                  placeholder={`Enter the next word`}
                  className="px-3 py-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try
                </button>
              </form>
            </div>
          )}
          
          {/* Hint */}
          {!autoplayEnabled && currentStep.currentIndex !== -1 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  const hint = solution[currentStep.currentIndex - 1];
                  const target = solution[currentStep.currentIndex];
                  let diffIndex = -1;
                  
                  for (let i = 0; i < hint.length; i++) {
                    if (hint[i] !== target[i]) {
                      diffIndex = i;
                      break;
                    }
                  }
                  
                  alert(`Hint: Change the letter "${hint[diffIndex]}" to create a new valid word.`);
                }}
                className="text-blue-500 underline"
              >
                Need a hint?
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Ready to challenge yourself with word chains?</p>
          <a 
            href="/signup" 
            className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
          >
            Play Now
          </a>
        </div>
      </div>
    </section>
  );
} 