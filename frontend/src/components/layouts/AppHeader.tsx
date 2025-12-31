import { Bell, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AppHeaderProps {
  onMenuClick?: () => void
  userInfo?: {
    name: string
    role: string
    avatarUrl?: string
    avatarFallback: string
  }
  showSearch?: boolean
  searchPlaceholder?: string
}

export const AppHeader = ({
  onMenuClick,
  userInfo,
  showSearch = true,
  searchPlaceholder = 'Tìm kiếm...',
}: AppHeaderProps) => {
  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Nút mở menu trên Mobile */}
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Search Bar (Ẩn trên mobile quá nhỏ) */}
        {showSearch && (
          <div className="group relative hidden w-72 sm:block lg:w-96">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-500" />
            <Input
              placeholder={searchPlaceholder}
              className="h-10 border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white focus-visible:ring-teal-500"
            />
          </div>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-slate-500 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 animate-pulse rounded-full border-2 border-white bg-rose-500"></span>
        </Button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block"></div>

        {userInfo && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm leading-none font-semibold text-slate-800">
                {userInfo.name}
              </p>
              <p className="mt-1.5 text-xs font-medium text-slate-500">
                {userInfo.role}
              </p>
            </div>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-white shadow-sm transition-all hover:ring-2 hover:ring-teal-500">
              {userInfo.avatarUrl && <AvatarImage src={userInfo.avatarUrl} />}
              <AvatarFallback className="bg-teal-100 text-teal-700">
                {userInfo.avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </header>
  )
}
