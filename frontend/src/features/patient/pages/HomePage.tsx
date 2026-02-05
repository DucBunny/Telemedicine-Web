import { Bell, Calendar, Clock, Droplets, Heart, Video } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { MOCK_NOTIFICATIONS } from '../data/mockData'
import { useGetPatientProfile } from '../hooks/usePatientQueries'
import { useGetPatientAppointments } from '../hooks/useAppointmentQueries'
import { useHealthData } from '../hooks/useHealthData'
import { useHealthAlerts } from '../hooks/useHealthAlerts'
import { disconnectSocket, initSocket } from '@/lib/socket'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'

export const HomePage = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length
  const { data: profileData } = useGetPatientProfile()
  const { data: appointmentsData } = useGetPatientAppointments({
    page: 1,
    limit: 5,
    status: ['confirmed', 'pending'],
  })

  const user = useAuthStore((s) => s.user)
  const { healthData, latestData } = useHealthData(user!.id)
  const { alerts } = useHealthAlerts()
  useEffect(() => {
    // Khởi tạo socket khi component mount
    initSocket(user!.id)

    return () => {
      // Disconnect khi unmount
      disconnectSocket()
    }
  }, [user!.id])

  const vitalSign = [
    {
      id: 1,
      label: 'Nhịp tim',
      value: latestData?.bpm || '--',
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      id: 2,
      label: 'SpO2',
      value: latestData?.spo2 || '--',
      unit: '%',
      icon: Droplets,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
    },
  ]

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      <div className="relative -mx-4 -mt-4 overflow-hidden rounded-b-4xl bg-linear-to-br from-teal-600 to-teal-500 p-6 pt-10 text-white shadow-lg shadow-teal-100 md:mx-0 md:mt-0 md:rounded-3xl md:pt-6">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img
                src={profileData?.user.avatar}
                className="mr-3 h-12 w-12 rounded-full border-2 border-white/40 md:hidden"
                alt="Avatar Mobile"
              />
              <div>
                <p className="mb-0.5 text-sm text-teal-100">Xin chào,</p>
                <h1 className="text-2xl font-bold">
                  {profileData?.user.fullName}
                </h1>
              </div>
            </div>

            <Link to="/patient/notifications" className="relative">
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full border border-white/10 bg-white/20 backdrop-blur-sm transition hover:bg-white/30 hover:text-white">
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full border-2 border-teal-600 bg-red-500"></span>
                )}
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
              <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
                Chiều cao
              </p>
              <p className="text-xl font-bold">
                {profileData?.height}{' '}
                <span className="text-xs font-normal opacity-80">cm</span>
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
              <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
                Cân nặng
              </p>
              <p className="text-xl font-bold">
                {profileData?.weight}{' '}
                <span className="text-xs font-normal opacity-80">kg</span>
              </p>
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-md">
              <p className="mb-1 text-xs tracking-wider text-teal-100 uppercase opacity-80">
                Nhóm máu
              </p>
              <p className="text-xl font-bold">{profileData?.bloodType}</p>
            </div>
          </div>
        </div>

        {/* Background Decor */}
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 -left-10 h-32 w-32 rounded-full bg-teal-400/20 blur-2xl"></div>
      </div>

      {/* Vitals Grid */}
      <div className="px-0 md:px-0">
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-gray-800">Chỉ số sức khỏe</h2>
          <span className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
            <span
              className={`mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full ${latestData ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            {latestData ? 'Đang theo dõi' : 'Chưa có dữ liệu'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {vitalSign.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition hover:shadow-md">
              <div className={`mb-3 rounded-full p-3 ${item.bg} ${item.color}`}>
                <item.icon size={28} />
              </div>
              <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {item.value}{' '}
                <span className="text-sm font-normal text-gray-400">
                  {item.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="px-0 md:px-0">
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-gray-800">Lịch hẹn sắp tới</h2>
          <Link to="/patient/appointments">
            <Button variant="link" className="p-0 text-xs text-teal-600">
              Xem tất cả
            </Button>
          </Link>
        </div>

        {appointmentsData?.data.slice(0, 1).map((appt) => (
          <div
            key={appt.id}
            className="relative rounded-2xl border border-l-4 border-gray-100 border-l-teal-500 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {appt.doctor?.user.fullName ?? 'Bác sĩ chưa xác định'}
                </h3>
                <p className="mt-0.5 text-sm text-teal-600">
                  {appt.doctor?.specialization ?? 'Chuyên khoa chưa xác định'}
                </p>
              </div>
              <span className="rounded bg-teal-50 px-2 py-1 text-[10px] font-bold tracking-wide text-teal-700 uppercase">
                Online
              </span>
            </div>

            <div className="mb-4 flex items-center space-x-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5 text-gray-400" />
                {new Date(appt.scheduledAt.split(' ')[0]).toLocaleDateString(
                  'vi-VN',
                )}
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1.5 text-gray-400" />
                {new Date(
                  `1970-01-01T${appt.scheduledAt.split(' ')[1]}`,
                ).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="teal_primary"
                size="lg"
                className="flex-1 rounded-xl text-xs">
                Chi tiết
              </Button>
              {/* {appt.type === 'Online' && ( */}
              <Button
                size="icon-lg"
                className="rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Video size={20} />
              </Button>
              {/* )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
