import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface AutoDemoProps {
  demoSpeed?: number; // Speed of the demo in ms (default 1500ms)
}

export function AutoDemo({ demoSpeed = 1500 }: AutoDemoProps) {
  // Define the demo word chain with useMemo to prevent recreation on each render
  const startWord = "COLD";
  const endWord = "WARM";
  const solutionChain = useMemo(() => ["COLD", "CORD", "CARD", "WARD", "WARM"], []);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showingChain, setShowingChain] = useState<string[]>(["COLD", "", "", "", "WARM"]);
  const [thinking, setThinking] = useState(false);
  const [message, setMessage] = useState("Watch as the computer solves this word chain...");
  
  // Reset and restart the demo
  const resetDemo = useCallback(() => {
    setCurrentStep(0);
    setShowingChain(["COLD", "", "", "", "WARM"]);
    setThinking(false);
    setMessage("Watch as the computer solves this word chain...");
  }, []);
  
  // Handle step updates
  const moveToNextStep = useCallback(() => {
    setCurrentStep(prevStep => prevStep + 1);
  }, []);
  
  // Update chain with current word
  const updateChain = useCallback((step: number) => {
    setShowingChain(prev => {
      const newChain = [...prev];
      if (step >= 1 && step < 4) {
        newChain[step] = solutionChain[step];
      }
      return newChain;
    });
  }, [solutionChain]);
  
  // Simulate the computer thinking and completing the chain
  useEffect(() => {
    let thinkingTimer: NodeJS.Timeout | undefined;
    let nextStepTimer: NodeJS.Timeout | undefined;
    
    if (currentStep >= 1 && currentStep < 4) {
      // First show "thinking" state
      setThinking(true);
      
      // After a delay, update the chain with the next word
      thinkingTimer = setTimeout(() => {
        setThinking(false);
        updateChain(currentStep);
        
        // Update message based on the current step
        if (currentStep === 1) {
          setMessage("Changed C→R: We changed 'COLD' to 'CORD' by replacing one letter.");
        } else if (currentStep === 2) {
          setMessage("Changed O→A: 'CORD' becomes 'CARD' by changing one more letter.");
        } else if (currentStep === 3) {
          setMessage("Changed C→W: 'CARD' becomes 'WARD', getting closer to our target.");
        }
      }, demoSpeed / 2);
      
      // After another delay, move to the next step
      nextStepTimer = setTimeout(() => {
        moveToNextStep();
      }, demoSpeed);
      
    } else if (currentStep === 4) {
      // Show completion message
      setMessage("Chain complete! We've transformed 'COLD' to 'WARM' one letter at a time.");
      
      // Automatically restart after 5 seconds
      nextStepTimer = setTimeout(() => {
        resetDemo();
      }, 5000);
      
    } else if (currentStep === 0) {
      // Start the demo after a short delay
      nextStepTimer = setTimeout(() => {
        moveToNextStep();
        setMessage("Finding the first word in our chain...");
      }, demoSpeed / 2);
    }
    
    return () => {
      if (thinkingTimer) clearTimeout(thinkingTimer);
      if (nextStepTimer) clearTimeout(nextStepTimer);
    };
  }, [currentStep, demoSpeed, resetDemo, moveToNextStep, updateChain]);
  
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">How to Play Word Chain</h2>
      <p className="mb-4 text-gray-700">
        Transform the start word to the end word by changing just one letter at a time.
        Each intermediate word must be a valid dictionary word.
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-green-700 font-bold">Start: {startWord}</div>
        <div className="text-red-700 font-bold">End: {endWord}</div>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        {showingChain.map((word, index) => (
          <div 
            key={index} 
            className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-lg
              ${index === 0 ? 'bg-green-100 border-green-400 border-2' : 
                index === 4 ? 'bg-red-100 border-red-400 border-2' : 
                word ? 'bg-blue-100 border-blue-400 border-2' : 
                thinking && index === currentStep ? 'bg-yellow-100 border-yellow-400 border-2 animate-pulse' : 
                'bg-gray-100 border-gray-300 border'}`}
          >
            {word || (thinking && index === currentStep ? "..." : "?")}
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg mb-4">
        <p className="text-gray-800">{message}</p>
        <p className="text-gray-500 text-sm mt-2">
          {currentStep === 4 ? "Demo will restart in a few seconds..." : ""}
        </p>
      </div>
    </div>
  );
} 