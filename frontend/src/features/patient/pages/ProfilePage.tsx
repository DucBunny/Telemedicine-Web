import { Activity, ChevronRight, LogOut, Settings } from 'lucide-react'
import { useGetPatientProfile } from '../hooks/usePatientQueries'
import { Button } from '@/components/ui/button'
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations'

export const ProfilePage = () => {
  const logoutMutation = useLogoutMutation()
  const { data } = useGetPatientProfile()

  return (
    <div className="space-y-6 pt-4 pb-20 md:pt-0 md:pb-0">
      <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm md:mt-0">
        <div className="relative inline-block">
          <img
            src={data?.user.avatar}
            alt="Profile"
            className="mx-auto mb-3 h-24 w-24 rounded-full border-4 border-teal-50"
          />
          <button className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-teal-600 p-1.5 text-white">
            <Settings size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {data?.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">Bệnh nhân</p>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-left">
          <div>
            <p className="mb-1 text-xs text-gray-400">Ngày sinh</p>
            <p className="font-medium text-gray-800">
              {new Date(data?.dateOfBirth || '').toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Giới tính</p>
            <p className="font-medium text-gray-800">
              {data?.gender === 'male'
                ? 'Nam'
                : data?.gender === 'female'
                  ? 'Nữ'
                  : 'Khác'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Điện thoại</p>
            <p className="font-medium text-gray-800">
              {data?.user.phoneNumber}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Địa chỉ</p>
            <p className="font-medium text-gray-800">{data?.address}</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <Button
          variant="ghost"
          className="h-14 w-full justify-between rounded-none text-xs hover:bg-gray-50">
          <div className="ms-2 flex items-center text-gray-700">
            <Settings size={20} className="mr-2 text-gray-400" />
            Cài đặt tài khoản
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Button>
        <Button
          variant="ghost"
          className="h-14 w-full justify-between rounded-none text-xs hover:bg-gray-50">
          <div className="ms-2 flex items-center text-gray-700">
            <Activity size={20} className="mr-2 text-gray-400" />
            Thiết bị kết nối
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </Button>
        <Button
          variant="ghost"
          className="ms-2 h-14 w-full justify-start rounded-none text-xs text-red-600 hover:bg-gray-50 hover:text-red-700"
          onClick={() => logoutMutation.mutate()}>
          <LogOut />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
