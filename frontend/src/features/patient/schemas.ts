import { z } from 'zod'

const avatar = z.string().url('URL ảnh không hợp lệ')

const dateOfBirth = z
  .union([z.string(), z.date()])
  .transform((val) => {
    if (val instanceof Date) {
      // Nếu đã là Date, chuyển thành chuỗi 'YYYY-MM-DD'
      return val.toISOString().split('T')[0]
    }
    return val
  })
  .refine((val) => val && val.length > 0, 'Vui lòng nhập ngày sinh')

const gender = z.enum(['male', 'female', 'other'], 'Vui lòng chọn giới tính')

const bloodType = z.enum(
  ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-', 'unknown'],
  'Vui lòng chọn nhóm máu',
)

const height = z
  .string()
  .min(1, 'Vui lòng nhập chiều cao')
  .transform((val) => Number(val))
  .pipe(
    z
      .number()
      .min(30, 'Chiều cao phải lớn hơn 30cm')
      .max(300, 'Chiều cao phải nhỏ hơn 300cm'),
  )

const weight = z
  .string()
  .min(1, 'Vui lòng nhập cân nặng')
  .transform((val) => Number(val))
  .pipe(
    z
      .number()
      .min(1, 'Cân nặng phải lớn hơn 1kg')
      .max(500, 'Cân nặng phải nhỏ hơn 500kg'),
  )

const medicalHistory = z
  .string()
  .max(500, 'Tiền sử bệnh lý không được vượt quá 500 ký tự')

const address = z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự')

export const completeProfileSchema = z.object({
  dateOfBirth,
  gender,
  bloodType,
  height,
  weight,
  medicalHistory,
  address,
})
