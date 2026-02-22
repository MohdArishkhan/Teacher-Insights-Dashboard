'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { TeacherStats } from '@/lib/types'
import { TeacherDetails } from './teacher-details'

interface TeachersTableProps {
  teachers: TeacherStats[]
}

export function TeachersTable({ teachers }: TeachersTableProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
  const [query, setQuery] = useState<string>('')
  const [debouncedQuery, setDebouncedQuery] = useState<string>('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  // Aggregate teachers by `teacher_id` so each teacher appears once
  const aggregatedTeachers = useMemo(() => {
    const map = new Map<string, any>()
    for (const t of teachers) {
      const existing = map.get(t.teacher_id)
      if (!existing) {
        map.set(t.teacher_id, {
          teacher_id: t.teacher_id,
          teacher_name: t.teacher_name,
          // keep the first subject for detail view, but also collect all subjects
          subject: t.subject,
          subjects: new Set([t.subject]),
          lessonPlans: t.lessonPlans || 0,
          quizzes: t.quizzes || 0,
          questionPapers: t.questionPapers || 0,
          total: t.total || 0,
        })
      } else {
        existing.lessonPlans += t.lessonPlans || 0
        existing.quizzes += t.quizzes || 0
        existing.questionPapers += t.questionPapers || 0
        existing.total += t.total || 0
        existing.subjects.add(t.subject)
      }
    }

    return Array.from(map.values()).map((v) => ({
      ...v,
      subjects: Array.from(v.subjects),
    }))
  }, [teachers])

  const filteredTeachers = useMemo(() => {
    if (!debouncedQuery) return aggregatedTeachers
    const tokens = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)
    return aggregatedTeachers.filter((t) => {
      const hay = `${t.teacher_name} ${t.subjects.join(' ')} ${t.teacher_id}`.toLowerCase()
      return tokens.every((tok) => hay.includes(tok))
    })
  }, [aggregatedTeachers, debouncedQuery])

  const selectedTeacher = aggregatedTeachers.find(
    (t) => t.teacher_id === selectedTeacherId
  )

  const detailsRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  if (selectedTeacherId && detailsRef.current) {
    const el = detailsRef.current;
    const rect = el.getBoundingClientRect();
    
    const targetY = window.scrollY + rect.top - (window.innerHeight * 0.1);
    const startY = window.scrollY;
    const distance = targetY - startY;
    
    const duration = 1200
    let startTime: number | null = null

    const easing = (t: number) => 1 - Math.pow(1 - t, 3)

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - (startTime as number)
      const progress = Math.min(timeElapsed / duration, 1)

      window.scrollTo(0, startY + distance * easing(progress))

      if (progress < 1) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation);
  }
}, [selectedTeacherId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <label htmlFor="teacher-search" className="sr-only">Search teachers</label>
          <input
            id="teacher-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, subject, or ID..."
            className="px-3 py-2 border rounded-md text-sm w-64"
            aria-label="Search teachers"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-sm text-slate-500 hover:text-slate-700"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="max-h-96 overflow-auto overflow-x-auto px-4 sm:px-0">
          <table className="w-full text-sm table-auto min-w-0">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-left font-semibold text-gray-700 whitespace-normal">
                  Teacher Name
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-left font-semibold text-gray-700 whitespace-normal">
                  Subject
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center font-semibold text-gray-700 whitespace-normal">
                  Lessons
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center font-semibold text-gray-700 whitespace-normal">
                  Quizzes
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center font-semibold text-gray-700 whitespace-normal">
                  Papers
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center font-semibold text-gray-700 whitespace-normal">
                  Total
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center font-semibold text-gray-700 whitespace-normal">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.teacher_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-gray-900 font-medium whitespace-normal break-words">
                    {teacher.teacher_name}
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-gray-600 whitespace-normal break-words">
                    {teacher.subjects && teacher.subjects.length > 1
                      ? `${teacher.subjects[0]} (+${teacher.subjects.length - 1})`
                      : teacher.subject}
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center text-gray-900 font-medium whitespace-normal">
                    {teacher.lessonPlans}
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center text-gray-900 font-medium whitespace-normal">
                    {teacher.quizzes}
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center text-gray-900 font-medium whitespace-normal">
                    {teacher.questionPapers}
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center whitespace-normal">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                      {teacher.total}
                    </span>
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center whitespace-normal">
                    <button
                      onClick={() =>
                        setSelectedTeacherId(
                          selectedTeacherId === teacher.teacher_id
                            ? null
                            : teacher.teacher_id
                        )
                      }
                      className="px-3 py-1 text-sm font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      {selectedTeacherId === teacher.teacher_id
                        ? 'Hide'
                        : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeacher && (
        <div ref={detailsRef}>
          <TeacherDetails teacher={selectedTeacher} />
        </div>
      )}
      {teachers.length > 0 && filteredTeachers.length === 0 && (
        <div className="text-center text-slate-600">No teachers match your search.</div>
      )}
    </div>
  )
}
