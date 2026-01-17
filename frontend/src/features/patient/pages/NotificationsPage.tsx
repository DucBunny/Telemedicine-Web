import {
  Activity,
  Calendar,
  ChevronLeft,
  Info,
  MessageSquare,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { Button } from '@/components/ui/button'

export const NotificationsPage = () => {
  return (
    <div className="space-y-4 pt-4 pb-20 md:pt-0 md:pb-0">
      <div className="mb-6 flex items-center gap-2 px-1 pt-2 md:pt-0">
        <Link to="/patient">
          <Button
            variant="icon"
            size="icon"
            className="text-gray-500 hover:bg-gray-100 md:hidden">
            <ChevronLeft size={24} />
          </Button>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
        <div className="ml-auto">
          <button className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-600">
            Đã đọc tất cả
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start space-x-4 rounded-2xl border p-4 transition-colors ${
              notif.is_read
                ? 'border-gray-100 bg-white'
                : 'border-teal-100 bg-white shadow-sm ring-1 ring-teal-50'
            }`}>
            <div
              className={`shrink-0 rounded-full p-2.5 ${
                notif.type === 'alert'
                  ? 'bg-red-100 text-red-600'
                  : notif.type === 'appointment'
                    ? 'bg-blue-100 text-blue-600'
                    : notif.type === 'chat'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
              }`}>
              {notif.type === 'alert' ? (
                <Activity size={20} />
              ) : notif.type === 'appointment' ? (
                <Calendar size={20} />
              ) : notif.type === 'chat' ? (
                <MessageSquare size={20} />
              ) : (
                <Info size={20} />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h4
                  className={`mb-1 text-sm font-bold ${
                    notif.is_read ? 'text-gray-800' : 'text-gray-900'
                  }`}>
                  {notif.title}
                </h4>
                {!notif.is_read && (
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {notif.content}
              </p>
              <span className="mt-2 block text-xs text-gray-400">
                {notif.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
