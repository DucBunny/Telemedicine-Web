import { HeroPanel } from '../components/HeroPanel'
import { RegisterForm } from '../components/RegisterForm'
import '../styles/styles.css'

export const RegisterPage = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-white md:grid-cols-2">
      <HeroPanel
        title="Gia nhập cộng đồng MediCare"
        subtitle="Tạo tài khoản miễn phí ngay hôm nay để bắt đầu hành trình sống khỏe cùng chuyên gia."
      />
      <div className="flex h-full flex-col justify-center overflow-y-auto p-8 md:p-16 lg:p-24">
        <RegisterForm />
      </div>
    </div>
  )
}
