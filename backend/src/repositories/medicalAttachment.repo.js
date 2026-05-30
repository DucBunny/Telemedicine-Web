import { MedicalAttachment } from '@/models/sql/index'

/**
 * Find cached auto ECG report by medical record or alert.
 */
export const findAutoEcgReport = async ({
  sourceType,
  medicalRecordId,
  alertId,
}) => {
  const where =
    sourceType === 'medical_record'
      ? { medicalRecordId }
      : sourceType === 'alert'
        ? { alertId }
        : null

  if (!where) return null

  return await MedicalAttachment.findOne({
    where: {
      category: 'auto_ecg_report',
      ...where,
    },
    order: [['uploadedAt', 'DESC']],
  })
}

/**
 * Create or update the cached auto ECG report attachment.
 */
export const saveAutoEcgReport = async ({
  sourceType,
  medicalRecordId = null,
  alertId = null,
  fileName,
  fileUrl,
  fileType = 'pdf',
}) => {
  const existing = await findAutoEcgReport({
    sourceType,
    medicalRecordId,
    alertId,
  })

  if (existing) {
    return await existing.update({
      medicalRecordId:
        sourceType === 'medical_record'
          ? (medicalRecordId ?? existing.medicalRecordId)
          : null,
      alertId: sourceType === 'alert' ? (alertId ?? existing.alertId) : null,
      fileName,
      fileUrl,
      fileType,
      category: 'auto_ecg_report',
    })
  }

  return await MedicalAttachment.create({
    medicalRecordId: sourceType === 'medical_record' ? medicalRecordId : null,
    alertId: sourceType === 'alert' ? alertId : null,
    fileName,
    fileUrl,
    fileType,
    category: 'auto_ecg_report',
  })
}
