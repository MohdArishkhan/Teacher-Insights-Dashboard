'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Zap, BookOpen } from 'lucide-react';

interface TeacherStatsGridProps {
  teacherName: string;
  totalActivities: number;
  activeWeeks: number;
  averagePerWeek: number;
  avgActivityDuration?: number;
}

export function TeacherStatsGrid({
  teacherName,
  totalActivities,
  activeWeeks,
  averagePerWeek,
  avgActivityDuration,
}: TeacherStatsGridProps) {
  const stats = [
    {
      label: 'Total Activities',
      value: totalActivities,
      icon: BookOpen,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Weeks',
      value: activeWeeks,
      icon: Calendar,
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
    },
    {
      label: 'Avg per Week',
      value: averagePerWeek.toFixed(1),
      icon: TrendingUp,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Engagement Score',
      value: (Math.min(100, Math.round((averagePerWeek / 5) * 100))).toFixed(0) + '%',
      icon: Zap,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{teacherName}</h2>
        <p className="text-slate-600">Detailed Performance Analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`${stat.bgColor} border ${stat.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
