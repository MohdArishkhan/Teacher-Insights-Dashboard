'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type Point = {
  date: string
  lessons: number
  quizzes: number
  questionPapers: number
}

export function ActivityTimeseries({ initial = 'week' }: { initial?: 'week' | 'month' | 'year' }) {
  const [granularity, setGranularity] = useState(initial)
  const [data, setData] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    fetch(`/api/analytics/aggregate?granularity=${granularity}`)
      .then((res) => res.json())
      .then((json) => {
        if (!mounted) return
        if (!json.success) throw new Error(json.error || 'Failed')
        setData(json.data || [])
      })
      .catch((err) => setError(err.message || 'Failed to load'))
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [granularity])

  return (
    <Card>
      <CardHeader className="flex items-start justify-between">
        <div>
          <CardTitle>School Activity Trends</CardTitle>
          <CardDescription>View activity over time (by {granularity})</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setGranularity('week')}
            className={`px-3 py-1 rounded-md text-sm ${granularity === 'week' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}
          >
            Week
          </button>
          <button
            onClick={() => setGranularity('month')}
            className={`px-3 py-1 rounded-md text-sm ${granularity === 'month' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}
          >
            Month
          </button>
          <button
            onClick={() => setGranularity('year')}
            className={`px-3 py-1 rounded-md text-sm ${granularity === 'year' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}
          >
            Year
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading chart...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">No data available</div>
        ) : (
          <div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6eef8" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lessons" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="quizzes" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="questionPapers" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-center">Lessons</th>
                    <th className="px-4 py-2 text-center">Quizzes</th>
                    <th className="px-4 py-2 text-center">Papers</th>
                    <th className="px-4 py-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr key={row.date} className="border-t">
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2 text-center">{row.lessons}</td>
                      <td className="px-4 py-2 text-center">{row.quizzes}</td>
                      <td className="px-4 py-2 text-center">{row.questionPapers}</td>
                      <td className="px-4 py-2 text-center font-medium">{row.lessons + row.quizzes + row.questionPapers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
