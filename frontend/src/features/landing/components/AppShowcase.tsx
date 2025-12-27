import { Link } from '@tanstack/react-router'
import { Activity, Apple, Calendar, Smartphone } from 'lucide-react'

export const AppShowcase = () => (
  <section
    id="app-showcase"
    className="relative scroll-mt-20 overflow-hidden bg-gray-900 py-24 text-white">
    <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-teal-500 opacity-20 blur-[120px]" />
    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
      <div>
        <span className="mb-2 block text-sm font-bold tracking-widest text-teal-400 uppercase">
          Progressive Web App
        </span>
        <h2 className="mb-6 text-4xl font-extrabold lg:text-5xl">
          Không cần tải xuống <br />
          Cài đặt tức thì
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-400">
          MedCare sử dụng công nghệ PWA tiên tiến. Chỉ cần một cú chạm để thêm
          vào màn hình chính điện thoại, hoạt động mượt mà như Native App mà
          không tốn dung lượng máy.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl bg-teal-600 px-8 py-4 font-bold text-white shadow-lg shadow-teal-900/50 transition hover:bg-teal-700">
            <Smartphone className="h-6 w-6" />
            <div className="text-left">
              <div className="text-sm font-bold">Mở App & Cài đặt</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 px-4">
            <div className="text-sm leading-tight font-medium text-gray-400">
              Hỗ trợ cả <br />
              <span className="mt-1 flex items-center gap-2 font-bold text-white">
                <Apple size={14} /> iOS <span>&</span> <Smartphone size={14} />
                Android
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Mockup Area */}
      <div className="relative flex justify-center gap-6 lg:justify-end">
        <div className="relative h-125 w-64 translate-y-8 -rotate-6 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-gray-800 shadow-2xl">
          <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-900" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-16 w-16 text-white" />
          </div>
        </div>
        <div className="relative z-10 h-125 w-64 -translate-y-8 rotate-6 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-white text-gray-900 shadow-2xl">
          <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-900" />
          <div className="p-4 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-800">Xin chào, A</h4>
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
            <div className="mb-4 rounded-2xl bg-teal-500 p-4 text-white shadow-lg shadow-teal-200">
              <p className="mb-1 text-xs opacity-80">Nhịp tim</p>
              <p className="text-3xl font-bold">86 BPM</p>
            </div>
            <div className="mb-2 flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
              <div className="rounded-full bg-white p-2 text-blue-500">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Lịch hẹn</p>
                <p className="text-sm font-bold text-gray-800">
                  14:00 - BS. Hùng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
