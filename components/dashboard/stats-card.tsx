interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  variant?: 'default' | 'lessons' | 'quizzes' | 'papers'
}

const variantStyles = {
  default: 'bg-blue-50 border-blue-200',
  lessons: 'bg-emerald-50 border-emerald-200',
  quizzes: 'bg-amber-50 border-amber-200',
  papers: 'bg-purple-50 border-purple-200',
}

const iconStyles = {
  default: 'text-blue-600',
  lessons: 'text-emerald-600',
  quizzes: 'text-amber-600',
  papers: 'text-purple-600',
}

export function StatsCard({
  title,
  value,
  icon,
  variant = 'default',
}: StatsCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 transition-all hover:shadow-md ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconStyles[variant]} bg-white`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
