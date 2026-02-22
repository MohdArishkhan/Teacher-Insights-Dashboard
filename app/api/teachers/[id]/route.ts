import { NextResponse } from 'next/server'
import { getTeacherDetails } from '@/lib/db-utils'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teacherId } = await params
    const activities = await getTeacherDetails(teacherId)

    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Teacher not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: activities,
    })
  } catch (error) {
    console.error('Teacher API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch teacher data' },
      { status: 500 }
    )
  }
}
