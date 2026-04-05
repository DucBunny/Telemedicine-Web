import express from 'express'
import * as uploadController from '@/controllers/upload.controller'
import {
  uploadAny,
  uploadImage,
  uploadDocument,
  handleMulterError
} from '@/middlewares/upload.middleware'

const router = express.Router()

// Middleware to extract moduleName from request body and attach to req.options
const extractModuleName = (req, res, next) => {
  req.options = req.options || {}
  if (req.body.moduleName) {
    req.options.moduleName = req.body.moduleName
  }
  next()
}

// Upload 1 file (tự detect ảnh / tài liệu)
router.post(
  '/single',
  uploadAny.single('file'),
  extractModuleName,
  uploadController.uploadSingle
)

// Upload nhiều file (tối đa 5)
router.post(
  '/multiple',
  uploadAny.array('files', 5),
  extractModuleName,
  uploadController.uploadMultiple
)

// Upload ảnh
router.post(
  '/image',
  uploadImage.single('file'),
  extractModuleName,
  uploadController.uploadSingle
)

// Upload avatar (ảnh đại diện)
router.put('/avatar', uploadImage.single('file'), uploadController.uploadAvatar)

// Upload tài liệu
router.post(
  '/document',
  uploadDocument.single('file'),
  extractModuleName,
  uploadController.uploadSingle
)

// Xoá file
router.delete('/', uploadController.deleteFile)

// Multer error handler
router.use(handleMulterError)

export default router
