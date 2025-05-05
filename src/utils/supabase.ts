import { createClient } from '@supabase/supabase-js';

/**
 * Environment variables for Supabase connection
 * These must be set in .env file in the root of the project:
 * REACT_APP_SUPABASE_URL=your-supabase-url
 * REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Validate environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
    Missing Supabase environment variables. 
    Please create a .env file in the root directory with:
    
    REACT_APP_SUPABASE_URL=your-supabase-project-url
    REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
    
    See environment-setup.md for more details.
  `;
  console.error(errorMessage);
  throw new Error('Supabase environment variables are required');
}

// Configuration options with security best practices
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Set global headers if needed
  global: {
    headers: {
      'x-application-name': 'ChainReaction'
    }
  }
};

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// Helper to check if a user is authenticated (can be used as a guard)
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getUser();
  return !!data.user;
};

// Helper to get the current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
}; 