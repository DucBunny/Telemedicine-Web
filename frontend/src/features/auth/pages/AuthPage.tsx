import { AnimatePresence, motion } from 'motion/react'
import { Heart, ShieldCheck, Stethoscope } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Header } from '@/features/auth/components/Header'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import '../styles.css'

interface AuthLayoutProps {
  children: React.ReactNode
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isLoginTab = !location.pathname.includes('register')

  // > 1024px sẽ hiển thị layout desktop
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  return (
    <div
      className={cn(
        'scrollbar-hide flex min-h-dvh bg-gray-50 text-slate-900 lg:h-screen lg:overflow-hidden',
        isLoginTab ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}>
      {/* Banner */}
      <motion.div
        layout={isDesktop}
        transition={{ type: 'spring', damping: 30 }}
        className="relative z-10 hidden h-full flex-col items-center justify-center overflow-hidden shadow-xl lg:flex lg:w-1/2">
        <div className="bg-teal-primary/70 absolute inset-0 z-10 mix-blend-multiply" />
        <div className="from-teal-primary/80 via-teal-primary/50 absolute inset-0 z-10 bg-linear-to-t to-transparent" />

        <div className="relative z-20 max-w-2xl p-12 text-center text-white">
          <div className="mb-6 flex justify-center">
            <img src="/logo.png" alt="MedCare Logo" className="size-20" />
          </div>
          <h1 className="mb-4 text-4xl font-bold drop-shadow-md">
            {isLoginTab
              ? 'Chăm sóc sức khỏe tận tâm'
              : 'Tham gia cộng đồng MedCare'}
          </h1>
          <p className="text-lg opacity-90 drop-shadow-md">
            {isLoginTab
              ? ' Cổng thông tin hiện đại, an toàn và đồng hành cùng sức khỏe của bạn mỗi ngày.'
              : 'Tạo tài khoản miễn phí ngay hôm nay để bắt đầu hành trình sống khỏe cùng chuyên gia.'}
          </p>

          {/* Feature List Mini */}
          <div className="mt-6 flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <Heart size={20} />
              </div>
              <span className="text-xs font-medium">Theo dõi</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <Stethoscope size={20} />
              </div>
              <span className="text-xs font-medium">Tư vấn</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <ShieldCheck size={20} />
              </div>
              <span className="text-xs font-medium">Bảo mật</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        layout={isDesktop}
        transition={{ type: 'spring', damping: 30 }}
        className="scrollbar-hide relative z-0 flex flex-1 flex-col overflow-y-auto bg-gray-50 lg:w-1/2">
        <Header />

        {/* Tab Navigation */}
        <div className="border-teal-primary/20 relative mb-8 flex w-full border-b lg:hidden">
          <button
            onClick={() => navigate({ to: '/login' })}
            className={cn(
              'z-10 flex-1 py-4 text-center transition-colors',
              isLoginTab
                ? 'text-teal-primary font-bold'
                : 'hover:text-teal-primary font-medium text-slate-500',
            )}>
            Đăng nhập
          </button>
          <button
            onClick={() => navigate({ to: '/register' })}
            className={cn(
              'z-10 flex-1 py-4 text-center transition-colors',
              !isLoginTab
                ? 'text-teal-primary font-bold'
                : 'hover:text-teal-primary font-medium text-slate-500',
            )}>
            Đăng ký
          </button>

          {/* Thanh trượt gạch chân Tab */}
          <motion.div
            className="bg-teal-primary absolute bottom-0 left-0 h-0.5 w-1/2"
            animate={{ x: isLoginTab ? '0%' : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="scrollbar-hide flex w-full flex-1 flex-col justify-center px-4 lg:my-8">
          <div className="w-full flex-1 lg:flex-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={isDesktop ? { opacity: 0 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={isDesktop ? { opacity: 0 } : undefined}
                transition={{ duration: 0.3, ease: 'easeInOut' }}>
                {/* Child components (LoginForm or RegisterForm) */}
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="my-8 text-center md:mt-10">
            <p className="flex items-center justify-center gap-1 text-xs text-slate-400">
              <ShieldCheck />
              Bảo mật thông tin chuẩn Y tế
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
