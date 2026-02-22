'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyDataPoint {
  day: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  total: number;
}

interface WeeklyActivityDetailProps {
  data: WeeklyDataPoint[];
}

export function WeeklyActivityDetail({ data }: WeeklyActivityDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity Trend</CardTitle>
        <CardDescription>
          Activity distribution over the week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
              <Line
                type="monotone"
                dataKey="lessons"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="quizzes"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="assessments"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-medium text-blue-600">Total Lessons</p>
            <p className="text-lg font-bold text-blue-900 mt-1">
              {data.reduce((sum, day) => sum + day.lessons, 0)}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs font-medium text-purple-600">Total Quizzes</p>
            <p className="text-lg font-bold text-purple-900 mt-1">
              {data.reduce((sum, day) => sum + day.quizzes, 0)}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs font-medium text-amber-600">Total Assessments</p>
            <p className="text-lg font-bold text-amber-900 mt-1">
              {data.reduce((sum, day) => sum + day.assessments, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
