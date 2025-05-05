'use client'

import React, { useState } from 'react';

export default function DemoSection() {
  const [count, setCount] = useState(0);
  
  return (
    <section className="py-8 bg-blue-50 w-full rounded-lg my-6">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Simple Demo Section</h2>
        <p className="mb-4">This is a simplified demo section to test client component rendering.</p>
        
        <div className="p-4 bg-white rounded-lg shadow-md inline-block">
          <p className="text-lg mb-4">Counter: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment
          </button>
        </div>
      </div>
    </section>
  );
} 