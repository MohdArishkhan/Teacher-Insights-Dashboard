'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft } from 'lucide-react';
import { TeacherStatsGrid } from '@/components/analysis/teacher-stats-grid';
import { ActivityBreakdown } from '@/components/analysis/activity-breakdown';
import { WeeklyActivityDetail } from '@/components/analysis/weekly-activity-detail';
import { ActivityList } from '@/components/analysis/activity-list';
import { Button } from '@/components/ui/button';

interface Activity {
  _id: string;
  teacherName: string;
  activityType: 'lesson' | 'quiz' | 'assessment';
  timestamp: string;
  studentCount?: number;
  duration?: number;
}

interface WeeklyData {
  day: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  total: number;
}

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`/api/teachers/${teacherId}`);
        const result = await response.json();

        if (result.success && result.data) {
          // Normalize API data shape to the frontend Activity interface
          const normalized = result.data.map((a: any) => ({
            _id: a._id ?? (a._id && a._id.$oid) ?? '',
            teacherName: a.teacher_name ?? a.teacherName ?? '',
            activityType: a.activity_type
              ? a.activity_type.toString().toLowerCase().includes('lesson')
                ? 'lesson'
                : a.activity_type.toString().toLowerCase().includes('quiz')
                ? 'quiz'
                : 'assessment'
              : (a.activityType ?? 'lesson'),
            timestamp: a.created_at ? new Date(a.created_at).toISOString() : (a.timestamp ?? new Date().toISOString()),
            studentCount: a.student_count ?? a.studentCount,
            duration: a.duration,
          })) as Activity[];

          setActivities(normalized);
        } else {
          setError('Teacher not found');
        }
      } catch (err) {
        setError('Failed to load teacher data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  // Calculate stats
  const calculateStats = () => {
    if (activities.length === 0) {
      return {
        teacherName: 'Loading...',
        totalActivities: 0,
        lessons: 0,
        quizzes: 0,
        assessments: 0,
        activeWeeks: 0,
        averagePerWeek: 0,
        weeklyData: [],
      };
    }

    const teacherName = activities[0]?.teacherName || 'Unknown Teacher';
    const lessons = activities.filter((a) => a.activityType === 'lesson').length;
    const quizzes = activities.filter((a) => a.activityType === 'quiz').length;
    const assessments = activities.filter((a) => a.activityType === 'assessment').length;

    // Calculate weekly data
    const weeklyMap: { [key: string]: { lessons: number; quizzes: number; assessments: number } } = {};
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      const dayIndex = (date.getDay() + 6) % 7;
      const dayKey = days[dayIndex];

      if (!weeklyMap[dayKey]) {
        weeklyMap[dayKey] = { lessons: 0, quizzes: 0, assessments: 0 };
      }

      if (activity.activityType === 'lesson') {
        weeklyMap[dayKey].lessons++;
      } else if (activity.activityType === 'quiz') {
        weeklyMap[dayKey].quizzes++;
      } else if (activity.activityType === 'assessment') {
        weeklyMap[dayKey].assessments++;
      }
    });

    const weeklyData: WeeklyData[] = days.map((day) => {
      const wk = weeklyMap[day] || { lessons: 0, quizzes: 0, assessments: 0 };
      const lessons = wk.lessons ?? 0;
      const quizzes = wk.quizzes ?? 0;
      const assessments = wk.assessments ?? 0;

      return {
        day,
        lessons,
        quizzes,
        assessments,
        total: lessons + quizzes + assessments,
      };
    });

    // Count unique weeks
    const uniqueWeeks = new Set(
      activities.map((a) => {
        const date = new Date(a.timestamp);
        return Math.floor(date.getTime() / (7 * 24 * 60 * 60 * 1000));
      })
    );

    const activeWeeks = uniqueWeeks.size;
    const averagePerWeek = activeWeeks > 0 ? activities.length / activeWeeks : 0;

    return {
      teacherName,
      totalActivities: activities.length,
      lessons,
      quizzes,
      assessments,
      activeWeeks,
      averagePerWeek,
      weeklyData,
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-2 text-slate-600">Loading teacher data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/teacher">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </Link>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Analysis</h1>
          <p className="text-slate-600 mt-2">Comprehensive performance metrics</p>
        </div>
        <Link href="/teacher">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teachers
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <TeacherStatsGrid
        teacherName={stats.teacherName}
        totalActivities={stats.totalActivities}
        activeWeeks={stats.activeWeeks}
        averagePerWeek={stats.averagePerWeek}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Breakdown */}
        <div className="lg:col-span-1">
          <ActivityBreakdown
            lessons={stats.lessons}
            quizzes={stats.quizzes}
            assessments={stats.assessments}
            totalActivities={stats.totalActivities}
          />
        </div>

        {/* Weekly Activity Detail */}
        <div className="lg:col-span-2">
          <WeeklyActivityDetail data={stats.weeklyData} />
        </div>
      </div>

      {/* Activity List */}
      <ActivityList activities={activities} />
    </div>
  );
}
