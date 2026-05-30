import mongoose from 'mongoose'

/**
 * Lưu trữ gói ECG thu được từ thiết bị
 */
const ECGRawSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true },
    metadata: {
      patient_id: { type: Number, required: true },
      device_id: { type: Number, required: true },
    },
    ecg_packet: { type: [Number], required: true }, // Lưu trực tiếp mảng 187 điểm của 1 gói tin thu được tại thời điểm đó

    class_inference: {
      type: String,
      enum: ['N', 'S', 'V', 'F', 'Q'],
      required: true,
    }, // 5 class theo MIT-BIH
    is_abnormal: {
      type: Boolean,
      default: false,
    },
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

// Index để worker dễ dàng query các đoạn bất thường
ECGRawSchema.index({ 'metadata.patient_id': 1, is_abnormal: 1, timestamp: 1 })

// Index để query theo patient ID và timestamp
ECGRawSchema.index({ 'metadata.patient_id': 1, timestamp: 1 })

const ECGRaw = mongoose.model('ECGRaw', ECGRawSchema)

export default ECGRaw
