'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityBreakdownProps {
  lessons: number;
  quizzes: number;
  assessments: number;
  totalActivities: number;
}

export function ActivityBreakdown({
  lessons,
  quizzes,
  assessments,
  totalActivities,
}: ActivityBreakdownProps) {
  const activities = [
    {
      type: 'Lessons',
      count: lessons,
      percentage: totalActivities > 0 ? ((lessons / totalActivities) * 100).toFixed(1) : 0,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      type: 'Quizzes',
      count: quizzes,
      percentage: totalActivities > 0 ? ((quizzes / totalActivities) * 100).toFixed(1) : 0,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
    {
      type: 'Assessments',
      count: assessments,
      percentage: totalActivities > 0 ? ((assessments / totalActivities) * 100).toFixed(1) : 0,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Breakdown</CardTitle>
        <CardDescription>Distribution of activities by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-20">
          {activities.map((activity) => (
            <div key={activity.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${activity.color}`} />
                  <span className="font-medium text-sm">{activity.type}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{activity.count}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    ({activity.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={activity.color}
                  style={{
                    width: `${activity.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Activities</span>
              <span className="font-bold text-lg text-slate-900">
                {totalActivities}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
