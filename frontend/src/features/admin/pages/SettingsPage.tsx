import { LogOut } from 'lucide-react'
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'

export const SettingsPage = () => {
  const logoutMutation = useLogoutMutation()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Cấu hình chung
          </h2>
          <p className="text-sm text-gray-500">
            Các thiết lập toàn cục cho hệ thống Medicare
          </p>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Chế độ bảo trì hệ thống
              </h4>
              <p className="text-xs text-gray-500">
                Tạm dừng truy cập cho người dùng (trừ Admin)
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-teal-600 peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 py-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Cho phép đăng ký mới
              </h4>
              <p className="text-xs text-gray-500">
                Bệnh nhân có thể tự tạo tài khoản
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-teal-600 peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 py-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Ngưỡng cảnh báo mặc định
              </h4>
              <p className="text-xs text-gray-500">
                Mức độ nghiêm trọng mặc định cho các cảnh báo mới
              </p>
            </div>
            <select
              defaultValue="Medium"
              className="block w-40 rounded-md border border-gray-300 py-2 pr-10 pl-3 text-base focus:border-teal-500 focus:ring-teal-500 focus:outline-none sm:text-sm">
              <option>Low</option>
              <option>Medium</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end bg-gray-50 px-6 py-4">
          <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700">
            Lưu cấu hình
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800">Tài khoản</h2>
          <p className="text-sm text-gray-500">
            Quản lý phiên đăng nhập hiện tại
          </p>
        </div>
        <div className="p-6">
          <button
            className="flex w-full items-center justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none focus-visible:ring-offset-0"
            onClick={() => logoutMutation.mutate()}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất khỏi hệ thống
          </button>
        </div>
      </div>
    </div>
  )
}
