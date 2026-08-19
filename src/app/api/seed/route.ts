import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

export async function POST() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: 'Database seeded' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ success: true, message: 'Database seeded' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
