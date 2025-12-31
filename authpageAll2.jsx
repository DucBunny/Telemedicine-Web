import React, { useState } from 'react'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Activity,
  Heart,
  ShieldCheck,
  Stethoscope
} from 'lucide-react'

// --- COMPONENTS ---

// 1. INPUT FIELD COMPONENT
const InputField = ({ label, type, placeholder, icon: Icon }) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={inputType}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all shadow-sm"
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}

// 2. HERO IMAGE PANEL (Giữ nguyên Gradient BG mới theo yêu cầu)
const HeroPanel = ({ title, subtitle }) => {
  return (
    <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-br from-teal-500 to-emerald-700 text-white p-12 h-full">
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] w-40 h-40 bg-teal-300/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 text-center max-w-md">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl inline-flex mb-6 shadow-lg border border-white/10">
          <Activity size={48} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-teal-50 text-lg leading-relaxed opacity-90">
          {subtitle}
        </p>

        {/* Feature List Mini */}
        <div className="mt-8 flex justify-center space-x-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-2 border border-white/10">
              <Heart size={20} />
            </div>
            <span className="text-xs font-medium">Theo dõi</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-2 border border-white/10">
              <Stethoscope size={20} />
            </div>
            <span className="text-xs font-medium">Tư vấn</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-2 border border-white/10">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-medium">Bảo mật</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- PAGES ---

const LoginPage = ({ onSwitch }) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* LEFT: Login Form */}
      <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center h-full">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại!
            </h1>
            <p className="text-gray-500">
              Vui lòng đăng nhập để tiếp tục theo dõi sức khỏe.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <InputField
              label="Email"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              icon={Lock}
            />

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
              </label>
              {/* Reverted hover color to teal-700 */}
              <a
                href="#"
                className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* REVERTED: Solid Teal Button */}
            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 flex items-center justify-center">
              Đăng nhập <ArrowRight size={18} className="ml-2" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Chưa có tài khoản? {/* Reverted hover color to teal-700 */}
              <button
                onClick={onSwitch}
                className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Hero Image */}
      <HeroPanel
        title="Chăm sóc sức khỏe toàn diện"
        subtitle="Kết nối với bác sĩ chuyên khoa và theo dõi chỉ số sức khỏe của bạn mọi lúc, mọi nơi."
      />
    </div>
  )
}

const RegisterPage = ({ onSwitch }) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* LEFT: Hero Image */}
      <HeroPanel
        title="Gia nhập cộng đồng MediCare"
        subtitle="Tạo tài khoản miễn phí ngay hôm nay để bắt đầu hành trình sống khỏe cùng chuyên gia."
      />

      {/* RIGHT: Register Form */}
      <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center h-full overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-500">Điền thông tin bên dưới để đăng ký.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <InputField
              label="Họ và tên"
              type="text"
              placeholder="Nguyễn Văn A"
              icon={User}
            />
            <InputField
              label="Email"
              type="email"
              placeholder="example@email.com"
              icon={Mail}
            />
            <InputField
              label="Mật khẩu"
              type="password"
              placeholder="Tạo mật khẩu mạnh"
              icon={Lock}
            />
            <InputField
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              icon={ShieldCheck}
            />

            <div className="mb-6">
              <label className="flex items-start mt-2">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {/* Reverted hover color to teal-700 */}
                  Tôi đồng ý với{' '}
                  <a
                    href="#"
                    className="text-teal-600 underline hover:text-teal-700">
                    Điều khoản dịch vụ
                  </a>{' '}
                  và{' '}
                  <a
                    href="#"
                    className="text-teal-600 underline hover:text-teal-700">
                    Chính sách bảo mật
                  </a>
                  .
                </span>
              </label>
            </div>

            {/* REVERTED: Solid Teal Button */}
            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200">
              Đăng ký tài khoản
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Đã có tài khoản? {/* Reverted hover color to teal-700 */}
              <button
                onClick={onSwitch}
                className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- MAIN WRAPPER ---

export default function AuthPage() {
  const [currentPage, setCurrentPage] = useState('login')

  return (
    <>
      {currentPage === 'login' ? (
        <LoginPage onSwitch={() => setCurrentPage('register')} />
      ) : (
        <RegisterPage onSwitch={() => setCurrentPage('login')} />
      )}
    </>
  )
}
