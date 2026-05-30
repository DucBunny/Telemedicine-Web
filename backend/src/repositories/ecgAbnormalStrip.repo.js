import ECGAbnormalStrip from '@/models/nosql/ecgAbnormalStrips'

/**
 * Find abnormal ECG strip by alert ID
 */
export const findByAlertId = async (alertId) => {
  return await ECGAbnormalStrip.find({ alert_id: alertId })
    .sort({ strip_type: 1 })
    .lean()
}

/**
 * Create or replace abnormal ECG strip by alert ID and type
 */
export const upsertByAlertIdAndType = async (alertId, stripType, data) => {
  return await ECGAbnormalStrip.findOneAndUpdate(
    { alert_id: alertId, strip_type: stripType },
    data,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  )
}
