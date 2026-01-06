import { Bell, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { MOCK_USER_DOCTOR } from '../data/mockData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderProps {
  isCollapsed: boolean
  setIsCollapsed: (val: boolean) => void
  activeTab: string
}

export const Header = ({
  isCollapsed,
  setIsCollapsed,
  activeTab,
}: HeaderProps) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tổng quan'
      case 'appointments':
        return 'Lịch hẹn khám'
      case 'patients':
        return 'Quản lý bệnh nhân'
      case 'chat':
        return 'Tư vấn trực tuyến'
      case 'settings':
        return 'Cài đặt hệ thống'
      default:
        return 'MedCare Doctor'
    }
  }

  return (
    <header className="z-20 flex h-15 items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:h-18.25 md:px-6 md:py-4">
      <div className="flex items-center">
        {/* Mobile Logo */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="MedCare Logo" className="h-8 w-8" />
          <span className="text-lg font-bold text-teal-700">
            MedCare
            <span className="text-gray-700">Dr</span>
          </span>
        </div>

        {/* Desktop Toggle */}
        <div className="hidden items-center md:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mr-3 text-gray-500 hover:text-teal-600">
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </Button>
          <h2 className="text-xl font-bold text-gray-800">{getTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden lg:block">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-48 border-gray-200 bg-gray-50 pr-4 pl-9 focus-visible:ring-teal-500 focus-visible:ring-offset-0 md:w-64"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-lg text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
        </Button>

        <div className="mx-2 hidden h-8 w-px bg-gray-200 sm:block"></div>

        <div className="flex cursor-pointer items-center rounded-lg p-1.5 transition-colors hover:bg-gray-50">
          <Avatar className="h-8 w-8 border border-gray-200">
            <AvatarImage src={MOCK_USER_DOCTOR.avatar} />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <div className="ml-2 hidden text-left sm:block">
            <p className="text-sm leading-none font-medium text-gray-900">
              {MOCK_USER_DOCTOR.full_name}
            </p>
            <p className="mt-1 text-xs leading-none text-teal-600">
              {MOCK_USER_DOCTOR.specialization}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
