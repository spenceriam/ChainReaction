import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Define the overlay panel types
type OverlayType = 'howToPlay' | 'gameModes' | 'profile' | 'leaderboard' | null;

interface OverlayNavigationProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export function OverlayNavigation({ children, darkMode = true }: OverlayNavigationProps) {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
  const navigate = useNavigate();

  const openOverlay = (type: OverlayType) => {
    setActiveOverlay(type);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  // Handle navigation to different game modes
  const navigateToGameMode = (path: string) => {
    navigate(path);
    closeOverlay();
  };

  // Dark mode theme classes
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    navBackground: darkMode ? 'bg-gray-800' : 'bg-white',
    navText: darkMode ? 'text-gray-200' : 'text-gray-600',
    navActiveText: darkMode ? 'text-blue-400' : 'text-blue-600',
    overlayBg: darkMode ? 'bg-gray-800' : 'bg-white',
    overlayText: darkMode ? 'text-gray-100' : 'text-gray-800',
    overlayBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
  };

  return (
    <div className={`relative min-h-screen ${themeClasses.background}`}>
      {/* Main content */}
      <div className="relative z-0 pb-20">
        {children}
      </div>

      {/* Floating bottom navigation bar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className={`flex justify-around items-center p-3 ${themeClasses.navBackground} rounded-full shadow-lg`}>
          <button
            onClick={() => openOverlay('howToPlay')}
            className={`flex flex-col items-center mx-3 ${themeClasses.navText} hover:${themeClasses.navActiveText}`}
            aria-label="How to Play"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => openOverlay('gameModes')}
            className={`flex flex-col items-center mx-3 ${themeClasses.navText} hover:${themeClasses.navActiveText}`}
            aria-label="Game Modes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => openOverlay('profile')}
            className={`flex flex-col items-center mx-3 ${themeClasses.navText} hover:${themeClasses.navActiveText}`}
            aria-label="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          <button
            onClick={() => openOverlay('leaderboard')}
            className={`flex flex-col items-center mx-3 ${themeClasses.navText} hover:${themeClasses.navActiveText}`}
            aria-label="Leaderboard"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay panels */}
      {activeOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-20 flex justify-center items-start pt-4 sm:pt-12 backdrop-blur-sm">
          <div className={`${themeClasses.overlayBg} rounded-lg shadow-xl max-w-md w-11/12 mx-auto overflow-hidden max-h-[90vh] flex flex-col border ${themeClasses.overlayBorder}`}>
            {/* Overlay header */}
            <div className={`flex justify-between items-center p-4 border-b ${themeClasses.overlayBorder}`}>
              <h2 className={`text-xl font-bold ${themeClasses.overlayText}`}>
                {activeOverlay === 'howToPlay' && 'How to Play'}
                {activeOverlay === 'gameModes' && 'Game Modes'}
                {activeOverlay === 'profile' && 'Your Profile'}
                {activeOverlay === 'leaderboard' && 'Leaderboards'}
              </h2>
              <button
                onClick={closeOverlay}
                className={`${themeClasses.navText} hover:${themeClasses.navActiveText}`}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Overlay content */}
            <div className={`overflow-y-auto p-4 flex-grow ${themeClasses.overlayText}`}>
              {activeOverlay === 'howToPlay' && (
                <div className="space-y-4">
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    ChainReaction is a word puzzle game where you complete word chains by finding the connecting words between a start and end word.
                  </p>
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
                    <h3 className="font-bold text-lg mb-2">Game Rules:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>You are given a start word and an end word</li>
                      <li>Find the connecting words that form a valid chain</li>
                      <li>Each word in the chain must differ from adjacent words by changing exactly one letter</li>
                      <li>All words must be valid dictionary words</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-lg mb-2">Example:</h3>
                    <div className="flex flex-col space-y-2">
                      <div className={`bg-green-${darkMode ? "700" : "100"} p-2 rounded text-center font-medium ${darkMode ? "text-green-100" : "text-green-800"}`}>CAT</div>
                      <div className={`bg-blue-${darkMode ? "700" : "100"} p-2 rounded text-center font-medium ${darkMode ? "text-blue-100" : "text-blue-800"}`}>COT</div>
                      <div className={`bg-blue-${darkMode ? "700" : "100"} p-2 rounded text-center font-medium ${darkMode ? "text-blue-100" : "text-blue-800"}`}>COG</div>
                      <div className={`bg-red-${darkMode ? "700" : "100"} p-2 rounded text-center font-medium ${darkMode ? "text-red-100" : "text-red-800"}`}>DOG</div>
                    </div>
                    <p className={`mt-2 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Each word changes by exactly one letter from the previous word.
                    </p>
                  </div>
                </div>
              )}
              
              {activeOverlay === 'gameModes' && (
                <div className="space-y-4">
                  <button
                    onClick={() => navigateToGameMode('/daily-challenge')}
                    className={`w-full text-left p-4 ${darkMode ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-50 hover:bg-blue-100"} rounded-lg flex justify-between items-center`}
                  >
                    <div>
                      <h3 className={`font-bold text-lg ${darkMode ? "text-blue-100" : "text-blue-700"}`}>Daily Challenge</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>A new puzzle every day. Compete with others globally.</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? "text-blue-300" : "text-blue-700"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigateToGameMode('/timed-mode')}
                    className={`w-full text-left p-4 ${darkMode ? "bg-purple-900 hover:bg-purple-800" : "bg-purple-50 hover:bg-purple-100"} rounded-lg flex justify-between items-center`}
                  >
                    <div>
                      <h3 className={`font-bold text-lg ${darkMode ? "text-purple-100" : "text-purple-700"}`}>Timed Mode</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Race against the clock. Solve puzzles before time runs out.</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? "text-purple-300" : "text-purple-700"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigateToGameMode('/endless-mode')}
                    className={`w-full text-left p-4 ${darkMode ? "bg-indigo-900 hover:bg-indigo-800" : "bg-indigo-50 hover:bg-indigo-100"} rounded-lg flex justify-between items-center`}
                  >
                    <div>
                      <h3 className={`font-bold text-lg ${darkMode ? "text-indigo-100" : "text-indigo-700"}`}>Endless Mode</h3>
                      <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Solve as many chains as you can. How far can you go?</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {activeOverlay === 'profile' && (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className={`inline-block p-2 rounded-full ${darkMode ? "bg-blue-900" : "bg-blue-100"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 ${darkMode ? "text-blue-100" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 font-bold text-xl">Guest User</h3>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Sign in to save your progress</p>
                  </div>
                  
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4`}>
                    <h4 className="font-bold text-lg mb-3">Your Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded shadow-sm`}>
                        <div className={`text-2xl font-bold ${darkMode ? "text-blue-300" : "text-blue-600"}`}>0</div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Puzzles Solved</div>
                      </div>
                      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded shadow-sm`}>
                        <div className={`text-2xl font-bold ${darkMode ? "text-green-300" : "text-green-600"}`}>0</div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Daily Streak</div>
                      </div>
                      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded shadow-sm`}>
                        <div className={`text-2xl font-bold ${darkMode ? "text-purple-300" : "text-purple-600"}`}>0</div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Best Time</div>
                      </div>
                      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-3 rounded shadow-sm`}>
                        <div className={`text-2xl font-bold ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>0</div>
                        <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>High Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className={`w-full py-3 ${darkMode ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg font-medium`}>
                    Sign In / Create Account
                  </button>
                </div>
              )}
              
              {activeOverlay === 'leaderboard' && (
                <div className="space-y-4">
                  <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} rounded-lg p-4`}>
                    <h3 className="font-bold text-lg mb-3">Today's Challenge Leaders</h3>
                    <div className="divide-y divide-gray-700">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="py-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 text-center font-bold">{i + 1}</div>
                            <div className="ml-2">Player{i + 1}</div>
                          </div>
                          <div className="font-medium">{(300 - i * 40)}s</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className={`flex-1 py-2 ${darkMode ? "bg-blue-800 text-blue-100" : "bg-blue-100 text-blue-800"} rounded-lg font-medium`}>Daily</button>
                    <button className={`flex-1 py-2 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"} rounded-lg font-medium`}>Weekly</button>
                    <button className={`flex-1 py-2 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"} rounded-lg font-medium`}>All Time</button>
                  </div>
                  
                  <button
                    onClick={() => navigateToGameMode('/leaderboard')}
                    className={`w-full py-2 mt-2 border ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"} rounded-lg font-medium`}
                  >
                    View Full Leaderboards
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 