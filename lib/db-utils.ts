import { getDatabase } from './mongodb'
import { TeacherActivity, TeacherStats, WeeklyData } from './types'

export async function seedDatabase(activities: TeacherActivity[]) {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  // Check for duplicates before inserting
  const existingCount = await collection.countDocuments()
  if (existingCount > 0) {
    return { success: true, message: 'Database already seeded' }
  }

  // Create unique index to handle duplicates gracefully
  await collection.createIndex({
    teacher_id: 1,
    teacher_name: 1,
    subject: 1,
    activity_type: 1,
    created_at: 1,
  })

  const result = await collection.insertMany(activities)
  return { success: true, insertedCount: result.insertedCount }
}

export async function getTeacherStats(): Promise<TeacherStats[]> {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  const stats = await collection.aggregate<TeacherStats>([
    {
      $group: {
        _id: {
          teacher_id: '$teacher_id',
          teacher_name: '$teacher_name',
          subject: '$subject',
        },
        lessonPlans: {
          $sum: {
            $cond: [{ $eq: ['$activity_type', 'Lesson Plan'] }, 1, 0],
          },
        },
        quizzes: {
          $sum: {
            $cond: [{ $eq: ['$activity_type', 'Quiz'] }, 1, 0],
          },
        },
        questionPapers: {
          $sum: {
            $cond: [{ $eq: ['$activity_type', 'Question Paper'] }, 1, 0],
          },
        },
      },
    },
    {
      $addFields: {
        teacher_id: '$_id.teacher_id',
        teacher_name: '$_id.teacher_name',
        subject: '$_id.subject',
        total: {
          $add: ['$lessonPlans', '$quizzes', '$questionPapers'],
        },
      },
    },
    {
      $project: {
        _id: 0,
        teacher_id: 1,
        teacher_name: 1,
        subject: 1,
        lessonPlans: 1,
        quizzes: 1,
        questionPapers: 1,
        total: 1,
      },
    },
    {
      $sort: { teacher_name: 1 },
    },
  ]).toArray()

  return stats
}

export async function getWeeklyTrends(): Promise<WeeklyData[]> {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  const trends = await collection.aggregate<WeeklyData>([
    {
      $group: {
        _id: {
          year: { $isoDayOfWeek: '$created_at' },
          week: { $isoWeek: '$created_at' },
          activity: '$activity_type',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          week: '$_id.week',
        },
        lessons: {
          $sum: {
            $cond: [{ $eq: ['$_id.activity', 'Lesson Plan'] }, '$count', 0],
          },
        },
        quizzes: {
          $sum: {
            $cond: [{ $eq: ['$_id.activity', 'Quiz'] }, '$count', 0],
          },
        },
        questionPapers: {
          $sum: {
            $cond: [{ $eq: ['$_id.activity', 'Question Paper'] }, '$count', 0],
          },
        },
      },
    },
    {
      $sort: { '_id.week': 1 },
    },
  ]).toArray()

  // Format dates for display
  return trends.map((item) => ({
    date: `Week ${item._id.week}`,
    lessons: item.lessons,
    quizzes: item.quizzes,
    questionPapers: item.questionPapers,
  }))
}

export async function getTrendsByGranularity(
  granularity: 'week' | 'month' | 'year'
): Promise<WeeklyData[]> {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  // Use $dateTrunc to bucket by week/month/year
  const trends = await collection
    .aggregate<WeeklyData>([
      {
        $group: {
          _id: {
            $dateTrunc: { date: '$created_at', unit: granularity },
          },
          lessons: {
            $sum: {
              $cond: [{ $eq: ['$activity_type', 'Lesson Plan'] }, 1, 0],
            },
          },
          quizzes: {
            $sum: {
              $cond: [{ $eq: ['$activity_type', 'Quiz'] }, 1, 0],
            },
          },
          questionPapers: {
            $sum: {
              $cond: [{ $eq: ['$activity_type', 'Question Paper'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { '_id': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: granularity === 'year' ? '%Y' : '%Y-%m-%d',
              date: '$_id',
            },
          },
          lessons: 1,
          quizzes: 1,
          questionPapers: 1,
        },
      },
    ])
    .toArray()

  return trends
}

export async function getTeacherDetails(
  teacherId: string
): Promise<TeacherActivity[]> {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  const activities = await collection
    .find({ teacher_id: teacherId })
    .sort({ created_at: -1 })
    .toArray()

  return activities
}

export async function getTotalActivities(): Promise<number> {
  const db = await getDatabase()
  const collection = db.collection<TeacherActivity>('activities')

  return await collection.countDocuments()
}
