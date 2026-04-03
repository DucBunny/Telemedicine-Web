export interface UpdatePatientProfileBody {
  user?: {
    fullName: string
    phoneNumber: string
    email: string
  }
  dateOfBirth: string
  gender: string
  address: string
  height: number
  weight: number
  bloodType: string
  medicalHistory?: string
}

export interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
}
