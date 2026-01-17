const mongoose = require('mongoose')

const HealthMetricSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: {
      patient_id: Number,
      device_id: String
    },
    bpm: Number,
    spo2: Number,
    hrv: Number,
    status: String // 'NORMAL', 'DANGER'
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'seconds'
    },
    expireAfterSeconds: 2592000 // Tự động xóa sau 30 ngày (TTL Index)
  }
)

const HealthMetric = mongoose.model('HealthMetric', HealthMetricSchema)

export default HealthMetric
