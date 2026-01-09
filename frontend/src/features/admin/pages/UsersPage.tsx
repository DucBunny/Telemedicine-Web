import { useState } from 'react'
import { Edit, Lock, Plus, Search, Trash2, Unlock } from 'lucide-react'
import { MOCK_USERS_LIST } from '../data/mockData'
import { StatusBadge } from '../components/StatusBadge'

export const UsersPage = () => {
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers =
    roleFilter === 'all'
      ? MOCK_USERS_LIST
      : MOCK_USERS_LIST.filter((u) => u.role === roleFilter)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Controls */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex space-x-2">
          {['all', 'doctor', 'patient'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                roleFilter === role
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {role === 'all'
                ? 'Tất cả'
                : role === 'doctor'
                  ? 'Bác sĩ'
                  : 'Bệnh nhân'}
            </button>
          ))}
        </div>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-sm hover:bg-teal-700">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </button>
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
                <th className="px-6 py-4">Đăng nhập cuối</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{u.full_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize ${
                        u.role === 'doctor'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.phone}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {u.last_login}
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
      </div>
    </div>
  )
}
