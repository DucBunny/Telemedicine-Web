import { StatusCodes } from 'http-status-codes'
import * as uploadService from '@/services/upload.service'

/**
 * Upload single file
 * POST /uploads/single | /uploads/image | /uploads/document
 */
export const uploadSingle = async (req, res, next) => {
  try {
    const result = await uploadService.uploadSingle(req.file)

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Upload multiple files (tối đa 5)
 * POST /uploads/multiple
 */
export const uploadMultiple = async (req, res, next) => {
  try {
    const results = await uploadService.uploadMultiple(req.files)

    res.status(StatusCodes.OK).json({
      success: true,
      data: results
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xoá file trên Cloudinary
 * DELETE /uploads
 * Body: { public_id, resource_type? }
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { public_id, resource_type } = req.body
    await uploadService.deleteFile(public_id, resource_type || 'image')

    res.status(StatusCodes.OK).json({
      success: true,
      data: { message: 'Xoá file thành công.' }
    })
  } catch (error) {
    next(error)
  }
}
