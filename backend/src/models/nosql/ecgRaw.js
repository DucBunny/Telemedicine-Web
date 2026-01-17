const mongoose = require('mongoose')

const ECGRawSchema = new mongoose.Schema(
  {
    device_id: { type: String, required: true, index: true },
    patient_id: { type: Number, required: true, index: true },
    bucket_start_time: { type: Date, required: true, index: true },
    count: { type: Number, default: 0 },
    samples: [
      {
        ts: { type: Date }, // Timestamp của mẫu ECG
        val: [Number], // Mảng 187 điểm ECG
        status: String // 'NORMAL', 'DANGER'
      }
    ]
  },
  {
    timestamps: true
  }
)

// Compound Index để tối ưu truy vấn theo device và thời gian
ECGRawSchema.index({ device_id: 1, bucket_start_time: -1 })

// TTL Index: tự động xóa dữ liệu sau 7 ngày
ECGRawSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 })

const ECGRaw = mongoose.model('ECGRaw', ECGRawSchema)

export default ECGRaw
