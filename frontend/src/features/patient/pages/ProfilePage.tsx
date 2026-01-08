import { Activity, ChevronRight, LogOut, Settings } from 'lucide-react'
import { MOCK_PATIENT } from '../data/mockData'

export const ProfilePage = () => {
  return (
    <div className="space-y-6 px-0 pt-6 pb-20 md:px-0 md:pt-0 md:pb-0">
      <div className="mt-2 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm md:mt-0">
        <div className="relative inline-block">
          <img
            src={MOCK_PATIENT.avatar}
            alt="Profile"
            className="mx-auto mb-3 h-24 w-24 rounded-full border-4 border-teal-50"
          />
          <button className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-teal-600 p-1.5 text-white">
            <Settings size={14} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {MOCK_PATIENT.full_name}
        </h2>
        <p className="text-sm text-gray-500">Bệnh nhân</p>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6 text-left">
          <div>
            <p className="mb-1 text-xs text-gray-400">Ngày sinh</p>
            <p className="font-medium text-gray-800">{MOCK_PATIENT.dob}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Mã BHYT</p>
            <p className="font-medium text-gray-800">DN-4829104</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Điện thoại</p>
            <p className="font-medium text-gray-800">0912 345 678</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Địa chỉ</p>
            <p className="font-medium text-gray-800">Hà Nội</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <button className="flex w-full items-center justify-between border-b border-gray-100 p-4 hover:bg-gray-50">
          <div className="flex items-center text-gray-700">
            <Settings size={20} className="mr-3 text-gray-400" />
            Cài đặt tài khoản
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="flex w-full items-center justify-between border-b border-gray-100 p-4 hover:bg-gray-50">
          <div className="flex items-center text-gray-700">
            <Activity size={20} className="mr-3 text-gray-400" />
            Thiết bị kết nối
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="flex w-full items-center justify-between p-4 text-red-600 hover:bg-gray-50">
          <div className="flex items-center">
            <LogOut size={20} className="mr-3" />
            Đăng xuất
          </div>
        </button>
      </div>
    </div>
  )
}
