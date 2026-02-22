import { MongoClient, Db } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
  throw new Error('Please define MONGODB_URI in environment variables')
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(mongoUri)

  await client.connect()
  const db = client.db('teacher_insights')

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}
