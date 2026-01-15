import express from 'express'
import * as userController from '@/controllers/user.controller'
import { authorizeRoles } from '@/middlewares/role.middleware'

const router = express.Router()

router.get('/', authorizeRoles(['admin']), userController.getAllUsers)
router.get('/:id', authorizeRoles(['admin']), userController.getUserById)
router.put(
  '/:id/status',
  authorizeRoles(['admin']),
  userController.updateUserStatus
)
router.delete('/:id', authorizeRoles(['admin']), userController.deleteUser)

export default router
