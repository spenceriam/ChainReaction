import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createClient = cache(() => {
  // Get the cookies from the request
  const cookieStore = cookies()
  
  const supabaseUrl = process.env.APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.APP_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please set APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY.');
  }
  
  return createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          // Convert Next.js cookies to the format expected by Supabase
          return Array.from(cookieStore.getAll()).map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesToSet) {
          try {
            // Set cookies in the browser
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({
                name,
                value,
                ...options,
              })
            })
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}) 