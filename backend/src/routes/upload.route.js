import express from 'express'
import * as uploadController from '@/controllers/upload.controller'
import {
  uploadAny,
  uploadImage,
  uploadDocument,
  handleMulterError
} from '@/middlewares/upload.middleware'

const router = express.Router()

// Upload 1 file (tự detect ảnh / tài liệu)
router.post('/single', uploadAny.single('file'), uploadController.uploadSingle)

// Upload nhiều file (tối đa 5)
router.post(
  '/multiple',
  uploadAny.array('files', 5),
  uploadController.uploadMultiple
)

// Upload ảnh
router.post('/image', uploadImage.single('file'), uploadController.uploadSingle)

// Upload tài liệu
router.post(
  '/document',
  uploadDocument.single('file'),
  uploadController.uploadSingle
)

// Xoá file
router.delete('/', uploadController.deleteFile)

// Multer error handler
router.use(handleMulterError)

export default router
