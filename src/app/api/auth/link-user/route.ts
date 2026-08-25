/**
 * Links a Neon Auth user to a Prisma User record.
 * POST: Create or link. GET: Fetch current linked user.
 */
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getNeonSession } from '@/lib/auth/server'

export async function POST(req: NextRequest) {
  try {
    const { neonUserId, email, name, phone, role } = await req.json()
    if (!neonUserId || !email) {
      return NextResponse.json({ error: 'neonUserId and email required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Already linked?
    let user = await db.user.findUnique({ where: { neonAuthId: neonUserId } })
    if (user) {
      user = await db.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date(), ...(name ? { name } : {}) },
      })
      return NextResponse.json(mapUser(user))
    }

    // Legacy user with same email?
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      const linked = await db.user.update({
        where: { id: existing.id },
        data: { neonAuthId: neonUserId, lastLogin: new Date(), passwordHash: null },
      })
      return NextResponse.json(mapUser(linked))
    }

    // Create new Prisma user
    const newUser = await db.user.create({
      data: {
        neonAuthId: neonUserId,
        email: normalizedEmail,
        name: name || '',
        phone: phone || null,
        role: role || 'candidate',
        isActive: true,
        emailVerified: true,
        lastLogin: new Date(),
        ...(role === 'candidate' ? { profile: { create: { profileComplete: 0 } } } : {}),
        ...(role === 'employer' ? { employer: { create: { companyName: name || '' } } } : {}),
        ...(role === 'customer' ? { customer: { create: { firstName: name || '' } } } : {}),
      },
    })
    return NextResponse.json(mapUser(newUser), { status: 201 })
  } catch (error) {
    console.error('[link-user] error:', error)
    return NextResponse.json({ error: 'Failed to link user' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { session, user: neonUser } = await getNeonSession()
    if (!session || !neonUser) return NextResponse.json(null, { status: 401 })

    let user = await db.user.findUnique({ where: { neonAuthId: neonUser.id } })

    // Auto-link by email if not yet linked
    if (!user) {
      const byEmail = await db.user.findUnique({ where: { email: neonUser.email.toLowerCase().trim() } })
      if (byEmail) {
        user = await db.user.update({
          where: { id: byEmail.id },
          data: { neonAuthId: neonUser.id, lastLogin: new Date(), passwordHash: null },
        })
      }
    }

    if (!user) return NextResponse.json(null, { status: 404 })
    return NextResponse.json(mapUser(user))
  } catch (error) {
    console.error('[link-user] GET error:', error)
    return NextResponse.json(null, { status: 500 })
  }
}

function mapUser(u: { id: string; email: string; name: string | null; role: string; neonAuthId: string | null }) {
  return { id: u.id, email: u.email, name: u.name || u.email, role: u.role, neonAuthId: u.neonAuthId || u.id }
}
