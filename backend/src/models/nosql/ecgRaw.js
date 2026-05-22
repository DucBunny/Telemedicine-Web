const mongoose = require('mongoose')

const ECGRawSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: {
      patient_id: { type: Number, required: true },
      device_id: { type: Number, required: true },
    },
    ecg_packet: [Number], // Lưu trực tiếp mảng 187 điểm của 1 gói tin thu được tại thời điểm đó
    status: { type: String, enum: ['NORMAL', 'ABNORMAL'], default: 'NORMAL' },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metadata',
      granularity: 'seconds', // Vì thiết bị bắn liên tục theo từng giây
    },
    expireAfterSeconds: 604800, // Tự động xóa sau 7 ngày (TTL Index)
  },
)

const ECGRaw = mongoose.model('ECGRaw', ECGRawSchema)

export default ECGRaw
