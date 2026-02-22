'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TeacherComparison {
  name: string;
  lessons: number;
  quizzes: number;
  assessments: number;
}

interface TeacherComparisonChartProps {
  data: TeacherComparison[];
}

const COLORS = ['#3b82f6', '#a855f7', '#f59e0b'];

export function TeacherComparisonChart({ data }: TeacherComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teacher Comparison</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">No teacher data to compare</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Performance Comparison</CardTitle>
        <CardDescription>Activity distribution across all teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                }}
              />
              <Legend />
              <Bar dataKey="lessons" stackId="a" fill="#3b82f6" />
              <Bar dataKey="quizzes" stackId="a" fill="#a855f7" />
              <Bar dataKey="assessments" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface ActivityTypeDistributionProps {
  lessons: number;
  quizzes: number;
  assessments: number;
}

export function ActivityTypeDistribution({
  lessons,
  quizzes,
  assessments,
}: ActivityTypeDistributionProps) {
  const data = [
    { name: 'Lessons', value: lessons },
    { name: 'Quizzes', value: quizzes },
    { name: 'Assessments', value: assessments },
  ];

  const total = lessons + quizzes + assessments;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">No activities recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Type Distribution</CardTitle>
        <CardDescription>Breakdown by activity type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / total) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with counts */}
          <div className="mt-6 grid grid-cols-3 gap-4 w-full">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <p className="text-xs font-medium text-blue-600">Lessons</p>
              <p className="text-lg font-bold text-blue-900 mt-1">{lessons}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <p className="text-xs font-medium text-purple-600">Quizzes</p>
              <p className="text-lg font-bold text-purple-900 mt-1">{quizzes}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
              <p className="text-xs font-medium text-amber-600">Assessments</p>
              <p className="text-lg font-bold text-amber-900 mt-1">{assessments}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
