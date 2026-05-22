import express from 'express'
import * as alertController from '@/controllers/alert.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'
import { validate } from '@/middlewares/validation.middleware'
import {
  getAlertByIdParamSchema,
  resolveAlertBodySchema,
} from '@/validations/alert.validation'

const router = express.Router()

/**
 * PUT /alerts/:alertId/read — đánh dấu đã đọc (alert_recipients)
 */
router.put(
  '/:alertId/read',
  authorizeRoles(['doctor']),
  validate({ params: getAlertByIdParamSchema }),
  alertController.markAlertAsRead,
)

/**
 * POST /alerts/:alertId/handling — giành quyền xử lý
 */
router.post(
  '/:alertId/handling',
  authorizeRoles(['doctor']),
  validate({ params: getAlertByIdParamSchema }),
  alertController.claimAlertHandling,
)

/**
 * POST /alerts/:alertId/release-handling — kết thúc xử lý, trả về pending
 */
router.post(
  '/:alertId/release-handling',
  authorizeRoles(['doctor']),
  validate({ params: getAlertByIdParamSchema }),
  alertController.releaseAlertHandling,
)

/**
 * POST /alerts/:alertId/resolve — chốt ca + tạo bệnh án
 */
router.post(
  '/:alertId/resolve',
  authorizeRoles(['doctor']),
  validate({
    params: getAlertByIdParamSchema,
    body: resolveAlertBodySchema,
  }),
  alertController.resolveAlert,
)

export default router
