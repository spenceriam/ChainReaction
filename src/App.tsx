import React from 'react';
import './App.css';
import { AuthProvider } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { WordChain } from './components/game/WordChain';

function App() {
  return (
    <AuthProvider>
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
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Try the Demo:</h2>
          <WordChain startWord="CAT" endWord="DOG" chainLength={4} />
        </div>
      </Layout>
    </AuthProvider>
  );
}

export default App;
