/**
 * Server-side Neon Auth helper.
 * Reads session from request cookies by calling Neon Auth REST API.
 */

import { cookies } from 'next/headers'

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || ''

export interface NeonServerUser {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
}

export interface NeonServerSession {
  id: string
  token: string
  expiresAt: string
  userId: string
}

interface SessionResult {
  session: NeonServerSession | null
  user: NeonServerUser | null
}

/** Get current Neon Auth session from incoming request cookies */
export async function getNeonSession(): Promise<SessionResult> {
  if (!NEON_AUTH_URL) {
    return { session: null, user: null }
  }

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  try {
    const origin = new URL(NEON_AUTH_URL).origin
    const res = await fetch(`${NEON_AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json',
        Origin: origin,
      },
      cache: 'no-store',
    })
    if (!res.ok) return { session: null, user: null }
    return await res.json()
  } catch (error) {
    console.error('[Neon Auth] get-session error:', error)
    return { session: null, user: null }
  }
}

/** Require authentication — throws if no valid session */
export async function requireNeonAuth() {
  const { session, user } = await getNeonSession()
  if (!session || !user) throw new Error('Unauthorized')
  return { session, user }
}
