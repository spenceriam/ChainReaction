'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

// Auth hook for React components to access authentication state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current user on mount
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign out function
  const signOut = async () => {
    return supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signOut
  }
}