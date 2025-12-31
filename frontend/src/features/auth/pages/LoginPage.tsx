import { AuthLayout } from '../components/AuthLayout'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Nhập thông tin đăng nhập để truy cập hệ thống.">
      <LoginForm />
    </AuthLayout>
  )
}
