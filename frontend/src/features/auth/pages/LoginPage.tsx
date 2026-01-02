import { HeroPanel } from '../components/HeroPanel'
import { LoginForm } from '../components/LoginForm'
import '../styles/styles.css'

export const LoginPage = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-white md:grid-cols-2">
      <div className="flex h-full flex-col justify-center p-8 md:p-16 lg:p-24">
        <LoginForm />
      </div>
      <HeroPanel
        title="Chăm sóc sức khỏe toàn diện"
        subtitle="Kết nối với bác sĩ chuyên khoa và theo dõi chỉ số sức khỏe của bạn mọi lúc, mọi nơi."
      />
    </div>
  )
}
