import { NextResponse } from 'next/server'
import { getTrendsByGranularity } from '@/lib/db-utils'

export const dynamic = 'force-dynamic'

export const revalidate = 60 // short cache for interactive charts

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const granularity = (url.searchParams.get('granularity') || 'week') as
      | 'week'
      | 'month'
      | 'year'

    const data = await getTrendsByGranularity(granularity)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Aggregate API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch aggregated data' },
      { status: 500 }
    )
  }
}
