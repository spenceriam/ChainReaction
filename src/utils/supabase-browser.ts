import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY.');
  }
  
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}
