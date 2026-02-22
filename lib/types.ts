export type ActivityType = 'Lesson Plan' | 'Quiz' | 'Question Paper'

export interface TeacherActivity {
  _id?: string
  teacher_id: string
  teacher_name: string
  class: number
  subject: string
  activity_type: ActivityType
  created_at: Date
}

export interface TeacherStats {
  teacher_id: string
  teacher_name: string
  subject: string
  lessonPlans: number
  quizzes: number
  questionPapers: number
  total: number
}

export interface WeeklyData {
  date: string
  lessons: number
  quizzes: number
  questionPapers: number
}

export interface DashboardData {
  teachers: TeacherStats[]
  weeklyTrends: WeeklyData[]
  totalActivities: number
}
