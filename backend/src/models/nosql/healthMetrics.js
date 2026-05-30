import mongoose from 'mongoose'

/**
 * Lưu trữ metrics (BPM, SpO2) thu được từ thiết bị
 */
const HealthMetricSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: {
      patient_id: { type: Number, required: true },
      device_id: { type: Number, required: true },
    },
    bpm: Number,
    spo2: Number,
    status: { type: String, enum: ['NORMAL', 'ABNORMAL'], default: 'NORMAL' },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'seconds', // Vì thiết bị bắn liên tục theo từng giây
    },
    expireAfterSeconds: 2592000, // Tự động xóa sau 30 ngày (TTL Index)
  },
)

const HealthMetric = mongoose.model('HealthMetric', HealthMetricSchema)

export default HealthMetric
