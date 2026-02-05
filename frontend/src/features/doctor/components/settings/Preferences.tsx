import { LogOut } from 'lucide-react'
import { useLogoutMutation } from '../../../auth/hooks/useAuthMutations'
import { Button } from '@/components/ui/button'

export const Preferences = () => {
  const logoutMutation = useLogoutMutation()

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="text-base font-semibold text-gray-800 md:text-lg">
        Tùy chọn khác
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-medium text-gray-900 md:text-sm">
              Thông báo từ thiết bị IoT
            </h4>
            <p className="text-[10px] text-gray-500 md:text-xs">
              Nhận cảnh báo khi chỉ số bệnh nhân bất thường
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <div className="peer h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-teal-600 peer-focus:outline-none after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white md:h-6 md:w-11 md:after:h-5 md:after:w-5"></div>
          </label>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <Button
            variant="ghost"
            onClick={() => logoutMutation.mutate()}
            className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất khỏi hệ thống
          </Button>
        </div>
      </div>
    </div>
  )
}
