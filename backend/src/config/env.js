import 'dotenv/config'

export const env = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // TiDB Cloud configuration
  DB_PORT: process.env.DB_PORT || 3306,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'telemedicine_db',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',

  // MongoDB Atlas configuration
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'telemedicine_nosql',
  MONGODB_USER: process.env.MONGODB_USER || '',
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || '',
  MONGODB_CLUSTER: process.env.MONGODB_CLUSTER || '',

  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

  // RabbitMQ configuration
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',

  // MQTT configuration
  MQTT_BROKER: process.env.MQTT_BROKER || 'mqtt://broker.emqx.io',
  MQTT_PORT: process.env.MQTT_PORT || 1883,
  MQTT_TOPIC: process.env.MQTT_TOPIC || 'health/+/telemetry',

  // Redis configuration
  REDIS_URL: process.env.REDIS_URL,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  // AI Service configuration
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:5000',

  // Frontend URL
  BASE_URL_FRONTEND: process.env.BASE_URL_FRONTEND || 'http://localhost:3000'
}
