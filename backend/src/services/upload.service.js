import { cloudinary, env } from '@/config'
import { StatusCodes } from 'http-status-codes'
import ApiError from '@/utils/api-error'
import * as userRepo from '@/repositories/user.repo'

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
 * Trích xuất public_id từ Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null} public_id hoặc null nếu không phải Cloudinary URL
 */
const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null

  try {
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/
    const match = url.match(regex)
    return match ? match[1] : null
  } catch {
    return null
  }
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

  // Lấy tên module từ options truyền vào (vd: 'users', 'doctors', 'posts', 'chats/{conversationId}')
  // Nếu không có thì mặc định là 'general'
  const moduleName = options.moduleName || 'general'

  const typeFolder = isImage ? 'images' : 'documents'

  // Support nested module paths (e.g., 'chats/{conversationId}')
  // Folder structure: rootFolder/environment/moduleName/typeFolder
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
 * Upload avatar và cập nhật vào DB
 * - Upload ảnh mới lên Cloudinary
 * - Xóa avatar cũ trên Cloudinary (nếu có)
 * - Cập nhật URL mới vào User table
 */
export const uploadAvatar = async (userId, file) => {
  if (!file)
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded.', 'NO_FILE')

  // Lấy thông tin user hiện tại để có avatar cũ
  const currentUser = await userRepo.findById(userId)
  if (!currentUser)
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      'User not found',
      'USER_NOT_FOUND'
    )

  const oldAvatarUrl = currentUser.avatar
  const oldPublicId = extractPublicIdFromUrl(oldAvatarUrl)

  // Upload avatar mới
  const result = await uploadSingle(file, {
    moduleName: 'avatars',
    transformation: [
      {
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto'
      }
    ]
  })

  // Cập nhật avatar mới vào DB
  await userRepo.update(userId, { avatar: result.url })

  // Xóa avatar cũ trên Cloudinary (nếu có và là Cloudinary URL)
  if (oldPublicId) {
    try {
      await deleteFile(oldPublicId, 'image')
    } catch (error) {
      // Log lỗi nhưng không throw - avatar mới đã được lưu thành công
      console.error('Failed to delete old avatar:', error.message)
    }
  }

  return result
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
