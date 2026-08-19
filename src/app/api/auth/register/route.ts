import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, role } = await req.json()
    if (!email || !password || !name) return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })

    const passwordHash = await hash(password, 12)

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name,
        phone,
        role: role || 'candidate',
        isActive: true,
        emailVerified: true,
        ...(role === 'candidate' ? { profile: { create: { profileComplete: 0 } } } : {}),
        ...(role === 'employer' ? { employer: { create: { companyName: name } } } : {}),
        ...(role === 'customer' ? { customer: { create: { firstName: name } } } : {}),
      },
    })

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
