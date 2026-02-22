'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { BookOpen, ClipboardList, BarChart3 } from 'lucide-react';

interface Activity {
  _id: string;
  activityType: 'lesson' | 'quiz' | 'assessment';
  duration?: number;
  studentCount?: number;
  timestamp: string;
}

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type?: string) => {
    const t = (type ?? '').toLowerCase();
    switch (t) {
      case 'lesson':
        return BookOpen;
      case 'quiz':
        return ClipboardList;
      case 'assessment':
        return BarChart3;
      default:
        return BookOpen;
    }
  };

  const getActivityColor = (type?: string) => {
    const t = (type ?? '').toLowerCase();
    switch (t) {
      case 'lesson':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'assessment':
        return 'bg-amber-100 text-amber-800 border border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  const formatActivityType = (type?: string | null) => {
    const s = String(type ?? '');
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>
          {activities.length} activities recorded
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No activities recorded</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.activityType);
              return (
                <div
                  key={activity._id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">
                        {formatActivityType(activity.activityType)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDate(new Date(activity.timestamp))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getActivityColor(activity.activityType)}>
                      {formatActivityType(activity.activityType)}
                    </Badge>
                    {activity.studentCount && (
                      <span className="text-xs text-slate-600 whitespace-nowrap">
                        {activity.studentCount} students
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
