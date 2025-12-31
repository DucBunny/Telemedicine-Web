import { AuthLayout } from '../components/AuthLayout'
import { RegisterForm } from '../components/RegisterForm'

export const RegisterPage = () => {
  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      subtitle="Bắt đầu hành trình chăm sóc sức khỏe toàn diện cùng MedCare.">
      <RegisterForm />
    </AuthLayout>
  )
}
