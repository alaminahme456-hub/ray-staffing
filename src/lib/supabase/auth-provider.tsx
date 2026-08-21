'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/store/app-store'
import type { User } from '@supabase/supabase-js'

/**
 * Resolves the user's role from their Supabase user metadata or profiles table.
 * Falls back to 'candidate' if no role is found.
 */
async function resolveUserRole(supabase: ReturnType<typeof createClient>, user: User): Promise<string> {
  // First check user_metadata (set during signup)
  const metaRole = user.user_metadata?.role
  if (metaRole) return metaRole

  // Then check profiles table
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role || 'candidate'
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout } = useAppStore()
  const supabaseRef = useRef(createClient())
  const initializing = useRef(true)

  useEffect(() => {
    const supabase = supabaseRef.current

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await resolveUserRole(supabase, session.user)
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
          role,
        })
      }
      initializing.current = false
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const role = await resolveUserRole(supabase, session.user)
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || '',
          role,
        })
      } else if (event === 'SIGNED_OUT') {
        logout()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, logout])

  return <>{children}</>
}
