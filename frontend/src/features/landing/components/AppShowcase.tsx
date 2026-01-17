import { Link } from '@tanstack/react-router'
import { Activity, Apple, Calendar, Smartphone } from 'lucide-react'

export const AppShowcase = () => (
  <section
    id="app-showcase"
    className="relative scroll-mt-20 overflow-hidden bg-gray-900 py-16 text-white lg:py-24">
    <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-teal-500 opacity-20 blur-[120px]" />
    <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <span className="mb-2 block text-sm font-bold tracking-widest text-teal-400 uppercase">
          Progressive Web App
        </span>
        <h2 className="mb-6 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Không cần tải xuống <br />
          Cài đặt tức thì
        </h2>
        <p className="mb-8 max-w-lg text-lg leading-relaxed text-gray-400">
          MedCare sử dụng công nghệ PWA tiên tiến. Chỉ cần một cú chạm để thêm
          vào màn hình chính điện thoại, hoạt động mượt mà như Native App mà
          không tốn dung lượng máy.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-4 font-bold text-white shadow-lg shadow-teal-900/50 transition hover:bg-teal-700 sm:w-auto">
            <Smartphone className="h-6 w-6" />
            <div className="text-left">
              <div className="text-sm font-bold">Mở App & Cài đặt</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 px-4">
            <div className="text-sm leading-tight font-medium text-gray-400">
              Hỗ trợ cả <br />
              <span className="mt-1 flex items-center justify-center gap-2 font-bold text-white lg:justify-start">
                <Apple size={14} /> iOS <span>&</span> <Smartphone size={14} />
                Android
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Mockup Area */}
      <div className="relative hidden max-w-full scale-[0.6] justify-center gap-6 overflow-x-visible sm:mt-8 sm:flex sm:scale-90 md:scale-100 lg:justify-end">
        {/* Phone 1: Background/Dark Phone */}
        <div className="relative h-125 w-64 max-w-[40vw] shrink-0 translate-y-8 -rotate-6 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-gray-800 shadow-2xl sm:max-w-none">
          <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-900" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Phone 2: Foreground/White Phone */}
        <div className="relative z-10 h-125 w-64 max-w-[40vw] shrink-0 -translate-y-8 rotate-6 overflow-hidden rounded-[3rem] border-8 border-gray-900 bg-white text-gray-900 shadow-2xl sm:max-w-none">
          <div className="absolute top-0 left-1/2 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-900" />
          <div className="p-4 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-800">Xin chào, A</h4>
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>

            {/* Card Nhịp tim */}
            <div className="mb-4 rounded-2xl bg-teal-500 p-4 text-white shadow-lg shadow-teal-200">
              <p className="mb-1 text-xs opacity-80">Nhịp tim</p>
              <p className="text-3xl font-bold">86 BPM</p>
            </div>

            {/* Card Lịch hẹn */}
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
