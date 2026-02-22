import { NextResponse } from 'next/server'
import { getTeacherStats, getWeeklyTrends, getTotalActivities } from '@/lib/db-utils'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const [teachers, weeklyTrends, totalActivities] = await Promise.all([
      getTeacherStats(),
      getWeeklyTrends(),
      getTotalActivities(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        teachers,
        weeklyTrends,
        totalActivities,
      },
    })
  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
