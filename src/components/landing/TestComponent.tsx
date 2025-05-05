'use client'

import React, { useState, useEffect } from 'react';

export default function TestComponent() {
  const [mounted, setMounted] = useState(false);
  
  // This will only run in the browser
  useEffect(() => {
    setMounted(true);
    console.log('TestComponent mounted on client');
    
    // This would error if rendered on server
    if (typeof window !== 'undefined') {
      console.log('Window object available:', window.innerWidth);
    }
  }, []);
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-500 rounded-lg mb-4 text-center">
      <p className="text-yellow-800">
        {mounted 
          ? `This is a client component (window width: ${typeof window !== 'undefined' ? window.innerWidth : 'unknown'}px)`
          : 'Component not mounted yet (server rendering)'}
      </p>
    </div>
  );
} 