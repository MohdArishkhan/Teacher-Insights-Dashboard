import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/db-utils'
import { parseActivityData } from '@/lib/parse-data'

export async function POST() {
  try {
    const activities = parseActivityData()
    const result = await seedDatabase(activities)

    return NextResponse.json({
      success: true,
      message: result.message || `Inserted ${result.insertedCount} activities`,
    })
  } catch (error) {
    console.error('Seed API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}
