import { useState } from 'react'
import { Edit, Lock, Plus, Search, Trash2, Unlock } from 'lucide-react'
import { useGetAllUsers } from '../hooks/useUsersQueries'
import { StatusBadge } from '../components/StatusBadge'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { PaginationControls } from '@/components/PaginationControls'

const roleFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'doctor', label: 'Bác sĩ' },
  { value: 'patient', label: 'Bệnh nhân' },
]

export const UsersPage = () => {
  const [roleFilter, setRoleFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const p = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const { data, isLoading, isError } = useGetAllUsers({
    page: p.page,
    limit: p.limit,
    search: searchTerm,
    role: roleFilter,
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
        <div className="text-red-500">Lỗi khi tải danh sách người dùng</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          {roleFilterOptions.map((role) => (
            <Button
              key={role.value}
              onClick={() => {
                setRoleFilter(role.value)
                p.setPage(1)
              }}
              variant={
                roleFilter === role.value ? 'teal_primary' : 'secondary'
              }>
              {role.label}
            </Button>
          ))}
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                p.setPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <Button variant="teal_primary">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-gray-200 bg-gray-50 font-medium text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.data.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{u.fullName}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize ${
                        u.role === 'doctor'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'patient'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                      {u.role === 'doctor'
                        ? 'Bác sĩ'
                        : u.role === 'patient'
                          ? 'Bệnh nhân'
                          : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="rounded p-1.5 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600">
                        <Edit size={16} />
                      </button>
                      <button
                        className={`rounded p-1.5 transition ${
                          u.status === 'locked'
                            ? 'text-green-500 hover:bg-green-50'
                            : 'text-orange-500 hover:bg-orange-50'
                        }`}
                        title={
                          u.status === 'locked' ? 'Mở khóa' : 'Khóa tài khoản'
                        }>
                        {u.status === 'locked' ? (
                          <Unlock size={16} />
                        ) : (
                          <Lock size={16} />
                        )}
                      </button>
                      <button className="rounded p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
