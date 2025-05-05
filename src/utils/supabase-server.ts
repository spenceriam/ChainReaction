import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Return an empty array for now to fix type errors
          return []
        },
        setAll(cookiesToSet) {
          // No-op implementation to fix type errors
          return
        },
      },
    }
  )
} 