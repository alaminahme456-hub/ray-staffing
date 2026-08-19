import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare } from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    if (!user.isActive) return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })

    const valid = await compare(password, user.passwordHash)
    if (!valid) return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })

    await db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}