'use client'

import { useEffect, useState } from 'react'
import { TeacherStats, TeacherActivity } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface TeacherDetailsProps {
  teacher: TeacherStats
}

export function TeacherDetails({ teacher }: TeacherDetailsProps) {
  const [activities, setActivities] = useState<TeacherActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await fetch(`/api/teachers/${teacher.teacher_id}`)
        if (response.ok) {
          const { data } = await response.json()
          setActivities(data)
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [teacher.teacher_id])

  const activityTypeColors = {
    'Lesson Plan': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Quiz': 'bg-amber-50 text-amber-700 border-amber-200',
    'Question Paper': 'bg-purple-50 text-purple-700 border-purple-200',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {teacher.teacher_name} - Detailed Activity
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Subject: {teacher.subject}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* summary chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="text-sm font-medium">Lessons</span>
              <span className="text-sm font-semibold">{activities.filter(a=>a.activity_type==='Lesson Plan').length}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <span className="text-sm font-medium">Quizzes</span>
              <span className="text-sm font-semibold">{activities.filter(a=>a.activity_type==='Quiz').length}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
              <span className="text-sm font-medium">Papers</span>
              <span className="text-sm font-semibold">{activities.filter(a=>a.activity_type==='Question Paper').length}</span>
            </div>
          </div>

          {/* compact list */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
            <div className="max-h-80 overflow-auto">
              <ul className="divide-y">
                {activities.slice(0, showAll ? activities.length : 5).map((activity, index) => (
                  <li key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-2 py-1 rounded text-sm font-medium border ${activityTypeColors[activity.activity_type as keyof typeof activityTypeColors]}`}>
                        {activity.activity_type}
                      </span>
                      <div className="text-sm text-gray-700">
                        <div className="font-medium">{activity.subject}</div>
                        <div className="text-xs text-gray-500">Class {activity.class}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(new Date(activity.created_at))}</div>
                  </li>
                ))}
              </ul>
            </div>

            {activities.length > 5 && (
              <div className="px-3 py-2 border-t bg-white text-center">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAll ? 'Show less' : `Show all (${activities.length})`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
