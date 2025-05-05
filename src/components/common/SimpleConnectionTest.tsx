import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase-browser';

// This is a simpler test component that just logs connection status to the console
export function SimpleConnectionTest() {
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('words').select('word').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionFailed(true);
          setErrorMessage(error.message);
        }
      } catch (err) {
        console.error('Supabase connection exception:', err);
        setConnectionFailed(true);
        setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkConnection();
  }, []);

  // Only render something if the connection failed
  if (!connectionFailed) {
    return null;
  }

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
      <div className="font-bold">Database Connection Error</div>
      <div className="text-xs mt-1">{errorMessage}</div>
    </div>
  );
} 