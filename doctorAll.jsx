import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Activity,
  FileText,
  Phone,
  LogOut,
  Menu,
  X,
  Send,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Filter,
  MoreVertical,
  Video,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'

// --- MOCK DATA BASED ON DBML ---

const MOCK_USER_DOCTOR = {
  id: 101,
  full_name: 'BS. Nguyễn Văn An',
  specialization: 'Tim mạch',
  degree: 'Tiến sĩ',
  avatar: 'https://i.pravatar.cc/150?u=doctor',
  role: 'doctor'
}

const MOCK_STATS = {
  total_patients: 124,
  appointments_today: 8,
  pending_alerts: 3,
  messages_unread: 5
}

// Dữ liệu Appointment (Table appointments)
const MOCK_APPOINTMENTS = [
  {
    id: 1,
    patient_name: 'Trần Thị B',
    time: '08:30',
    date: '2023-12-29',
    reason: 'Đau ngực trái',
    status: 'confirmed',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2,
    patient_name: 'Lê Văn C',
    time: '09:15',
    date: '2023-12-29',
    reason: 'Tái khám huyết áp',
    status: 'confirmed',
    type: 'Telehealth',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3,
    patient_name: 'Phạm Minh D',
    time: '10:00',
    date: '2023-12-29',
    reason: 'Tư vấn kết quả xét nghiệm',
    status: 'pending',
    type: 'Telehealth',
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
  {
    id: 4,
    patient_name: 'Nguyễn Thu E',
    time: '14:00',
    date: '2023-12-29',
    reason: 'Khó thở nhẹ',
    status: 'cancelled',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=4'
  },
  {
    id: 5,
    patient_name: 'Hoàng Văn F',
    time: '08:00',
    date: '2023-12-30',
    reason: 'Kiểm tra định kỳ',
    status: 'confirmed',
    type: 'Khám trực tiếp',
    avatar: 'https://i.pravatar.cc/150?u=5'
  },
  {
    id: 6,
    patient_name: 'Vũ Thị G',
    time: '09:30',
    date: '2023-12-30',
    reason: 'Tư vấn dinh dưỡng',
    status: 'pending',
    type: 'Telehealth',
    avatar: 'https://i.pravatar.cc/150?u=6'
  }
]

// Dữ liệu Alerts (Table alerts & health_predictions)
const MOCK_ALERTS = [
  {
    id: 1,
    patient_name: 'Lê Văn C',
    message: 'Nhịp tim vượt ngưỡng (120 bpm)',
    severity: 'critical',
    time: '10 phút trước',
    source: 'IoT Device'
  },
  {
    id: 2,
    patient_name: 'Trần Thị B',
    message: 'Huyết áp tăng nhẹ',
    severity: 'medium',
    time: '30 phút trước',
    source: 'AI Prediction'
  },
  {
    id: 3,
    patient_name: 'Hoàng Văn F',
    message: 'Pin thiết bị yếu',
    severity: 'low',
    time: '1 giờ trước',
    source: 'System'
  }
]

// Dữ liệu Patients (Table patients & users)
const MOCK_PATIENTS = [
  {
    id: 1,
    full_name: 'Trần Thị B',
    gender: 'female',
    age: 34,
    blood_type: 'O+',
    height: 160,
    weight: 55,
    last_visit: '2023-10-20',
    health_status: 'warning',
    condition: 'Huyết áp cao'
  },
  {
    id: 2,
    full_name: 'Lê Văn C',
    gender: 'male',
    age: 45,
    blood_type: 'A+',
    height: 172,
    weight: 70,
    last_visit: '2023-10-25',
    health_status: 'critical',
    condition: 'Rối loạn nhịp tim'
  },
  {
    id: 3,
    full_name: 'Phạm Minh D',
    gender: 'male',
    age: 28,
    blood_type: 'AB',
    height: 168,
    weight: 65,
    last_visit: '2023-10-26',
    health_status: 'normal',
    condition: 'Sức khỏe tốt'
  },
  {
    id: 4,
    full_name: 'Nguyễn Thu E',
    gender: 'female',
    age: 52,
    blood_type: 'B+',
    height: 155,
    weight: 60,
    last_visit: '2023-10-15',
    health_status: 'normal',
    condition: 'Tiểu đường nhẹ'
  },
  {
    id: 5,
    full_name: 'Hoàng Văn F',
    gender: 'male',
    age: 61,
    blood_type: 'A-',
    height: 170,
    weight: 75,
    last_visit: '2023-10-01',
    health_status: 'warning',
    condition: 'Suy thận độ 1'
  }
]

// Dữ liệu Chat (Table chat_messages)
const MOCK_CHATS = [
  {
    id: 1,
    user_name: 'Trần Thị B',
    last_message: 'Bác sĩ ơi, thuốc này uống sau ăn được không ạ?',
    time: '08:45',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  {
    id: 2,
    user_name: 'Lê Văn C',
    last_message: 'Tôi đã gửi chỉ số huyết áp sáng nay.',
    time: 'Hôm qua',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  {
    id: 3,
    user_name: 'Phạm Minh D',
    last_message: 'Cảm ơn bác sĩ nhiều ạ.',
    time: 'Hôm qua',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?u=3'
  }
]

// --- COMPONENTS ---

const StatusBadge = ({ status, type }) => {
  const styles = {
    // Appointment Status
    confirmed: 'bg-teal-100 text-teal-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    // Health Status
    normal: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800',
    // Alert Severity
    low: 'bg-blue-50 text-blue-700',
    medium: 'bg-orange-50 text-orange-700'
  }

  const labels = {
    confirmed: 'Đã xác nhận',
    pending: 'Chờ duyệt',
    cancelled: 'Đã hủy',
    completed: 'Hoàn thành',
    normal: 'Ổn định',
    warning: 'Cần theo dõi',
    critical: 'Nguy hiểm',
    low: 'Thấp',
    medium: 'Trung bình'
  }

  const className = styles[status] || 'bg-gray-100 text-gray-800'

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${className}`}>
      {labels[status] || status}
    </span>
  )
}

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // State for Desktop Sidebar

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tổng quan'
      case 'appointments':
        return 'Lịch hẹn khám'
      case 'patients':
        return 'Quản lý bệnh nhân'
      case 'chat':
        return 'Tư vấn trực tuyến'
      case 'settings':
        return 'Cài đặt'
      default:
        return 'Tổng quan'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveTab} />
      case 'appointments':
        return <AppointmentsView />
      case 'patients':
        return <PatientsView />
      case 'chat':
        return <ChatView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView onNavigate={setActiveTab} />
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
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 z-30 transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
        <div
          className={`p-4 flex items-center h-[73px] border-b border-gray-100 ${
            isSidebarCollapsed ? 'justify-center' : 'justify-center'
          }`}>
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="text-white w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <span className="ml-2 text-xl font-bold text-teal-900 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300">
              MediCare<span className="text-teal-500">Dr</span>
            </span>
          )}
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {!isSidebarCollapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 whitespace-nowrap">
              Menu chính
            </p>
          )}
          <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
          <NavItem id="appointments" icon={Calendar} label="Lịch hẹn" />
          <NavItem id="patients" icon={Users} label="Quản lý bệnh nhân" />
          <NavItem id="chat" icon={MessageSquare} label="Tư vấn trực tuyến" />

          {!isSidebarCollapsed && (
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6 whitespace-nowrap">
              Hệ thống
            </p>
          )}
          <div className={isSidebarCollapsed ? 'mt-6' : ''}>
            <NavItem id="settings" icon={Settings} label="Cài đặt" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            className={`flex items-center text-gray-500 hover:text-red-600 w-full px-2 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-red-50 
              ${isSidebarCollapsed ? 'justify-center' : ''}`}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative transition-all duration-300">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-20 h-[73px]">
          <div className="flex items-center">
            {/* Mobile Menu Toggle */}
            <div className="md:hidden mr-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-gray-600 rounded-md hover:bg-gray-100">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            {/* Logo Mobile */}
            <span className="text-lg font-bold text-gray-900 md:hidden">
              MediCare<span className="text-teal-500">Dr</span>
            </span>

            {/* Desktop Sidebar Toggle & Title */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 mr-3 text-gray-500 hover:bg-gray-100 hover:text-teal-600 rounded-lg transition-colors"
                title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
                {isSidebarCollapsed ? (
                  <PanelLeftOpen size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )}
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-9 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            <div className="flex items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
              <img
                src={MOCK_USER_DOCTOR.avatar}
                alt="Doctor"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <div className="ml-2 hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-none">
                  {MOCK_USER_DOCTOR.full_name}
                </p>
                <p className="text-xs text-teal-600 mt-1 leading-none">
                  {MOCK_USER_DOCTOR.specialization}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-2 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 bg-white z-10 pt-20 px-4 md:hidden animate-fade-in-down">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Tổng quan" />
            <NavItem id="appointments" icon={Calendar} label="Lịch hẹn" />
            <NavItem id="patients" icon={Users} label="Quản lý bệnh nhân" />
            <NavItem id="chat" icon={MessageSquare} label="Tư vấn trực tuyến" />
            <NavItem id="settings" icon={Settings} label="Cài đặt" />
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 scroll-smooth">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// --- SUB-VIEWS ---

function DashboardView({ onNavigate }) {
  // Lọc danh sách bệnh nhân cần chú ý
  const attentionPatients = MOCK_PATIENTS.filter((p) =>
    ['critical', 'warning'].includes(p.health_status)
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, {MOCK_USER_DOCTOR.full_name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bạn có{' '}
            <span className="font-semibold text-teal-600">
              {MOCK_STATS.appointments_today} lịch hẹn
            </span>{' '}
            hôm nay và{' '}
            <span className="font-semibold text-red-500">
              {MOCK_STATS.pending_alerts} cảnh báo
            </span>{' '}
            cần xử lý.
          </p>
        </div>
        <button
          onClick={() => onNavigate('appointments')}
          className="hidden sm:flex items-center text-sm font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-lg transition">
          Xem lịch làm việc <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Tổng bệnh nhân',
            value: MOCK_STATS.total_patients,
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            label: 'Lịch hẹn hôm nay',
            value: MOCK_STATS.appointments_today,
            icon: Calendar,
            color: 'bg-teal-500'
          },
          {
            label: 'Cảnh báo khẩn cấp',
            value: MOCK_STATS.pending_alerts,
            icon: AlertTriangle,
            color: 'bg-red-500'
          },
          {
            label: 'Tin nhắn mới',
            value: MOCK_STATS.messages_unread,
            icon: MessageSquare,
            color: 'bg-purple-500'
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition hover:shadow-md cursor-default">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon
                className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attention Needed Patients Table (NEW) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
              <h2 className="font-semibold text-red-800 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Bệnh nhân cần chú ý
              </h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                {attentionPatients.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Bệnh nhân</th>
                    <th className="px-4 py-3">Tình trạng</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attentionPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {p.full_name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.condition}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.health_status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-teal-600 hover:text-teal-800 text-xs font-medium border border-teal-200 hover:bg-teal-50 rounded px-2 py-1 transition">
                          Kiểm tra
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-600" />
                Lịch hẹn sắp tới
              </h2>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-sm text-teal-600 font-medium hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_APPOINTMENTS.slice(0, 3).map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-teal-50 rounded-lg text-teal-700">
                      <span className="text-xs font-bold uppercase">
                        {appt.time}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {appt.patient_name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {appt.type} • {appt.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={appt.status} />
                    <button className="text-gray-400 hover:text-teal-600">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <AlertOctagon className="w-5 h-5 mr-2 text-red-500" />
                Cảnh báo (Alerts)
              </h2>
            </div>
            <div className="p-0">
              {MOCK_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border-b border-gray-50 last:border-0 hover:bg-red-50/30 transition">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 mt-1">
                    {alert.patient_name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Activity className="w-3 h-3 mr-1" /> Nguồn: {alert.source}
                  </p>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 text-xs bg-white border border-gray-200 text-gray-600 py-1.5 rounded hover:bg-gray-50">
                      Chi tiết
                    </button>
                    <button className="flex-1 text-xs bg-teal-600 text-white py-1.5 rounded hover:bg-teal-700 shadow-sm">
                      Xử lý ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppointmentsView() {
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredAppointments =
    filterStatus === 'all'
      ? MOCK_APPOINTMENTS
      : MOCK_APPOINTMENTS.filter((a) => a.status === filterStatus)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  filterStatus === status
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                {status === 'all'
                  ? 'Tất cả'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none w-full"
            />
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm whitespace-nowrap">
            + Đặt lịch mới
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Bệnh nhân</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Loại khám</th>
                <th className="px-6 py-4">Lý do khám</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((appt) => (
                <tr
                  key={appt.id}
                  className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={appt.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full mr-3 bg-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {appt.patient_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Hồ sơ #{appt.id + 100}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {appt.time}
                      </span>
                      <span className="text-xs text-gray-500">{appt.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                        appt.type === 'Telehealth'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                      {appt.type === 'Telehealth' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <Users className="w-3 h-3 mr-1" />
                      )}
                      {appt.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {appt.reason}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {appt.status === 'pending' && (
                        <>
                          <button
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Chấp nhận">
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Từ chối">
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-teal-600 rounded">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>Không tìm thấy lịch hẹn nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PatientsView() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search Bar - Moved to Header but can keep specific filters here */}
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center shadow-sm">
            <Filter className="w-4 h-4 mr-2" /> Bộ lọc
          </button>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Thêm bệnh nhân
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Bệnh nhân</th>
                <th className="px-6 py-4">Giới tính/Tuổi</th>
                <th className="px-6 py-4">Nhóm máu</th>
                <th className="px-6 py-4">Lần khám cuối</th>
                <th className="px-6 py-4">Trạng thái (AI)</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_PATIENTS.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-teal-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs mr-3">
                        {p.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {p.full_name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: PAT-{1000 + p.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 capitalize">
                      {p.gender === 'male' ? 'Nam' : 'Nữ'}
                    </span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-gray-600">{p.age} tuổi</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                      {p.blood_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.last_visit}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.health_status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-teal-600 font-medium text-sm flex items-center justify-end ml-auto group-hover:bg-white p-1 rounded">
                      Chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị 5 trên tổng số 124 bệnh nhân</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">
              Trước
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatView() {
  const [selectedChat, setSelectedChat] = useState(MOCK_CHATS[0])
  const [isMobileChatDetailOpen, setIsMobileChatDetailOpen] = useState(false)

  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    setIsMobileChatDetailOpen(true)
  }

  const handleBackToChatList = () => {
    setIsMobileChatDetailOpen(false)
  }

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      {/* Chat List */}
      <div
        className={`w-full md:w-80 border-r border-gray-200 flex flex-col absolute inset-0 md:relative bg-white z-10 transition-transform duration-300 transform ${
          isMobileChatDetailOpen
            ? '-translate-x-full md:translate-x-0'
            : 'translate-x-0'
        }`}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm đoạn chat..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`p-4 flex items-start cursor-pointer transition border-b border-gray-50 last:border-0 ${
                selectedChat.id === chat.id ? 'bg-teal-50' : 'hover:bg-gray-50'
              }`}>
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                {chat.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                    {chat.user_name}
                  </h4>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p
                  className={`text-xs truncate ${
                    chat.unread > 0
                      ? 'text-teal-700 font-medium'
                      : 'text-gray-500'
                  }`}>
                  {chat.last_message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col bg-white absolute inset-0 md:relative z-20 transition-transform duration-300 transform ${
          isMobileChatDetailOpen
            ? 'translate-x-0'
            : 'translate-x-full md:translate-x-0'
        }`}>
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
          <div className="flex items-center">
            {/* Back Button for Mobile */}
            <button
              onClick={handleBackToChatList}
              className="md:hidden mr-2 p-1 text-gray-500 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={24} />
            </button>

            <img
              src={selectedChat.avatar}
              alt=""
              className="w-9 h-9 rounded-full"
            />
            <div className="ml-3">
              <h3 className="text-sm font-bold text-gray-900">
                {selectedChat.user_name}
              </h3>
              <div className="flex items-center text-xs text-green-500">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex space-x-1 md:space-x-2 text-gray-400">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone size={18} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <FileText size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 text-xs text-gray-400 bg-gray-100 rounded-full">
              Hôm nay
            </span>
          </div>

          {/* Patient Message */}
          <div className="flex justify-start">
            <img
              src={selectedChat.avatar}
              className="w-8 h-8 rounded-full mr-2 mt-1"
            />
            <div className="max-w-[75%] md:max-w-[70%]">
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-sm text-gray-800 shadow-sm">
                Chào bác sĩ, thuốc này uống sau ăn được không ạ?
              </div>
              <span className="text-[10px] text-gray-400 ml-1 mt-1 block">
                08:45
              </span>
            </div>
          </div>

          {/* Doctor Reply (Mock) */}
          <div className="flex justify-end">
            <div className="max-w-[75%] md:max-w-[70%] text-right">
              <div className="bg-teal-600 p-3 rounded-2xl rounded-tr-none text-sm text-white shadow-sm text-left">
                Chào bạn, đúng rồi nhé. Bạn nên uống sau khi ăn khoảng 30 phút
                để tránh hại dạ dày.
              </div>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-[10px] text-gray-400">08:48</span>
                <CheckCircle size={10} className="text-teal-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            <button className="p-2 text-gray-400 hover:text-teal-600 rounded-lg hover:bg-gray-100 transition">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-400"
            />
            <button className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-sm transition">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Thông tin cá nhân
          </h2>
          <p className="text-sm text-gray-500">
            Quản lý thông tin hiển thị với bệnh nhân
          </p>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center">
            <img
              src={MOCK_USER_DOCTOR.avatar}
              alt=""
              className="w-20 h-20 rounded-full border-4 border-gray-50"
            />
            <button className="ml-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600">
              Thay đổi ảnh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                defaultValue={MOCK_USER_DOCTOR.full_name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chuyên khoa
              </label>
              <input
                type="text"
                defaultValue={MOCK_USER_DOCTOR.specialization}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới thiệu (Bio)
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder="Viết vài dòng giới thiệu về kinh nghiệm của bạn..."></textarea>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-sm">
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Tùy chọn khác</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Thông báo từ thiết bị IoT
              </h4>
              <p className="text-xs text-gray-500">
                Nhận cảnh báo khi chỉ số bệnh nhân bất thường
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium">
              <LogOut className="w-4 h-4 mr-2" /> Đăng xuất khỏi hệ thống
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
