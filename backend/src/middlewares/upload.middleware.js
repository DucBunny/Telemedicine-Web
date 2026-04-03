import multer from 'multer'
import ApiError from '@/utils/api-error'

// File MIME types
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain'
]
const ALL_ALLOWED_MIMES = [...IMAGE_MIMES, ...DOCUMENT_MIMES]

// Multer storage
const storage = multer.memoryStorage()

/**
 * Upload chung (ảnh + tài liệu), max 10MB
 */
export const uploadAny = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALL_ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Định dạng file không được hỗ trợ.'), false)
    }
  }
})

/**
 * Upload ảnh, max 5MB
 */
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (IMAGE_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp).'), false)
    }
  }
})

/**
 * Upload tài liệu, max 10MB
 */
export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (DOCUMENT_MIMES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Chỉ chấp nhận tài liệu (pdf, doc, docx, xls, xlsx, csv, txt).'
        ),
        false
      )
    }
  }
})

/**
 * Multer error handler middleware
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'File too large. Maximum allowed size is 10MB for documents and 5MB for images.',
        'FILE_TOO_LARGE'
      )
    }

    throw new ApiError(StatusCodes.BAD_REQUEST, err.message, 'UPLOAD_ERROR')
  }

  if (err) {
    throw new ApiError(StatusCodes.BAD_REQUEST, err.message, 'UPLOAD_ERROR')
  }

  next()
}
