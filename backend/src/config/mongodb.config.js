import mongoose from 'mongoose'
import { env } from './env'

const mongo_uri = `mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@${env.MONGODB_CLUSTER}/${env.MONGODB_DB_NAME}`

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongo_uri)
    console.log('MongoDB connected successfully.')
  } catch (error) {
    console.error(`Unable to connect to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export { connectMongoDB }
