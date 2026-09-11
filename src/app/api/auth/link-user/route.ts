/**
 * Links a Neon Auth user to a Prisma User record.
 * POST: Create or link. GET: Fetch current linked user.
 */
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNeonSession } from '@/lib/auth/server'

export async function POST(req: NextRequest) {
  let body: any = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { neonUserId, email, name, phone, role, companyName } = body
  if (!neonUserId || !email) {
    return NextResponse.json({ error: 'neonUserId and email required' }, { status: 400 })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const fallbackUser = {
    id: neonUserId,
    email: normalizedEmail,
    name: name || normalizedEmail.split('@')[0],
    role: role || 'candidate',
    neonAuthId: neonUserId,
  }

  try {
    // 1. Check if user already linked by neonAuthId
    let user = await db.user.findUnique({ where: { neonAuthId: neonUserId } })
    if (user) {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
        },
      })
      return NextResponse.json(mapUser(user))
    }

    // 2. Check if legacy user with same email exists
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      const linked = await db.user.update({
        where: { id: existing.id },
        data: {
          neonAuthId: neonUserId,
          lastLogin: new Date(),
          passwordHash: null,
          ...(name ? { name } : {}),
          ...(phone ? { phone } : {}),
        },
      })
      return NextResponse.json(mapUser(linked))
    }

    // 3. Create new Prisma user
    try {
      const newUser = await db.user.create({
        data: {
          neonAuthId: neonUserId,
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          phone: phone || null,
          role: role || 'candidate',
          isActive: true,
          emailVerified: true,
          lastLogin: new Date(),
          ...(role === 'candidate' ? { profile: { create: { profileComplete: 0 } } } : {}),
          ...(role === 'employer' ? { employer: { create: { companyName: companyName || name || 'Organization' } } } : {}),
          ...(role === 'customer' ? { customer: { create: { firstName: name || '' } } } : {}),
        },
      })
      return NextResponse.json(mapUser(newUser), { status: 201 })
    } catch (createErr: any) {
      console.warn('[link-user] nested create error, attempting recovery:', createErr?.message)
      // Check if another parallel request created it
      const recovered = await db.user.findFirst({
        where: {
          OR: [{ neonAuthId: neonUserId }, { email: normalizedEmail }],
        },
      })
      if (recovered) {
        return NextResponse.json(mapUser(recovered))
      }

      // Try creating without nested relation if relation schema was the issue
      const simpleUser = await db.user.create({
        data: {
          neonAuthId: neonUserId,
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          phone: phone || null,
          role: role || 'candidate',
          isActive: true,
          emailVerified: true,
          lastLogin: new Date(),
        },
      })
      return NextResponse.json(mapUser(simpleUser), { status: 201 })
    }
  } catch (error: any) {
    console.error('[link-user] database error during link, providing fallback session:', error?.message || error)
    // Never fail auth flow with 500 — return fallback session so user can enter app
    return NextResponse.json(fallbackUser, { status: 200 })
  }
}

export async function GET() {
  try {
    const sessionResult = await getNeonSession()
    if (!sessionResult || !sessionResult.session || !sessionResult.user) {
      return NextResponse.json(null, { status: 401 })
    }
    const { user: neonUser } = sessionResult
    const normalizedEmail = neonUser.email.toLowerCase().trim()

    let user = await db.user.findUnique({ where: { neonAuthId: neonUser.id } })

    // Auto-link by email if not yet linked
    if (!user) {
      const byEmail = await db.user.findUnique({ where: { email: normalizedEmail } })
      if (byEmail) {
        user = await db.user.update({
          where: { id: byEmail.id },
          data: { neonAuthId: neonUser.id, lastLogin: new Date(), passwordHash: null },
        })
      }
    }

    // Auto-create on GET if valid Neon session exists but no Prisma record yet
    if (!user) {
      try {
        user = await db.user.create({
          data: {
            neonAuthId: neonUser.id,
            email: normalizedEmail,
            name: neonUser.name || normalizedEmail.split('@')[0],
            role: 'candidate',
            isActive: true,
            emailVerified: true,
            lastLogin: new Date(),
            profile: { create: { profileComplete: 0 } },
          },
        })
      } catch (err: any) {
        console.warn('[link-user] GET auto-create fallback:', err?.message)
      }
    }

    if (!user) {
      return NextResponse.json({
        id: neonUser.id,
        email: normalizedEmail,
        name: neonUser.name || normalizedEmail.split('@')[0],
        role: 'candidate',
        neonAuthId: neonUser.id,
      })
    }
    return NextResponse.json(mapUser(user))
  } catch (error) {
    console.error('[link-user] GET error:', error)
    return NextResponse.json(null, { status: 500 })
  }
}

function mapUser(u: { id: string; email: string; name: string | null; role: string; neonAuthId: string | null }) {
  return { id: u.id, email: u.email, name: u.name || u.email, role: u.role, neonAuthId: u.neonAuthId || u.id }
}
