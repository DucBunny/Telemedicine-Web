import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
  Smartphone,
  Server,
  MoreHorizontal,
  Lock,
  Unlock,
  Plus,
  Filter,
  RefreshCw,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  Edit,
  AlertTriangle,
  Clock
} from 'lucide-react'

// --- MOCK DATA (Admin Context) ---

const ADMIN_USER = {
  id: 1,
  full_name: 'Administrator',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d9488&color=fff'
}

const SYSTEM_STATS = {
  total_users: 1250,
  active_doctors: 45,
  active_patients: 1180,
  total_devices: 500,
  devices_online: 420,
  devices_maintenance: 15,
  // Thay thế System Health bằng chỉ số thực tế hơn
  pending_alerts: 12
}

// Mock Users Data (Table users)
const MOCK_USERS_LIST = [
  {
    id: 101,
    full_name: 'BS. Nguyễn Văn An',
    email: 'dr.an@medicare.com',
    role: 'doctor',
    status: 'active',
    last_login: '2023-12-29 08:00',
    phone: '0901234567'
  },
  {
    id: 102,
    full_name: 'BS. Lê Thị Bình',
    email: 'dr.binh@medicare.com',
    role: 'doctor',
    status: 'active',
    last_login: '2023-12-28 14:30',
    phone: '0901234568'
  },
  {
    id: 201,
    full_name: 'Trần Văn Cường',
    email: 'cuong.tv@gmail.com',
    role: 'patient',
    status: 'active',
    last_login: '2023-12-29 09:15',
    phone: '0912345678'
  },
  {
    id: 202,
    full_name: 'Phạm Thị Dung',
    email: 'dung.pt@yahoo.com',
    role: 'patient',
    status: 'locked',
    last_login: '2023-11-15 10:00',
    phone: '0912345679'
  },
  {
    id: 203,
    full_name: 'Hoàng Minh E',
    email: 'hme@gmail.com',
    role: 'patient',
    status: 'active',
    last_login: '2023-12-29 07:45',
    phone: '0912345680'
  }
]

// Mock Devices Data (Table devices)
const MOCK_DEVICES = [
  {
    device_id: 'EC:62:60:85:40:01',
    name: 'Heart Rate Monitor V1',
    status: 'active',
    assigned_to: 'Trần Văn Cường',
    last_ping: '2s trước'
  },
  {
    device_id: 'EC:62:60:85:40:02',
    name: 'SpO2 Sensor Pro',
    status: 'maintenance',
    assigned_to: null,
    last_ping: '5 ngày trước'
  },
  {
    device_id: 'EC:62:60:85:40:03',
    name: 'Blood Pressure Kit',
    status: 'active',
    assigned_to: 'Hoàng Minh E',
    last_ping: '10s trước'
  },
  {
    device_id: 'EC:62:60:85:40:04',
    name: 'Gateway Hub',
    status: 'inactive',
    assigned_to: null,
    last_ping: 'Unknown'
  },
  {
    device_id: 'EC:62:60:85:40:05',
    name: 'Heart Rate Monitor V2',
    status: 'active',
    assigned_to: null,
    last_ping: '15p trước'
  }
]

// --- COMPONENTS ---

