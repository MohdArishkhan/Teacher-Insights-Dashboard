'use client'

import { useEffect, useState } from 'react'
import { DashboardData } from '@/lib/types'
import { StatsCard } from './stats-card'
import { TeachersTable } from './teachers-table'
import { BookOpen, HelpCircle, FileText } from 'lucide-react'
import { ActivityTimeseries } from '@/components/analysis/activity-timeseries'

export function MainDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeDashboard() {
      try {
        // Seed database on first load
        await fetch('/api/seed', { method: 'POST' })

        // Fetch dashboard data
        const response = await fetch('/api/dashboard')
        if (!response.ok) throw new Error('Failed to fetch dashboard data')

        const { data } = await response.json()
        setDashboardData(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred'
        )
        console.error('Dashboard initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <p className="text-gray-500 mt-2">Please check your MongoDB connection</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  // Calculate totals
  const totalLessons = dashboardData.teachers.reduce(
    (sum, t) => sum + t.lessonPlans,
    0
  )
  const totalQuizzes = dashboardData.teachers.reduce(
    (sum, t) => sum + t.quizzes,
    0
  )
  const totalPapers = dashboardData.teachers.reduce(
    (sum, t) => sum + t.questionPapers,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Insights Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor teacher activity and performance metrics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Activities"
            value={dashboardData.totalActivities}
            icon={<BookOpen size={24} />}
            variant="default"
          />
          <StatsCard
            title="Lesson Plans"
            value={totalLessons}
            icon={<BookOpen size={24} />}
            variant="lessons"
          />
          <StatsCard
            title="Quizzes"
            value={totalQuizzes}
            icon={<HelpCircle size={24} />}
            variant="quizzes"
          />
          <StatsCard
            title="Question Papers"
            value={totalPapers}
            icon={<FileText size={24} />}
            variant="papers"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3">
            <ActivityTimeseries initial="week" />
          </div>
        </div>

        {/* Teachers Section */}
        <div className="space-y-4 mb-8 mt-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Teacher Performance
            </h2>
            <p className="text-gray-600 mt-1">
              View detailed activity for each teacher
            </p>
          </div>
          <TeachersTable teachers={dashboardData.teachers} />
        </div>
      </main>
    </div>
  )
}
