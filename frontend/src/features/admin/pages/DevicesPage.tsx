import { Plus } from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import { useGetAllDevices } from '../hooks/useDevicesQueries'
import { Button } from '@/components/ui/button'
import { PaginationControls } from '@/components/PaginationControls'
import { usePagination } from '@/hooks/usePagination'

const statusFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
]

export const DevicesPage = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const { data, isLoading, isError } = useGetAllDevices({
    page: p.page,
    limit: p.limit,
    status: statusFilter,
  })

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">Lỗi khi tải danh sách thiết bị</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          {statusFilterOptions.map((status) => (
            <Button
              key={status.value}
              onClick={() => {
                setStatusFilter(status.value)
                p.setPage(1)
              }}
              variant={
                statusFilter === status.value ? 'teal_primary' : 'secondary'
              }>
              {status.label}
            </Button>
          ))}
        </div>
        <Button variant="teal_primary">
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-gray-200 bg-gray-50 font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4">Device ID</th>
                <th className="px-6 py-4">Tên thiết bị</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Được gán cho</th>
                {/* <th className="px-6 py-4">Ping cuối</th> */}
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((d) => (
                <tr
                  key={d.deviceId}
                  className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600">
                    {d.deviceId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {d.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-6 py-4">
                    {d.assignedTo ? (
                      <span className="rounded border border-teal-100 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                        {d.assignedTo}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Chưa gán
                      </span>
                    )}
                  </td>
                  {/* <td className="px-6 py-4 text-xs text-gray-500">
                    {d.lastPing}
                  </td> */}
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

        {/* Pagination */}
        {data?.meta && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <PaginationControls
              currentPage={p.page}
              totalPages={data.meta.totalPages}
              totalItems={data.meta.total}
              itemsPerPage={p.limit}
              onPageChange={p.setPage}
              showItemsInfo
            />
          </div>
        )}
      </div>
    </div>
  )
}
