# Teacher Insights Dashboard

A production-grade analytics platform for school administrators to monitor teacher performance and activity metrics. Built with Next.js, TypeScript, and MongoDB.

## Features

- **Dashboard Overview**: Real-time statistics on lessons, quizzes, and assessments
- **Weekly Trends**: Visual analytics showing activity patterns across weeks
- **Teacher Performance**: Detailed per-teacher analysis with activity breakdown
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Duplicate Handling**: Graceful handling of duplicate entries with MongoDB indexing

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: MongoDB
- **API**: Next.js Route Handlers
- **Deployment**: Vercel-ready

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── dashboard/          # Main dashboard data endpoint
│   │   ├── seed/               # Database seeding endpoint
│   │   └── teachers/[id]/      # Per-teacher details endpoint
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── components/
│   └── dashboard/
│       ├── main-dashboard.tsx  # Main dashboard component
│       ├── stats-card.tsx      # Statistics card component
│       ├── weekly-chart.tsx    # Weekly trends chart
│       ├── teachers-table.tsx  # Teachers list table
│       └── teacher-details.tsx # Detailed teacher view
├── lib/
│   ├── mongodb.ts              # MongoDB connection logic
│   ├── db-utils.ts             # Database operations
│   ├── parse-data.ts           # Data parsing utilities
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # General utilities
└── package.json                # Dependencies
```

## Architecture Decisions

### Database Layer
- **Connection Pooling**: Implements connection caching to reuse MongoDB connections across requests
- **Aggregation Pipeline**: Uses MongoDB aggregation for efficient data summarization
- **Indexing**: Creates composite indexes on frequently queried fields to prevent duplicate entries

### API Design
- **RESTful Endpoints**: Clean separation of concerns with dedicated endpoints
- **Caching Strategy**: Uses Next.js revalidation for 1-hour cache on dashboard data
- **Error Handling**: Comprehensive error handling with meaningful messages

### Frontend Architecture
- **Client-Server Components**: Mix of Server Components (data fetching) and Client Components (interactivity)
- **Data Fetching**: SWR-like patterns for state management without external libraries
- **Component Composition**: Small, focused components for better maintainability

### Data Processing
- **Duplicate Handling**: MongoDB unique indexes prevent duplicate entries at the database level
- **Activity Grouping**: Aggregation pipeline groups activities by teacher and type
- **Weekly Aggregation**: Date-based grouping for trend analysis

## Setup Instructions

### Prerequisites
- Node.js 18+ (with pnpm or npm)
- MongoDB Atlas account or local MongoDB instance
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <your-repo>
cd teacher-insights-dashboard
pnpm install
```

2. **Configure environment variables**:
Create a `.env.local` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/teacher_insights?retryWrites=true&w=majority
```

Get your MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

3. **Run development server**:
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

4. **Database seeding**:
The database is automatically seeded on first dashboard load. The seed endpoint:
- Parses the provided dataset
- Inserts activities into MongoDB
- Handles duplicates gracefully with unique indexes

## API Endpoints

### GET /api/dashboard
Returns aggregated dashboard statistics including:
- Teacher activity statistics
- Weekly activity trends
- Total activity count

Response:
```json
{
  "success": true,
  "data": {
    "teachers": [
      {
        "teacher_id": "T001",
        "teacher_name": "Anita Sharma",
        "subject": "Mathematics",
        "lessonPlans": 8,
        "quizzes": 2,
        "questionPapers": 5,
        "total": 15
      }
    ],
    "weeklyTrends": [
      {
        "date": "Week 7",
        "lessons": 12,
        "quizzes": 8,
        "questionPapers": 10
      }
    ],
    "totalActivities": 142
  }
}
```

### GET /api/teachers/[id]
Returns detailed activity list for a specific teacher:
- All activities created by the teacher
- Sorted by creation date (newest first)
- Includes class, subject, and timestamps

### POST /api/seed
Initializes database with provided dataset:
- Parses tab-separated dataset
- Creates MongoDB collections
- Applies unique indexes

## Future Scalability Improvements

### Short-term
- **Search & Filtering**: Add full-text search across teacher names and subjects
- **Date Range Filters**: Allow custom date ranges for trend analysis
- **Export Functionality**: CSV/PDF export of reports
- **Real-time Updates**: WebSocket integration for live activity feeds

### Medium-term
- **Authentication Layer**: User roles (admin, principal, head of department)
- **Advanced Analytics**: Predictive analytics for teacher performance
- **Comparison Tools**: Side-by-side teacher performance comparison
- **Notifications**: Alert system for significant activity changes

### Long-term
- **Scalability**: Implement read replicas for high-volume queries
- **Caching Layer**: Redis integration for frequently accessed data
- **Multi-tenant**: Support multiple schools in single instance
- **AI Insights**: ML-based recommendations and anomaly detection
- **Microservices**: Separate analytics service for complex computations

## Performance Optimization

- **Component Memoization**: Prevents unnecessary re-renders
- **Database Indexing**: Composite indexes on common query patterns
- **Connection Pooling**: Reuses MongoDB connections
- **Incremental Static Regeneration**: Cache updates every hour
- **Lazy Loading**: Components load data only when needed

## Data Model

### Activities Collection
```typescript
{
  teacher_id: string
  teacher_name: string
  class: number
  subject: string
  activity_type: 'Lesson Plan' | 'Quiz' | 'Question Paper'
  created_at: Date
}
```

### Unique Index
Composite index on `(teacher_id, teacher_name, subject, activity_type, created_at)` prevents duplicate entries.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
- Visit [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Add `MONGODB_URI` environment variable

3. **Deploy**:
- Click Deploy
- Dashboard will be live at `your-project.vercel.app`

## Development Practices

### Code Quality
- **TypeScript**: Full type safety across the application
- **Error Handling**: Try-catch blocks with meaningful error messages
- **Comments**: Clear comments for complex logic
- **Naming**: Descriptive function and variable names

### Testing
To add tests:
```bash
pnpm add -D vitest @testing-library/react
```

Example test structure:
```typescript
describe('StatsCard', () => {
  it('renders title and value', () => {
    render(<StatsCard title="Test" value={42} icon={<Icon />} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist includes your current IP
- Ensure database name in connection string matches

### Data Not Loading
- Check browser console for API errors
- Verify MongoDB connection with: `mongosh <MONGODB_URI>`
- Clear browser cache and refresh

### Styling Issues
- Run `pnpm install` to ensure all dependencies are installed
- Check that `globals.css` is imported in `layout.tsx`

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact the development team.
