import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  Stethoscope,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

type AuthMode = 'login' | 'signup'

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu xác nhận không khớp',
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    toast({
      title: mode === 'login' ? 'Đăng nhập thành công' : 'Đăng ký thành công',
      description:
        mode === 'login'
          ? 'Chào mừng bạn quay trở lại!'
          : 'Tài khoản của bạn đã được tạo thành công'
    })
    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-blue-500 lg:flex lg:flex-col lg:justify-between">
        {/* Background decorations */}
        <div className="animate-blob absolute -top-40 -left-40 h-80 w-80 rounded-full bg-teal-400/30 blur-3xl" />
        <div
          className="animate-blob absolute right-10 bottom-20 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="animate-blob absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-teal-300/20 blur-2xl"
          style={{ animationDelay: '4s' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center p-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <span className="font-display text-3xl font-bold text-white">
              MedCare
            </span>
          </div>

          <h1 className="font-display mb-6 text-4xl leading-tight font-extrabold text-white xl:text-5xl">
            Bác sĩ riêng
            <br />
            <span className="text-teal-100">Ngay tại nhà bạn</span>
          </h1>

          <p className="mb-10 max-w-md text-lg leading-relaxed text-teal-50/90">
            Theo dõi sức khỏe tim mạch 24/7 với thiết bị IoT nhỏ gọn. Kết nối
            trực tuyến với đội ngũ chuyên gia y tế hàng đầu.
          </p>

          {/* Feature cards */}
          <div className="space-y-4">
            <FeatureCard
              icon={Heart}
              title="Theo dõi sức khỏe 24/7"
              description="Dữ liệu nhịp tim, SpO2 theo thời gian thực"
            />
            <FeatureCard
              icon={Stethoscope}
              title="Tư vấn bác sĩ online"
              description="Đặt lịch khám và video call với chuyên gia"
            />
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 p-12">
          <div className="flex items-center gap-6 text-sm text-teal-100/70">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              1,234+ bệnh nhân tin tưởng
            </span>
            <span>•</span>
            <span>50+ bác sĩ chuyên khoa</span>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="font-display text-primary text-2xl font-bold">
            MedCare
          </span>
        </div>

        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display text-foreground text-3xl font-bold">
              {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {mode === 'login'
                ? 'Đăng nhập để tiếp tục sử dụng MedCare'
                : 'Đăng ký để bắt đầu hành trình chăm sóc sức khỏe'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="animate-fade-in space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 pr-10 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors">
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="animate-fade-in space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-primary text-sm font-medium hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="shadow-glow h-12 w-full text-base font-semibold">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                  <ArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-sm">hoặc</span>
            <div className="bg-border h-px flex-1" />
          </div>

          {/* Social login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="h-12 w-full gap-3 text-base font-medium">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Tiếp tục với Google
            </Button>
          </div>

          {/* Switch mode */}
          <p className="text-muted-foreground mt-8 text-center text-sm">
            {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-primary font-semibold hover:underline">
              {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({
  icon: Icon,
  title,
  description
}: {
  icon: React.ElementType
  title: string
  description: string
}) => (
  <div className="flex items-start gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-teal-100/80">{description}</p>
    </div>
  </div>
)

export default AuthPage
