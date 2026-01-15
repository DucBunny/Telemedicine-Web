/**
 * Message mặc định khi refresh token thất bại
 */
const handleRefreshTokenError = () =>
  'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'

/**
 * Mapping error codes từ API sang message tiếng Việt
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Auth errors
  UNAUTHORIZED: 'Vui lòng đăng nhập để tiếp tục',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này',

  // Refresh token errors
  REFRESH_TOKEN_NOT_FOUND: handleRefreshTokenError(),
  INVALID_REFRESH_TOKEN: handleRefreshTokenError(),
  REVOKED_REFRESH_TOKEN: handleRefreshTokenError(),
  REFRESH_TOKEN_EXPIRED: handleRefreshTokenError(),

  // Login errors
  INVALID_CREDENTIALS: 'Tài khoản hoặc mật khẩu không đúng',

  // Registration errors
  EMAIL_EXISTS: 'Email đã được sử dụng',
  PHONE_NUMBER_EXISTS: 'Số điện thoại đã được sử dụng',

  // User errors
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  //   TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  //   INVALID_TOKEN: 'Phiên đăng nhập không hợp lệ',

  //   // User errors
  //   USER_NOT_FOUND: 'Không tìm thấy người dùng',
  //   USER_ALREADY_EXISTS: 'Tài khoản đã tồn tại',
  //   EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng',
  //   PHONE_ALREADY_EXISTS: 'Số điện thoại đã được sử dụng',

  // Validation errors
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ',
  //   INVALID_INPUT: 'Thông tin nhập vào không hợp lệ',
  //   REQUIRED_FIELD: 'Vui lòng nhập đầy đủ thông tin',
  //   INVALID_EMAIL: 'Email không đúng định dạng',
  //   INVALID_PHONE: 'Số điện thoại không đúng định dạng',
  //   PASSWORD_TOO_SHORT: 'Mật khẩu quá ngắn',
  //   PASSWORD_TOO_WEAK: 'Mật khẩu quá yếu',

  //   // Resource errors
  //   NOT_FOUND: 'Không tìm thấy dữ liệu',
  //   RESOURCE_NOT_FOUND: 'Không tìm thấy tài nguyên',
  //   ALREADY_EXISTS: 'Dữ liệu đã tồn tại',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Lỗi hệ thống, vui lòng thử lại sau',
  //   DATABASE_ERROR: 'Lỗi cơ sở dữ liệu',
  //   SERVICE_UNAVAILABLE: 'Dịch vụ tạm thời không khả dụng',

  //   // Network errors
  //   NETWORK_ERROR: 'Lỗi kết nối mạng',
  //   TIMEOUT_ERROR: 'Yêu cầu hết thời gian chờ',

  //   // Business logic errors
  //   INSUFFICIENT_PERMISSIONS: 'Bạn không có quyền thực hiện thao tác này',
  //   OPERATION_FAILED: 'Thao tác thất bại',
  //   CONFLICT: 'Xung đột dữ liệu',
}

/**
 * Lấy message tiếng Việt từ error code
 */
export function getVietnameseErrorMessage(
  code?: string,
  defaultMessage?: string,
): string {
  if (!code) return defaultMessage || 'Có lỗi xảy ra'

  return ERROR_MESSAGES[code] || defaultMessage || 'Có lỗi xảy ra'
}
