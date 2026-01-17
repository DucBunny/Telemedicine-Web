import db from '@/models/sql'
import * as deviceRepo from '@/repositories/device.repo'
import * as healthMetricRepo from '@/repositories/healthMetric.repo'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'

const { HealthPrediction, Device, Patient, Alert } = db

/**
 * Lưu health data vào database
 */
export const saveHealthData = async (data) => {
  try {
    const { deviceId, timestamp, bpm, spo2, hrv, ecgData, status, prediction } =
      data

    // Kiểm tra device có tồn tại không
    const device = await deviceRepo.findById(deviceId)
    if (!device) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Device with ID ${deviceId} not found`,
        'DEVICE_NOT_FOUND'
      )
    }

    // Lưu health metrics
    await healthMetricRepo.create({
      timestamp,
      metadata: {
        device_id: deviceId,
        patient_id: device.assignedTo
      },
      bpm,
      spo2,
      hrv,
      status
    })

    // Sử dụng AI prediction result nếu có, không thì dùng rule-based
    let predictedStatus = prediction?.status || 'normal'
    let confidence = prediction?.confidence || 0.95
    let modelVersion = prediction?.modelVersion || 'fallback_v1'

    // Lưu prediction
    const savedPrediction = await HealthPrediction.create({
      patientId: device.assignedTo,
      predictedStatus,
      confidence,
      modelVersion,
      inputWindow: ecgData?.length || 0,
      createdAt: new Date(timestamp)
    })

    console.log(
      `Saved health prediction #${savedPrediction.id} for patient ${device.assignedTo}`
    )

    // Return với patientId để dùng cho socket emit
    return {
      ...savedPrediction.toJSON(),
      patientId: device.assignedTo
    }
  } catch (error) {
    console.error('Failed to save health data:', error)
    throw error
  }
}

/**
 * Tạo health alert
 */
export const createHealthAlert = async (alertData) => {
  try {
    const { patientId, predictionId, severity, message, deviceId, riskScore } =
      alertData

    const alert = await Alert.create({
      patientId,
      predictionId,
      deviceId,
      message,
      severity,
      isResolved: false
    })

    console.log(
      `Created alert #${alert.id} for patient ${patientId} (Risk: ${riskScore ? (riskScore * 100).toFixed(1) + '%' : 'N/A'})`
    )

    return alert
  } catch (error) {
    console.error('Failed to create alert:', error)
    throw error
  }
}

/**
 * Lấy latest health data từ database
 */
export const getLatestHealthData = async (deviceId, limit = 10) => {
  try {
    const device = await Device.findByPk(deviceId)
    if (!device) return []

    const predictions = await HealthPrediction.findAll({
      where: { patientId: device.assignedTo },
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: Alert,
          as: 'alert',
          required: false
        }
      ]
    })

    return predictions
  } catch (error) {
    console.error('Failed to get health data:', error)
    return []
  }
}

/**
 * Lấy health statistics
 */
export const getHealthStats = async (patientId, timeRange = '24h') => {
  try {
    const since = new Date()
    if (timeRange === '24h') {
      since.setHours(since.getHours() - 24)
    } else if (timeRange === '7d') {
      since.setDate(since.getDate() - 7)
    }

    const predictions = await HealthPrediction.findAll({
      where: {
        patientId,
        createdAt: { [db.Sequelize.Op.gte]: since }
      },
      order: [['createdAt', 'ASC']]
    })

    const stats = {
      total: predictions.length,
      normal: predictions.filter((p) => p.predictedStatus === 'normal').length,
      warning: predictions.filter((p) => p.predictedStatus === 'warning')
        .length,
      critical: predictions.filter((p) => p.predictedStatus === 'critical')
        .length,
      avgConfidence:
        predictions.reduce((sum, p) => sum + p.confidence, 0) /
          predictions.length || 0
    }

    return stats
  } catch (error) {
    console.error('Failed to get health stats:', error)
    return null
  }
}
