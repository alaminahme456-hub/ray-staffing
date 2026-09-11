/**
 * Client-side Neon Auth utilities.
 * All calls go through our /api/auth/* proxy.
 */

const AUTH_BASE = '/api/auth'

export interface AppUser {
  id: string
  email: string
  name: string
  role: string
  neonAuthId: string
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    if (typeof d.message === 'string' && d.message) return d.message
    if (typeof d.error === 'string' && d.error) return d.error
    if (
      typeof d.error === 'object' &&
      d.error !== null &&
      'message' in d.error &&
      typeof (d.error as Record<string, unknown>).message === 'string'
    ) {
      return (d.error as Record<string, unknown>).message as string
    }
  }
  return fallback
}

/** Sign up via Neon Auth, then link to Prisma User */
export async function neonSignUp(params: {
  email: string
  password: string
  name: string
  phone?: string
  role?: string
  companyName?: string
}): Promise<{ user: AppUser }> {
  const res = await fetch(`${AUTH_BASE}/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      email: params.email.toLowerCase().trim(),
      password: params.password,
      name: params.name,
    }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.user) {
    const msg = extractErrorMessage(data, 'Failed to create account. Please try again.')
    throw new Error(
      msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exist')
        ? 'An account with this email already exists. Please sign in.'
        : msg,
    )
  }
  // data = { token, user: { id, email, name, ... } }
  const neonUser = data.user

  // Link to Prisma
  try {
    const linkRes = await fetch(`${AUTH_BASE}/link-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        neonUserId: neonUser.id,
        email: neonUser.email,
        name: params.name,
        phone: params.phone,
        role: params.role || 'candidate',
        companyName: params.companyName,
      }),
    })
    if (linkRes.ok) {
      const appUser: AppUser = await linkRes.json()
      return { user: appUser }
    }
    console.warn('[neon-auth] Link-user returned non-ok status:', linkRes.status)
  } catch (err) {
    console.warn('[neon-auth] Link-user request failed:', err)
  }

  // Graceful fallback to authenticated Neon user
  return {
    user: {
      id: neonUser.id,
      email: neonUser.email,
      name: params.name || neonUser.name || neonUser.email,
      role: params.role || 'candidate',
      neonAuthId: neonUser.id,
    },
  }
}

/** Sign in via Neon Auth, then get/create linked Prisma User */
export async function neonSignIn(params: {
  email: string
  password: string
}): Promise<{ user: AppUser }> {
  const res = await fetch(`${AUTH_BASE}/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      email: params.email.toLowerCase().trim(),
      password: params.password,
    }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data || !data.user) {
    const msg = extractErrorMessage(data, 'Invalid email or password')
    throw new Error(
      msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credential')
        ? 'Invalid email or password'
        : msg,
    )
  }
  const neonUser = data.user

  // Link to Prisma (no-op if already linked)
  try {
    const linkRes = await fetch(`${AUTH_BASE}/link-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        neonUserId: neonUser.id,
        email: neonUser.email,
        name: data.user.name || '',
      }),
    })
    if (linkRes.ok) {
      const appUser: AppUser = await linkRes.json()
      return { user: appUser }
    }
    console.warn('[neon-auth] Link-user returned non-ok status during sign-in:', linkRes.status)
  } catch (err) {
    console.warn('[neon-auth] Link-user request failed during sign-in:', err)
  }

  // Graceful fallback to authenticated Neon user
  return {
    user: {
      id: neonUser.id,
      email: neonUser.email,
      name: data.user.name || neonUser.email,
      role: 'candidate',
      neonAuthId: neonUser.id,
    },
  }
}

/** Get current session from Neon Auth */
export async function neonGetSession(): Promise<{
  session: { id: string; token: string; expiresAt: string; userId: string } | null
  user: { id: string; email: string; name: string | null } | null
}> {
  try {
    const res = await fetch(`${AUTH_BASE}/get-session`, { credentials: 'same-origin' })
    if (!res.ok) return { session: null, user: null }
    const data = await res.json().catch(() => null)
    if (!data || typeof data !== 'object') return { session: null, user: null }
    return {
      session: data.session || null,
      user: data.user || null,
    }
  } catch {
    return { session: null, user: null }
  }
}

/** Sign out from Neon Auth */
export async function neonSignOut(): Promise<void> {
  await fetch(`${AUTH_BASE}/sign-out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    credentials: 'same-origin',
  })
}

/** Get full app user (Prisma profile) for current session */
export async function neonGetAppUser(): Promise<AppUser | null> {
  const sessionData = await neonGetSession()
  if (!sessionData || !sessionData.session || !sessionData.user) return null
  const neonUser = sessionData.user

  try {
    const res = await fetch(`${AUTH_BASE}/link-user`, { credentials: 'same-origin' })
    if (res.ok) {
      const appUser = await res.json().catch(() => null)
      if (appUser && appUser.id) return appUser
    }
  } catch { /* fallback below */ }

  return {
    id: neonUser.id,
    email: neonUser.email,
    name: neonUser.name || neonUser.email,
    role: 'candidate',
    neonAuthId: neonUser.id,
  }
}
