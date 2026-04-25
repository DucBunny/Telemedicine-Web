export interface UpdatePatientProfileBody {
  user?: {
    fullName?: string
    phoneNumber?: string
    email?: string
    status?: string
  }
  dateOfBirth: string
  gender: string
  address: string
  height: number
  weight: number
  bloodType: string
  medicalHistory?: string
}

export interface UpdateDoctorProfileBody {
  user?: {
    fullName?: string
    phoneNumber?: string
    email?: string
  }
  address: string
  degree: string
  experienceYears: number
  bio: string
}

export interface ChangePasswordBody {
  currentPassword: string
  newPassword: string
}
