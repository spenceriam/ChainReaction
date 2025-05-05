import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { OverlayNavigation } from './components/layout/OverlayNavigation';
import { SimpleWordChain } from './components/game/SimpleWordChain';
import { SimpleConnectionTest } from './components/common/SimpleConnectionTest';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TimedModePage } from './pages/TimedModePage';
import { EndlessModePage } from './pages/EndlessModePage';

// Dark mode setting
const DARK_MODE = true;

function Home() {
  return (
    <div className="flex flex-col items-center p-4 pt-8">
      <div className={`w-full max-w-md ${DARK_MODE ? 'bg-gray-800 shadow-lg' : 'bg-white shadow'} rounded-lg p-6 mb-20`}>
        <h1 className={`text-2xl font-bold text-center ${DARK_MODE ? 'text-blue-300' : 'text-gray-900'} mb-6`}>
          ChainReaction
        </h1>
        
        {/* Main game area using SimpleWordChain with dark mode */}
        <SimpleWordChain 
          startWord="CAT" 
          endWord="DOG" 
          chainLength={4}
          darkMode={DARK_MODE}
          onComplete={(attempts, time) => {
            console.log(`Completed in ${attempts} attempts and ${time} seconds`);
          }}
        />
        
        {/* Connection test only shown on failure */}
        <div className="mt-8">
          <SimpleConnectionTest />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className={`App ${DARK_MODE ? 'bg-gray-900' : 'bg-gray-100'} min-h-screen`}>
      <Router>
        <OverlayNavigation darkMode={DARK_MODE}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily-challenge" element={<DailyChallengePage />} />
            <Route path="/timed-mode" element={<TimedModePage />} />
            <Route path="/endless-mode" element={<EndlessModePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </OverlayNavigation>
      </Router>
    </div>
  );
}

export default App;
