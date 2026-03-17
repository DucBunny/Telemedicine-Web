import { cloudinary, env } from '@/config'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '@/utils/api-error'

/**
 * Upload buffer lên Cloudinary qua upload_stream
 * @param {Buffer} buffer - File buffer từ multer memoryStorage
 * @param {object} options - Cloudinary upload options
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

/**
 * Upload 1 file lên Cloudinary
 * @param {object} file - multer file object (buffer in memory)
 * @param {object} options - tuỳ chọn thêm cho Cloudinary
 */
export const uploadSingle = async (file, options = {}) => {
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded.', 'NO_FILE')
  }

  const isImage = file.mimetype.startsWith('image/')

  // Nếu không có process.env.NODE_ENV, mặc định là 'development' để an toàn
  const environment = env.NODE_ENV || 'development'
  const rootFolder = env.CLOUDINARY_ROOT_FOLDER || 'telemedicine'

  // Lấy tên module từ options truyền vào (vd: 'users', 'doctors', 'posts'), nếu không có thì mặc định là 'general'
  const moduleName = options.moduleName || 'general'

  const typeFolder = isImage ? 'images' : 'documents'
  const folderPath = `${rootFolder}/${environment}/${moduleName}/${typeFolder}`

  const uploadOptions = {
    folder: folderPath,
    resource_type: isImage ? 'image' : 'raw',
    ...(isImage && {
      transformation: [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
      ]
    }),
    // Giữ tên file gốc (không có extension) làm public_id
    use_filename: true,
    unique_filename: true,
    ...options
  }

  const result = await uploadToCloudinary(file.buffer, uploadOptions)

  return {
    url: result.secure_url,
    public_id: result.public_id,
    original_name: file.originalname,
    format: result.format,
    resource_type: result.resource_type,
    size: result.bytes,
    width: result.width || null,
    height: result.height || null
  }
}

/**
 * Upload nhiều file cùng lúc (parallel)
 */
export const uploadMultiple = async (files, options = {}) => {
  if (!files || files.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded.', 'NO_FILE')
  }

  const results = await Promise.all(
    files.map((file) => uploadSingle(file, options))
  )

  return results
}

/**
 * Xoá file trên Cloudinary bằng public_id
 */
export const deleteFile = async (publicId, resourceType = 'image') => {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType
  })

  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to delete file.',
      'DELETE_FAILED'
    )
  }

  return result
}
