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
import { AutoDemo } from './components/demo/AutoDemo';

function Home() {
  return (
    <div className="flex flex-col items-center p-4 pt-6">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6 mb-20">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">ChainReaction</h1>
        
        {/* Main game area using SimpleWordChain */}
        <SimpleWordChain 
          startWord="CAT" 
          endWord="DOG" 
          chainLength={4} 
          onComplete={(attempts, time) => {
            console.log(`Completed in ${attempts} attempts and ${time} seconds`);
          }}
        />
        
        {/* Connection test hidden at bottom */}
        <div className="mt-8 opacity-30 hover:opacity-100 transition-opacity text-xs">
          <SimpleConnectionTest />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen">
      <Router>
        <OverlayNavigation>
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
