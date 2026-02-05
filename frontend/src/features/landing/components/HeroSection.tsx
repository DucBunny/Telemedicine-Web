import { Link } from '@tanstack/react-router'
import {
  Activity,
  ArrowRight,
  Github,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  User,
  Wifi,
} from 'lucide-react'
import { HERO_STATS } from '../config'

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 opacity-20 blur-[80px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-125 w-125 translate-x-1/2 rounded-full bg-blue-400 opacity-20 blur-[80px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          {/* Chip Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700 shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500"></span>
            </span>
            Giải pháp Telemedicine Toàn diện
          </div>

          <h1 className="text-5xl leading-[1.1] font-extrabold tracking-tight text-gray-700 lg:text-7xl">
            Bác sĩ riêng <br />
            <span className="bg-linear-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Ngay tại nhà bạn
            </span>
          </h1>

          <p className="max-w-lg text-xl leading-relaxed text-gray-500">
            Theo dõi sức khỏe tim mạch 24/7 với thiết bị IoT nhỏ gọn. Kết nối
            trực tuyến với đội ngũ chuyên gia y tế hàng đầu.
          </p>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-teal-200 transition hover:bg-teal-700">
              Bắt đầu ngay <ArrowRight size={20} />
            </Link>
          </div>

          {/* Stats from Constant */}
          <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
            {HERO_STATS.map((stat, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  <stat.icon className={stat.color} /> {stat.label}
                </div>
                <p className="text-sm font-medium text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative flex items-center justify-center lg:h-150">
          <div className="absolute h-125 w-125 animate-[spin_20s_linear_infinite] rounded-full border border-gray-200" />
          <div className="absolute h-87.5 w-87.5 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-gray-200" />

          <div className="relative z-20 w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl transition duration-500 hover:scale-105">
            {/* Header UI Mockup */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                  <User
                    className="h-10 w-10 text-gray-300"
                    fill="currentColor"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Nguyễn Văn A</h4>
                  <p className="flex items-center gap-1 text-xs font-bold text-green-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>{' '}
                    Online
                  </p>
                </div>
              </div>
              <div className="animate-pulse rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                Live Monitor
              </div>
            </div>

            {/* Vitals Grid Mockup */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Heart className="h-4 w-4 text-red-500" /> Nhịp tim
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  86{' '}
                  <span className="text-sm font-normal text-gray-400">BPM</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[70%] rounded-full bg-red-500" />
                </div>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Activity className="h-4 w-4 text-blue-500" /> SpO2
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  98{' '}
                  <span className="text-sm font-normal text-gray-400">%</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full w-[95%] rounded-full bg-blue-500" />
                </div>
              </div>
            </div>

            {/* AI Alert Mockup */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-gray-900 to-gray-800 p-5 text-white shadow-lg">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
              <div className="mb-2 flex gap-3">
                <div className="rounded-lg bg-white/20 p-1.5">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                </div>
                <span className="py-1 text-xs font-bold tracking-wider text-yellow-300 uppercase">
                  AI Phân tích
                </span>
              </div>
              <p className="text-sm leading-relaxed font-medium opacity-90">
                "Phát hiện nhịp tim ổn định. Không có dấu hiệu rối loạn nhịp tim
                trong 24h qua."
              </p>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 -right-10 z-30 hidden animate-bounce items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:flex">
            <div className="rounded-full bg-green-100 p-2.5 text-green-600">
              <Wifi />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">
                Trạng thái thiết bị
              </p>
              <p className="text-sm font-bold text-gray-800">Đã kết nối</p>
            </div>
          </div>

          <div
            className="absolute bottom-20 -left-10 z-30 hidden animate-bounce items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl md:flex"
            style={{ animationDelay: '1s' }}>
            <div className="rounded-full bg-blue-100 p-2.5 text-blue-600">
              <MessageCircle />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400">Tin nhắn mới</p>
              <p className="text-sm font-bold text-gray-800">
                Bác sĩ đang nhập...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
