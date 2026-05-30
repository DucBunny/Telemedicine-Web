import mongoose from 'mongoose'

/**
 * Lưu trữ đoạn ECG bất thường
 */
const ECGAbnormalStripSchema = new mongoose.Schema(
  {
    patient_id: { type: Number, required: true },
    alert_id: { type: Number, required: true },

    // Trục thời gian của đoạn cắt (VD: 10 giây)
    strip_type: {
      type: String,
      enum: ['trigger', 'last_detected'],
      required: true,
    }, // Mỗi alert sẽ có 2 document riêng: trigger và last_detected
    reference_timestamp: { type: Date, required: true }, // Thời điểm chính xác xảy ra cảnh báo
    window_start: { type: Date, required: true }, // Thời điểm bắt đầu dải sóng (trigger - 5s)
    window_end: { type: Date, required: true }, // Thời điểm kết thúc dải sóng (trigger + 5s)
    duration_seconds: { type: Number, required: true }, // Mặc định là 10 (giây)

    // Dữ liệu sóng đã được flatten thành 1 mảng duy nhất (~1870 phần tử)
    ecg_data: { type: [Number], required: true },

    // Các class bất thường đã xuất hiện trong 10 giây này
    detected_classes: {
      type: [String],
      enum: ['S', 'V', 'F', 'Q'],
      default: [],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  },
)

// Index để query theo alert ID và type
ECGAbnormalStripSchema.index({ alert_id: 1, strip_type: 1 }, { unique: true })

const ECGAbnormalStrip = mongoose.model(
  'ECGAbnormalStrip',
  ECGAbnormalStripSchema,
)

export default ECGAbnormalStrip
