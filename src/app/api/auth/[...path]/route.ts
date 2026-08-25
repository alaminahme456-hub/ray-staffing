/**
 * Catch-all proxy for Neon Auth REST API.
 * Forwards sign-in, sign-up, sign-out, get-session to Neon Auth,
 * proxying cookies in both directions.
 * 
 * CRITICAL: Neon Auth rejects requests without a valid Origin header.
 * We derive the origin from NEXT_PUBLIC_NEON_AUTH_URL.
 */
import { NextRequest, NextResponse } from 'next/server'

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL!
// Derive origin for the Origin header (Neon Auth requires it)
const NEON_AUTH_ORIGIN = new URL(NEON_AUTH_URL).origin

const PROXIED_PATHS = new Set([
  'sign-in/email', 'sign-up/email', 'sign-out', 'get-session',
  'forget-password', 'reset-password', 'send-verification-email',
  'verify-email', 'update-user', 'list-sessions', 'revoke-session',
])

/** Build headers for server-side requests to Neon Auth */
function proxyHeaders(request: NextRequest, extra?: Record<string, string>): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'Origin': NEON_AUTH_ORIGIN,
    ...(request.headers.get('cookie') ? { Cookie: request.headers.get('cookie')! } : {}),
    ...extra,
  }
  return h
}

/** Rewrite Set-Cookie to remove Domain attr so browser stores under our domain */
function rewriteCookie(cookie: string): string {
  return cookie.replace(/;\s*Domain=[^;]*/gi, '')
}

/** Forward Set-Cookie headers from Neon Auth response */
function forwardCookies(source: Response, target: Headers) {
  for (const c of source.headers.getSetCookie()) {
    target.append('Set-Cookie', rewriteCookie(c))
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const fullPath = path.join('/')

  if (!PROXIED_PATHS.has(fullPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const res = await fetch(`${NEON_AUTH_URL}/${fullPath}`, {
      headers: proxyHeaders(request),
      cache: 'no-store',
    })
    const data = await res.json()
    const response = NextResponse.json(data, { status: res.status })
    forwardCookies(res, response.headers)
    return response
  } catch (error) {
    console.error(`[Auth Proxy] GET /${fullPath}:`, error)
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 502 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const fullPath = path.join('/')

  if (!PROXIED_PATHS.has(fullPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const body = await request.text()
    const res = await fetch(`${NEON_AUTH_URL}/${fullPath}`, {
      method: 'POST',
      headers: proxyHeaders(request),
      body,
    })
    const data = await res.json()
    const response = NextResponse.json(data, { status: res.status })
    forwardCookies(res, response.headers)
    return response
  } catch (error) {
    console.error(`[Auth Proxy] POST /${fullPath}:`, error)
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 502 })
  }
}
