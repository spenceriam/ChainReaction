'use client'

import React, { useState } from 'react'
import { SupabaseConnectionStatus } from '../../components/common/SupabaseConnectionStatus'
import { supabase } from '../../utils/supabase'

export default function ConnectionTestPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Run a simple query to test Supabase connection
  const runTest = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Test basic table query
      const wordResult = await supabase.from('words').select('word').limit(3)
      
      // Test auth connection
      const authResult = await supabase.auth.getSession()
      
      setTestResults({
        wordQuery: {
          success: !wordResult.error,
          data: wordResult.data,
          error: wordResult.error
        },
        authQuery: {
          success: !authResult.error,
          session: authResult.data.session ? 'Active' : 'None',
          error: authResult.error
        },
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="mb-8">
        <SupabaseConnectionStatus onlyShowErrors={false} />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Run Manual Tests</h2>
        <button
          onClick={runTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Running Tests...' : 'Run Connection Tests'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-800">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {testResults && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-bold mb-3">Test Results</h3>
          <p className="text-sm text-gray-500 mb-4">Timestamp: {testResults.timestamp}</p>
          
          <div className="grid gap-4">
            <div className="p-3 bg-white border rounded-md">
              <h4 className="font-medium">Database Query Test</h4>
              <div className={`text-sm font-medium ${testResults.wordQuery.success ? 'text-green-600' : 'text-red-600'}`}>
                Status: {testResults.wordQuery.success ? 'Success ✓' : 'Failed ✕'}
              </div>
              
              {testResults.wordQuery.error && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {testResults.wordQuery.error.message}
                </div>
              )}
              
              {testResults.wordQuery.data && (
                <div className="mt-2 text-sm">
                  <div className="font-medium">Sample Data:</div>
                  <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto">
                    {JSON.stringify(testResults.wordQuery.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white border rounded-md">
              <h4 className="font-medium">Auth Service Test</h4>
              <div className={`text-sm font-medium ${testResults.authQuery.success ? 'text-green-600' : 'text-red-600'}`}>
                Status: {testResults.authQuery.success ? 'Success ✓' : 'Failed ✕'}
              </div>
              
              <div className="mt-1 text-sm">
                Session: {testResults.authQuery.session}
              </div>
              
              {testResults.authQuery.error && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {testResults.authQuery.error.message}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <h4 className="font-medium">What does this mean?</h4>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>
                <strong>Database Query Test:</strong> Tests if your app can connect to Supabase's database service and query data.
              </li>
              <li>
                <strong>Auth Service Test:</strong> Tests if your app can connect to Supabase's authentication service.
              </li>
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc ml-5 space-y-2 text-sm">
          <li>Verify APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY are set in your .env file</li>
          <li>Check that these values match those in your Supabase dashboard</li>
          <li>Ensure the "words" table exists in your Supabase project</li>
          <li>Check for any network-related issues (CORS, etc.)</li>
          <li>Verify your Supabase instance is active and running</li>
        </ul>
      </div>
    </div>
  )
} 