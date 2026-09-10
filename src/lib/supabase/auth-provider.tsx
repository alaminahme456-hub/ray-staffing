'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { neonGetAppUser } from '@/lib/auth/neon-auth'

/**
 * Auth provider — checks Neon Auth session on mount and sets user in Zustand.
 */
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let cancelled = false
    neonGetAppUser().then((appUser) => {
      if (cancelled) return
      if (appUser) {
        setUser({ id: appUser.id, email: appUser.email, name: appUser.name, role: appUser.role })
      }
      setChecked(true)
    }).catch(() => { if (!cancelled) setChecked(true) })
    return () => { cancelled = true }
  }, [setUser])

  return <>{children}</>
}
