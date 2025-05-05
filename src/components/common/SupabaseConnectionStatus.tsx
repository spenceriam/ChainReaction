'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'

interface ConnectionStatusProps {
  onlyShowErrors?: boolean
}

export function SupabaseConnectionStatus({ onlyShowErrors = true }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState({
    urlConfigured: false,
    keyConfigured: false
  })

  useEffect(() => {
    // Check if environment variables are configured
    const url = process.env.APP_SUPABASE_URL
    const key = process.env.APP_SUPABASE_ANON_KEY
    
    setEnvVars({
      urlConfigured: !!url,
      keyConfigured: !!key
    })

    // Try a simple Supabase query to check connection
    async function checkConnection() {
      try {
        // Simple health check query
        const { error } = await supabase.from('words').select('word').limit(1)
        
        if (error) {
          setStatus('error')
          setErrorDetails(error.message)
          console.error('Supabase connection error:', error)
        } else {
          setStatus('connected')
          console.log('Successfully connected to Supabase')
        }
      } catch (err) {
        setStatus('error')
        setErrorDetails(err instanceof Error ? err.message : 'Unknown error')
        console.error('Supabase connection exception:', err)
      }
    }

    checkConnection()
  }, [])

  // If only showing errors and we're connected, return null
  if (onlyShowErrors && status === 'connected') {
    return null
  }

  return (
    <div className={`p-4 rounded-md ${status === 'connected' ? 'bg-green-50 border border-green-200' : 
      status === 'error' ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'}`}>
      <h3 className="font-medium mb-2">Supabase Connection Status</h3>
      
      <div className="text-sm mb-2">
        <div>Environment Variables:</div>
        <div className={`ml-2 ${envVars.urlConfigured ? 'text-green-600' : 'text-red-600'}`}>
          APP_SUPABASE_URL: {envVars.urlConfigured ? 'Configured ✓' : 'Missing ✕'}
        </div>
        <div className={`ml-2 ${envVars.keyConfigured ? 'text-green-600' : 'text-red-600'}`}>
          APP_SUPABASE_ANON_KEY: {envVars.keyConfigured ? 'Configured ✓' : 'Missing ✕'}
        </div>
      </div>
      
      <div className="text-sm">
        <div>Connection Status: 
          <span className={`font-medium ml-1 ${
            status === 'connected' ? 'text-green-600' : 
            status === 'error' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {status === 'connected' ? 'Connected ✓' : 
             status === 'error' ? 'Error ✕' : 'Checking...'}
          </span>
        </div>
        
        {status === 'error' && errorDetails && (
          <div className="mt-1 text-red-600">
            Error: {errorDetails}
          </div>
        )}
      </div>
      
      {status === 'error' && (
        <div className="mt-3 text-xs text-gray-600">
          Please check your .env file and ensure APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY are configured correctly.
        </div>
      )}
    </div>
  )
} 