const StatusBadge = ({ status, type = 'default' }) => {
  const styles = {
    // User Status
    active: 'bg-green-100 text-green-800',
    locked: 'bg-red-100 text-red-800',
    // Device Status
    maintenance: 'bg-orange-100 text-orange-800',
    inactive: 'bg-gray-100 text-gray-600'
  }

  const labels = {
    active: 'Hoạt động',
    locked: 'Đã khóa',
    maintenance: 'Bảo trì',
    inactive: 'Ngừng hoạt động'
  }

  const className = styles[status] || styles.active // Default fallback

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${className}`}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />
      case 'users':
        return <UserManagement />
      case 'devices':
        return <DeviceManagement />
      case 'settings':
        return <SystemSettings />
      default:
        return <AdminDashboard />
    }
  }

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => {
        setActiveTab(id)
        setIsMobileMenuOpen(false)
      }}
      className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-all duration-200 rounded-lg group
        ${
          activeTab === id
            ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-600 rounded-r-none'
            : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
        }
        ${isSidebarCollapsed ? 'justify-center px-2' : ''}
      `}
      title={isSidebarCollapsed ? label : ''}>
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${
          activeTab === id
            ? 'text-teal-600'
            : 'text-gray-400 group-hover:text-teal-600'
        } ${isSidebarCollapsed ? 'mr-0' : 'mr-3'}`}
      />
      {!isSidebarCollapsed && (
        <span className="whitespace-nowrap transition-opacity duration-300 opacity-100">
          {label}
        </span>
      )}
    </button>
  )

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}>
        <div
          className={`p-4 flex items-center h-[73px] border-b border-gray-100 ${
            isSidebarCollapsed ? 'justify-center' : 'justify-center'
          }`}>
          <div className="w-8 h-8 bg-teal-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="text-white w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight whitespace-nowrap overflow-hidden">
              Admin<span className="text-teal-600">Portal</span>
            </span>
          )}
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {!isSidebarCollapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Quản trị
            </p>
          )}
          <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem id="users" icon={Users} label="Người dùng (Users)" />
          <NavItem id="devices" icon={Smartphone} label="Thiết bị IoT" />

          {!isSidebarCollapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
              Hệ thống
            </p>
          )}
          <NavItem id="settings" icon={Settings} label="Cấu hình" />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            className={`flex items-center text-gray-500 hover:text-red-600 w-full px-2 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-red-50 ${
              isSidebarCollapsed ? 'justify-center' : ''
            }`}
            title={isSidebarCollapsed ? 'Đăng xuất' : ''}>
            <LogOut
              className={`w-5 h-5 flex-shrink-0 ${
                isSidebarCollapsed ? '' : 'mr-3'
              }`}
            />
            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-20 h-[73px]">
          <div className="flex items-center">
            <div className="md:hidden mr-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-gray-600 rounded-md hover:bg-gray-100">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <span className="text-lg font-bold text-gray-900 md:hidden">
              Admin<span className="text-teal-600">Portal</span>
            </span>

            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 mr-3 text-gray-500 hover:bg-gray-100 hover:text-teal-600 rounded-lg transition-colors">
                {isSidebarCollapsed ? (
                  <PanelLeftOpen size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )}
              </button>
              <h2 className="text-xl font-bold text-gray-800 capitalize">
                {activeTab === 'dashboard'
                  ? 'Tổng quan hệ thống'
                  : activeTab === 'users'
                  ? 'Quản lý người dùng'
                  : activeTab === 'devices'
                  ? 'Quản lý thiết bị IoT'
                  : 'Cấu hình hệ thống'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
              <img
                src={ADMIN_USER.avatar}
                alt="Admin"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <div className="ml-2 hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {ADMIN_USER.full_name}
                </p>
                <p className="text-xs text-teal-600 mt-1 leading-none">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-white z-10 pt-20 px-4 md:hidden animate-fade-in-down">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
            <NavItem id="users" icon={Users} label="Người dùng" />
            <NavItem id="devices" icon={Smartphone} label="Thiết bị IoT" />
            <NavItem id="settings" icon={Settings} label="Cấu hình" />
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// --- SUB-VIEWS ---

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Tổng người dùng',
            value: SYSTEM_STATS.total_users,
            sub: `+${SYSTEM_STATS.active_doctors} Bác sĩ`,
            icon: Users,
            color: 'bg-blue-600'
          },
          {
            label: 'Thiết bị Online',
            value: SYSTEM_STATS.devices_online,
            sub: `Trên tổng số ${SYSTEM_STATS.total_devices}`,
            icon: Server,
            color: 'bg-green-600'
          },
          {
            label: 'Thiết bị bảo trì',
            value: SYSTEM_STATS.devices_maintenance,
            sub: 'Cần kiểm tra ngay',
            icon: Smartphone,
            color: 'bg-orange-500'
          },
          // THAY ĐỔI: Sử dụng "Cảnh báo chưa xử lý"
          {
            label: 'Cảnh báo chưa xử lý',
            value: SYSTEM_STATS.pending_alerts,
            sub: 'Cần bác sĩ hỗ trợ ngay',
            icon: AlertTriangle,
            color: 'bg-red-600'
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon
                className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-teal-600" /> Hành động nhanh
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 transition group">
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-teal-100">
                <Plus className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium">Thêm Bác sĩ</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition group">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-100">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Đăng ký thiết bị</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-500 hover:text-orange-600 transition group">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-100">
                <RefreshCw className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Reset Cache</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-500 hover:text-gray-600 transition group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-200">
                <Database className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium">Backup Dữ liệu</span>
            </button>
          </div>
        </div>

        {/* System Logs (Mock) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Nhật ký hệ thống</h3>
            <button className="text-xs text-teal-600 hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              {
                msg: 'Cảnh báo mới: Nhịp tim PAT-1002 cao',
                time: '10:30 AM',
                type: 'warning'
              },
              {
                msg: 'User ID 202 bị khóa do sai mật khẩu 5 lần',
                time: '09:15 AM',
                type: 'warning'
              },
              {
                msg: 'Backup hệ thống hoàn tất (Daily)',
                time: '02:00 AM',
                type: 'success'
              },
              {
                msg: 'Bác sĩ An cập nhật hồ sơ bệnh án #8821',
                time: 'Hôm qua',
                type: 'info'
              }
            ].map((log, i) => (
              <div key={i} className="p-4 flex items-start space-x-3 text-sm">
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    log.type === 'warning'
                      ? 'bg-orange-500'
                      : log.type === 'success'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">{log.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserManagement() {
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers =
    roleFilter === 'all'
      ? MOCK_USERS_LIST
      : MOCK_USERS_LIST.filter((u) => u.role === roleFilter)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          {['all', 'doctor', 'patient'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
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
        <div className="flex items-center w-full sm:w-auto space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm flex items-center whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
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
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{u.full_name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
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
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {u.last_login}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit size={16} />
                      </button>
                      <button
                        className={`p-1.5 rounded transition ${
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
                      <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition">
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

function DeviceManagement() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-teal-600 text-white shadow-sm flex items-center">
            <Filter className="w-4 h-4 mr-2" /> Tất cả
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            Đang hoạt động
          </button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            Bảo trì
          </button>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm flex items-center whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" /> Thêm thiết bị
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
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
                <tr key={index} className="hover:bg-gray-50 transition-colors">
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
                      <span className="text-teal-700 bg-teal-50 px-2 py-1 rounded text-xs font-medium border border-teal-100">
                        {d.assigned_to}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">
                        Chưa gán
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {d.last_ping}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-teal-600 hover:text-teal-800 font-medium text-xs">
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

function SystemSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Cấu hình chung
          </h2>
          <p className="text-sm text-gray-500">
            Các thiết lập toàn cục cho hệ thống Medicare
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Chế độ bảo trì hệ thống
              </h4>
              <p className="text-xs text-gray-500">
                Tạm dừng truy cập cho người dùng (trừ Admin)
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Cho phép đăng ký mới
              </h4>
              <p className="text-xs text-gray-500">
                Bệnh nhân có thể tự tạo tài khoản
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Ngưỡng cảnh báo mặc định
              </h4>
              <p className="text-xs text-gray-500">
                Mức độ nghiêm trọng mặc định cho các cảnh báo mới
              </p>
            </div>
            <select
              defaultValue="Medium"
              className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border">
              <option>Low</option>
              <option>Medium</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm">
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  )
}
