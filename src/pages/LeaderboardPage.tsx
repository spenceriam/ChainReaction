import React, { useState } from 'react';
import { Leaderboard } from '../components/game/Leaderboard';

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'timed' | 'endless'>('daily');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboards</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('daily')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'daily'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Daily Challenge
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'weekly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Weekly Rankings
            </button>
            <button
              onClick={() => setActiveTab('timed')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'timed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timed Mode
            </button>
            <button
              onClick={() => setActiveTab('endless')}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === 'endless'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Endless Mode
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'daily' && (
        <div>
          <Leaderboard type="daily" limit={20} />
          <p className="mt-4 text-sm text-gray-500">
            Rankings for today's daily challenge. New challenge available every day at midnight!
          </p>
        </div>
      )}
      
      {activeTab === 'weekly' && (
        <div>
          <Leaderboard type="weekly" limit={20} />
          <p className="mt-4 text-sm text-gray-500">
            Rankings based on total points earned from daily challenges this week.
          </p>
        </div>
      )}
      
      {activeTab === 'timed' && (
        <div>
          <Leaderboard type="timed" limit={20} />
          <p className="mt-4 text-sm text-gray-500">
            Rankings based on highest scores in Timed Mode. Complete more chains before time runs out!
          </p>
        </div>
      )}
      
      {activeTab === 'endless' && (
        <div>
          <Leaderboard type="endless" limit={20} />
          <p className="mt-4 text-sm text-gray-500">
            Rankings based on highest scores in Endless Mode. How many chains can you complete?
          </p>
        </div>
      )}
    </div>
  );
} 