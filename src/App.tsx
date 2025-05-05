import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Layout } from './components/layout/Layout';
import { WordChain } from './components/game/WordChain';
import { SimpleConnectionTest } from './components/common/SimpleConnectionTest';
import { DailyChallengePage } from './pages/DailyChallengePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TimedModePage } from './pages/TimedModePage';

function Home() {
  return (
    <div>
      <div className="p-4 bg-white shadow rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to ChainReaction</h1>
        <p className="mt-2 text-gray-600">
          The word puzzle game where you must complete chains by finding connecting words.
        </p>
        <div className="mt-4">
          <p className="text-gray-700">
            Start from one word and reach the target word by changing just one letter at a time.
            Each intermediate word must be a valid dictionary word.
          </p>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link 
            to="/daily-challenge" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
          >
            Play Daily Challenge
          </Link>
          <Link 
            to="/timed-mode" 
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
          >
            Try Timed Mode
          </Link>
          <Link 
            to="/leaderboard" 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
          >
            View Leaderboards
          </Link>
        </div>
      </div>
      
      {/* Supabase Connection Test - Check console for results */}
      <SimpleConnectionTest />
      
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Try the Demo:</h2>
        <WordChain startWord="CHAIN" endWord="REACT" chainLength={5} />
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/daily-challenge" element={<DailyChallengePage />} />
            <Route path="/timed-mode" element={<TimedModePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
