import 'dotenv/config'

export const env = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Application timezone (IANA format) where the clinic operates
  APP_TIME_ZONE: process.env.APP_TIME_ZONE || 'Asia/Ho_Chi_Minh',

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
  MONGODB_HOST: process.env.MONGODB_HOST || 'localhost',
  MONGODB_PORT: process.env.MONGODB_PORT || 27017,

  // Cloudinary configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_ROOT_FOLDER: process.env.CLOUDINARY_ROOT_FOLDER,

  // JWT configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',

  // RabbitMQ configuration
  RABBITMQ_URL: process.env.RABBITMQ_URL, // AMQP Cloud or other managed RabbitMQ URL
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || 'localhost',
  RABBITMQ_PORT: process.env.RABBITMQ_PORT || 5672,

  // MQTT configuration
  MQTT_BROKER: process.env.MQTT_BROKER || 'mqtt://broker.emqx.io',
  MQTT_PORT: process.env.MQTT_PORT || 1883,
  MQTT_TOPIC: process.env.MQTT_TOPIC,

  // SMTP (nodemailer) configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'MedCare <noreply@medcare.com>',

  // Redis configuration
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_USERNAME: process.env.REDIS_USERNAME || 'default',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_TLS: process.env.REDIS_TLS === 'true',

  // ZEGOCLOUD configuration
  ZEGO_APP_ID: process.env.ZEGO_APP_ID,
  ZEGO_SERVER_SECRET: process.env.ZEGO_SERVER_SECRET,

  // Frontend URL
  BASE_URL_FRONTEND: process.env.BASE_URL_FRONTEND || 'http://localhost:3000',

  /*
   * Application configuration
   */
  // Kích thước gói ECG (187 điểm)
  ECG_PACKET_SIZE: Number(process.env.ECG_PACKET_SIZE ?? 187),
  // Thời gian cache throttle alert (30 phút)
  ALERT_THROTTLE_TTL_SEC: Number(process.env.ALERT_THROTTLE_TTL_SEC ?? 30 * 60), // 30 minutes

  // Giờ sau khi ca khám kết thúc (scheduledAt + duration): min để BS được sửa trạng thái (mặc định 0 = ngay sau ca).
  APPOINTMENT_DOCTOR_STATUS_EDIT_MIN_HOURS_AFTER_END: Number(
    process.env.APPOINTMENT_DOCTOR_STATUS_EDIT_MIN_HOURS_AFTER_END ?? 0,
  ),
  // Tối đa sau khi ca kết thúc (giờ). Chặn sửa sau thời điểm này.
  APPOINTMENT_DOCTOR_STATUS_EDIT_MAX_HOURS_AFTER_END: Number(
    process.env.APPOINTMENT_DOCTOR_STATUS_EDIT_MAX_HOURS_AFTER_END ?? 48,
  ),
  // Không cho xác nhận lịch pending nếu còn ít hơn N phút trước giờ hẹn.
  APPOINTMENT_CONFIRM_LOCK_MINUTES_BEFORE: Number(
    process.env.APPOINTMENT_CONFIRM_LOCK_MINUTES_BEFORE ?? 15,
  ),

  // Cron expression (node-cron): quét pending quá giờ để auto-cancel (mỗi phút)
  APPOINTMENT_PENDING_EXPIRE_CRON:
    process.env.APPOINTMENT_PENDING_EXPIRE_CRON || '* * * * *',

  // Cron expression (node-cron): lưu ECG raw packets (mỗi 5 giây)
  ECG_RAW_FLUSH_CRON: process.env.ECG_RAW_FLUSH_CRON || '*/5 * * * * *',
  // Số lượng ECG raw packets flush mỗi lần
  ECG_RAW_FLUSH_BATCH_SIZE: Number(process.env.ECG_RAW_FLUSH_BATCH_SIZE ?? 300),
  // Cron expression (node-cron): auto-resolve stale alerts (mỗi giờ)
  ALERT_AUTO_RESOLVE_CRON: process.env.ALERT_AUTO_RESOLVE_CRON || '0 * * * *',
  // Thời gian auto-resolve stale alerts (mặc định 24 giờ)
  ALERT_AUTO_RESOLVE_AFTER_HOURS: Number(
    process.env.ALERT_AUTO_RESOLVE_AFTER_HOURS ?? 24,
  ),
  // User ID của bot system dùng để auto-resolve alert
  SYSTEM_BOT_DOCTOR_ID: Number(process.env.SYSTEM_BOT_DOCTOR_ID ?? 2),
}
