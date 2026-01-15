import { MapPin, Plus, User, Video } from 'lucide-react'
import { useState } from 'react'
import { useGetPatientAppointments } from '../hooks/useAppointmentQueries'

const statusFilterOptions = [
  {
    value: 'confirmed',
    label: 'Đã xác nhận',
    color: 'text-green-700 bg-green-100',
  },
  {
    value: 'pending',
    label: 'Chờ duyệt',
    color: 'text-yellow-700 bg-yellow-100',
  },
  {
    value: 'upcoming',
    label: 'Sắp tới',
    color: 'text-green-700 bg-green-100',
  },
  {
    value: 'completed',
    label: 'Đã hoàn thành',
    color: 'text-blue-700 bg-blue-100',
  },
  { value: 'cancelled', label: 'Đã hủy', color: 'text-red-700 bg-red-100' },
]

export const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState('upcoming')

  const statusParam =
    statusFilter === 'upcoming' ? ['confirmed', 'pending'] : [statusFilter]

  const { data } = useGetPatientAppointments({
    page: 1,
    limit: 5,
    status: statusParam,
  })

  return (
    <div className="space-y-6 px-0 pt-6 pb-20 md:px-0 md:pt-0 md:pb-0">
      <div className="flex items-center justify-between px-1 pt-2 md:pt-0">
        <h1 className="text-2xl font-bold text-gray-900">Lịch khám</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
        {statusFilterOptions.slice(2, 5).map((status) => (
          <button
            key={status.value}
            onClick={() => setStatusFilter(status.value)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              statusFilter === status.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:bg-white hover:text-gray-900'
            }`}>
            {status.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {data?.data.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center">
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {appt.doctor?.user.fullName ?? 'Bác sĩ chưa xác định'}
                </h3>
                <p className="text-xs text-gray-500">
                  {appt.doctor?.specialization ?? 'Chuyên khoa chưa xác định'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal-600">
                  {new Date(
                    `1970-01-01T${appt.scheduledAt.split(' ')[1]}`,
                  ).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(appt.scheduledAt.split(' ')[0]).toLocaleDateString(
                    'vi-VN',
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
              <span className="flex items-center text-gray-600">
                {/* {appt.type === 'Online' ? ( */}
                <Video size={16} className="mr-2 text-blue-500" />
                {/* ) : (
                  <MapPin size={16} className="mr-2 text-red-500" />
                )} */}
                {/* {appt.type} */}
                Online
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  statusFilterOptions.find((s) => s.value === appt.status)
                    ?.color || 'bg-gray-100 text-gray-900'
                }`}>
                {statusFilterOptions.find((s) => s.value === appt.status)
                  ?.label || 'Chờ duyệt'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
