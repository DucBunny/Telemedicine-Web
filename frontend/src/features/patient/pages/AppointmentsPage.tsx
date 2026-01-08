import { MapPin, Plus, User, Video } from 'lucide-react'
import { MOCK_APPOINTMENTS } from '../data/mockData'

export const AppointmentsPage = () => {
  return (
    <div className="space-y-6 px-0 pt-6 pb-20 md:px-0 md:pt-0 md:pb-0">
      <div className="flex items-center justify-between px-1 pt-2 md:pt-0">
        <h1 className="text-2xl font-bold text-gray-900">Lịch khám</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg shadow-teal-200 hover:bg-teal-700">
          <Plus size={24} />
        </button>
      </div>

      <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
        <button className="flex-1 rounded-lg bg-white py-2 text-sm font-medium text-gray-900 shadow-sm">
          Sắp tới
        </button>
        <button className="flex-1 rounded-lg py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Đã hoàn thành
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_APPOINTMENTS.map((appt) => (
          <div
            key={appt.id}
            className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center">
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{appt.doctor}</h3>
                <p className="text-xs text-gray-500">{appt.specialization}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-teal-600">{appt.time}</p>
                <p className="text-xs text-gray-400">{appt.date}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
              <span className="flex items-center text-gray-600">
                {appt.type === 'Online' ? (
                  <Video size={16} className="mr-2 text-blue-500" />
                ) : (
                  <MapPin size={16} className="mr-2 text-red-500" />
                )}
                {appt.type}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${
                  appt.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                {appt.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
