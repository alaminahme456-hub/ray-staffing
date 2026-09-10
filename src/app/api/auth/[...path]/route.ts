/**
 * Catch-all proxy for Neon Auth REST API.
 * Forwards sign-in, sign-up, sign-out, get-session to Neon Auth,
 * proxying cookies in both directions.
 * 
 * CRITICAL: Neon Auth rejects requests without a valid Origin header.
 * We derive the origin from NEXT_PUBLIC_NEON_AUTH_URL.
 */
import { NextRequest, NextResponse } from 'next/server'

const NEON_AUTH_URL = process.env.NEXT_PUBLIC_NEON_AUTH_URL || ''

function getNeonOrigin(): string {
  if (!NEON_AUTH_URL) return ''
  try {
    return new URL(NEON_AUTH_URL).origin
  } catch {
    return ''
  }
}

const PROXIED_PATHS = new Set([
  'sign-in/email', 'sign-up/email', 'sign-out', 'get-session',
  'forget-password', 'reset-password', 'send-verification-email',
  'verify-email', 'update-user', 'list-sessions', 'revoke-session',
])

/** Build headers for server-side requests to Neon Auth */
function proxyHeaders(request: NextRequest, extra?: Record<string, string>): HeadersInit {
  const h: Record<string, string> = {
    'Content-Type': 'application/json',
    'Origin': getNeonOrigin(),
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

  if (!NEON_AUTH_URL) {
    if (fullPath === 'get-session') {
      return NextResponse.json({ session: null, user: null })
    }
    return NextResponse.json({ error: 'Auth service not configured' }, { status: 503 })
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

  if (!NEON_AUTH_URL) {
    return NextResponse.json({ error: 'Auth service not configured. Please set NEXT_PUBLIC_NEON_AUTH_URL.' }, { status: 503 })
  }

  try {
    const body = await request.text()
    const finalBody = body && body.trim().length > 0 ? body : '{}'
    const res = await fetch(`${NEON_AUTH_URL}/${fullPath}`, {
      method: 'POST',
      headers: proxyHeaders(request),
      body: finalBody,
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
