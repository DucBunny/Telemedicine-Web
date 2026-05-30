import ECGRaw from '@/models/nosql/ecgRaw'

/**
 * Create new ECG raw data
 */
export const create = async (data) => {
  return await ECGRaw.create(data)
}

/**
 * Bulk insert ECG raw packets
 */
export const insertMany = async (docs, options = {}) => {
  if (!docs?.length) return []
  return await ECGRaw.insertMany(docs, {
    ordered: false, // Don't wait for all inserts to complete before returning
    ...options,
  })
}

/**
 * Find ECG raw packets by patient and time range
 */
export const findByPatientIdAndTimeRange = async (
  patientId,
  fromDate,
  toDate,
) => {
  return await ECGRaw.find({
    'metadata.patient_id': patientId,
    timestamp: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    },
  })
    .sort({ timestamp: 1 })
    .lean()
}
