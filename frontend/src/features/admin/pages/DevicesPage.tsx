import { Filter, Plus } from 'lucide-react'
import { StatusBadge } from '../components/StatusBadge'
import { MOCK_DEVICES } from '../data/mockData'

export const DevicesPage = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          <button className="flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
            <Filter className="mr-2 h-4 w-4" /> Tất cả
          </button>
          <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
            Đang hoạt động
          </button>
          <button className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200">
            Bảo trì
          </button>
        </div>
        <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Thêm thiết bị
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-gray-200 bg-gray-50 font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4">Device ID (MAC)</th>
                <th className="px-6 py-4">Tên thiết bị</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Được gán cho</th>
                <th className="px-6 py-4">Ping cuối</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DEVICES.map((d, index) => (
                <tr key={index} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600">
                    {d.device_id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {d.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-6 py-4">
                    {d.assigned_to ? (
                      <span className="rounded border border-teal-100 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                        {d.assigned_to}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Chưa gán
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {d.last_ping}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-medium text-teal-600 hover:text-teal-800">
                      Cấu hình
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
