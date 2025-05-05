import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.APP_SUPABASE_URL!,
    process.env.APP_SUPABASE_ANON_KEY!
  )
}
