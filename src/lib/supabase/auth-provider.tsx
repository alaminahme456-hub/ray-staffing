'use client'

/**
 * Auth provider — passthrough wrapper.
 * Authentication is now handled via /api/auth/* routes.
 */
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
