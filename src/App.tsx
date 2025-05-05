import React from 'react';
import './App.css';
import { Layout } from './components/layout/Layout';
import { WordChain } from './components/game/WordChain';
import { SimpleConnectionTest } from './components/common/SimpleConnectionTest';

function App() {
  return (
    <div className="App">
      <Layout>
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
        </div>
        
        {/* Supabase Connection Test - Check console for results */}
        <SimpleConnectionTest />
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Try the Demo:</h2>
          <WordChain startWord="CHAIN" endWord="REACT" chainLength={5} />
        </div>
      </Layout>
    </div>
  );
}

export default App;
