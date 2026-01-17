import ECGRaw from '@/models/nosql/ecgRaw'

/**
 * Create new ECG raw data
 */
export const create = async (data) => {
  return await ECGRaw.create(data)
}

/**
 * Update or create ECG raw data by device ID and bucket start time
 */
export const updateOrCreateByDeviceIdAndBucket = async (
  deviceId,
  bucketStartTime,
  { patientId, timestamp, ecg, mode }
) => {
  return await ECGRaw.findOneAndUpdate(
    {
      device_id: deviceId,
      bucket_start_time: bucketStartTime
    },
    {
      // Chỉ set khi tạo mới
      $setOnInsert: {
        patient_id: patientId,
        bucket_start_time: bucketStartTime
      },
      // Thêm mẫu ECG mới vào mảng samples
      $push: {
        samples: {
          ts: timestamp,
          val: ecg,
          status: mode
        }
      },
      // Tăng biến đếm số mẫu
      $inc: {
        count: 1
      }
    },
    {
      upsert: true,
      new: true
    }
  )
}

/**
 * Find ECG raw data by device ID and bucket range
 */
export const findByDeviceIdAndBucketRange = async (
  deviceId,
  fromDate,
  toDate
) => {
  return await ECGRaw.find({
    device_id: deviceId,
    bucket_start_time: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    }
  })
    .sort({ bucket_start_time: 1 })
    .lean()
}
