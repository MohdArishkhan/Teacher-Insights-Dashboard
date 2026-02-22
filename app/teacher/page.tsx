'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Loader2 } from 'lucide-react';

interface Teacher {
  teacher_id: string;
  teacher_name: string;
  total: number;
}

export default function TeacherSelectionPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        
        if (result.success && result.data.teachers) {
          setTeachers(result.data.teachers);
        } else {
          setError('Failed to load teachers');
        }
      } catch (err) {
        setError('Error loading teachers');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);
  const uniqueTeachers = Array.from(
    new Map(teachers.map((t) => [t.teacher_id, t])).values()
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  const filteredTeachers = useMemo(() => {
    if (!debouncedQuery) return uniqueTeachers
    const tokens = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)
    return uniqueTeachers.filter((t) => {
      const hay = `${t.teacher_name} ${t.total} ${t.teacher_id}`.toLowerCase()
      return tokens.every((tok) => hay.includes(tok))
    })
  }, [uniqueTeachers, debouncedQuery])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="mt-2 text-slate-600">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Teacher Analysis</h1>
          <p className="text-slate-600 mt-2">
            Select a teacher to view detailed performance analytics
          </p>
        </div>

        <div className="ml-4 mt-5">
          <label htmlFor="teacher-search" className="sr-only">Search teachers</label>
          <input
            id="teacher-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachers..."
            className="px-3 py-2 border rounded-md text-sm w-64"
            aria-label="Search teachers"
          />
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {uniqueTeachers.length === 0 && !error ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-500">No teachers found. Please seed the database.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => (
            <Link key={teacher.teacher_id} href={`/teacher/${teacher.teacher_id}`}>
              <Card className="h-full cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{teacher.teacher_name}</CardTitle>
                  <CardDescription>View detailed analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600">Total Activities</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {teacher.total}
                      </p>
                    </div>
                    <div className="flex items-center text-blue-600 group">
                      <span className="text-sm font-medium">View Analysis</span>
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
