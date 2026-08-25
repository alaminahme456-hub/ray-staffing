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

function isNeonError(res: unknown): res is { error: { message: string } } {
  return (
    typeof res === 'object' &&
    res !== null &&
    'error' in res &&
    typeof (res as any).error?.message === 'string'
  )
}

/** Sign up via Neon Auth, then link to Prisma User */
export async function neonSignUp(params: {
  email: string
  password: string
  name: string
  phone?: string
  role?: string
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
  const data = await res.json()
  if (isNeonError(data)) {
    const msg = data.error.message
    throw new Error(
      msg.includes('already') || msg.includes('exist')
        ? 'An account with this email already exists'
        : msg,
    )
  }
  // data = { token, user: { id, email, name, ... } }
  const neonUser = data.user

  // Link to Prisma
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
    }),
  })
  const appUser: AppUser = await linkRes.json()
  return { user: appUser }
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
  const data = await res.json()
  if (isNeonError(data)) {
    throw new Error(
      data.error.message.includes('invalid') || data.error.message.includes('credential')
        ? 'Invalid email or password'
        : data.error.message,
    )
  }
  const neonUser = data.user

  // Link to Prisma (no-op if already linked)
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
  const appUser: AppUser = await linkRes.json()
  return { user: appUser }
}

/** Get current session from Neon Auth */
export async function neonGetSession(): Promise<{
  session: { id: string; token: string; expiresAt: string; userId: string } | null
  user: { id: string; email: string; name: string | null } | null
}> {
  const res = await fetch(`${AUTH_BASE}/get-session`, { credentials: 'same-origin' })
  return res.json()
}

/** Sign out from Neon Auth */
export async function neonSignOut(): Promise<void> {
  await fetch(`${AUTH_BASE}/sign-out`, { method: 'POST', credentials: 'same-origin' })
}

/** Get full app user (Prisma profile) for current session */
export async function neonGetAppUser(): Promise<AppUser | null> {
  const { session, user: neonUser } = await neonGetSession()
  if (!session || !neonUser) return null

  try {
    const res = await fetch(`${AUTH_BASE}/link-user`, { credentials: 'same-origin' })
    if (res.ok) {
      const appUser = await res.json()
      if (appUser) return appUser
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
