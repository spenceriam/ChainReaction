import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

// This is a simpler test component that just logs connection status to the console
export function SimpleConnectionTest() {
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [dbStatus, setDbStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      console.log('==== Supabase Connection Test ====');
      console.log('URL:', process.env.REACT_APP_SUPABASE_URL || '[not available]');
      
      try {
        // Test auth connection
        console.log('Testing authentication service...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error connecting to Supabase Auth:', error.message);
          setAuthStatus('error');
          setErrorMessage(error.message);
        } else {
          console.log('✅ Successfully connected to Supabase Auth');
          console.log('Current session:', data.session ? 'Active' : 'None (anonymous)');
          setAuthStatus('success');
        }
        
        // Try to get database schema info - more reliable than querying specific tables
        console.log('Testing database access...');
        
        // First try simply checking if we can reach the API
        try {
          const { data: metaData, error: metaError } = await supabase
            .rpc('get_schema_version');
            
          if (metaError) {
            // If the function doesn't exist, that's expected
            console.log('RPC method not available, trying general API access...');
            
            // Try a simple query to check if we can access the database at all
            const { error: tableError } = await supabase
              .from('profiles')
              .select('count')
              .limit(1)
              .single();
            
            if (tableError && tableError.code === 'PGRST116') {
              // Table doesn't exist, but API is reachable
              console.log('✅ Connected to Supabase API (profiles table not found, but API is reachable)');
              setDbStatus('success');
            } else if (tableError) {
              // Some other error occurred
              console.error('❌ Error querying database:', tableError.message);
              setDbStatus('error');
              setErrorMessage(tableError.message);
            } else {
              // Query succeeded
              console.log('✅ Successfully queried profiles table');
              setDbStatus('success');
            }
          } else {
            console.log('✅ Successfully called Supabase RPC function');
            setDbStatus('success');
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.error('❌ General database access error:', errorMsg);
          setDbStatus('error');
          setErrorMessage(errorMsg);
        }
        
        console.log('==== Connection Test Complete ====');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Unexpected error during connection test:', errorMsg);
        setAuthStatus('error');
        setDbStatus('error');
        setErrorMessage(errorMsg);
      }
    };
    
    checkConnection();
  }, []);
  
  return (
    <div className="p-4 bg-gray-50 rounded-lg mb-6">
      <h2 className="text-lg font-semibold">Supabase Connection Test</h2>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-center">
          <span className="w-32">Auth Service:</span>
          {authStatus === 'loading' && <span className="text-blue-500">Testing...</span>}
          {authStatus === 'success' && <span className="text-green-500">Connected ✓</span>}
          {authStatus === 'error' && <span className="text-red-500">Failed ✗</span>}
        </div>
        
        <div className="flex items-center">
          <span className="w-32">Database:</span>
          {dbStatus === 'loading' && <span className="text-blue-500">Testing...</span>}
          {dbStatus === 'success' && <span className="text-green-500">Connected ✓</span>}
          {dbStatus === 'error' && <span className="text-red-500">Failed ✗</span>}
        </div>
        
        {errorMessage && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {errorMessage}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mt-4">
        Check your browser console for detailed connection test results.
      </p>
    </div>
  );
} 