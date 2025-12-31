import React, { useState } from 'react'
import {
  Home,
  Calendar,
  MessageSquare,
  User,
  Bell,
  Plus,
  ChevronRight,
  Clock,
  MapPin,
  Video,
  Activity,
  FileText,
  Settings,
  LogOut,
  Heart,
  Droplets,
  ChevronLeft,
  Info
} from 'lucide-react'

// --- MOCK DATA ---

const MOCK_PATIENT = {
  id: 201,
  full_name: 'Trần Văn Cường',
  avatar: 'https://i.pravatar.cc/150?u=patient201',
  dob: '15/05/1990',
  blood_type: 'A+',
  height: 175,
  weight: 72
}

const MOCK_VITALS = [
  {
    id: 1,
    label: 'Nhịp tim',
    value: '78',
    unit: 'bpm',
    status: 'normal',
    icon: Heart,
    color: 'text-red-500',
    bg: 'bg-red-50',
    description: 'Bình thường'
  },
  {
    id: 4,
    label: 'SpO2',
    value: '98',
    unit: '%',
    status: 'warning',
    icon: Droplets,
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    description: 'Tốt'
  }
]

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    doctor: 'BS. Nguyễn Văn An',
    specialization: 'Tim mạch',
    date: 'Hôm nay',
    time: '09:00',
    type: 'Online',
    status: 'confirmed'
  },
  {
    id: 2,
    doctor: 'BS. Lê Thị Bình',
    specialization: 'Nội tổng quát',
    date: '15/01/2024',
    time: '14:30',
    type: 'Tại phòng khám',
    status: 'pending'
  }
]

const MOCK_RECORDS = [
  {
    id: 1,
    date: '20/11/2023',
    diagnosis: 'Viêm họng cấp',
    doctor: 'BS. Lê Thị Bình',
    prescription: 'Panadol, Vitamin C'
  },
  {
    id: 2,
    date: '05/10/2023',
    diagnosis: 'Kiểm tra sức khỏe định kỳ',
    doctor: 'BS. Nguyễn Văn An',
    prescription: 'Không có'
  }
]

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Nhắc lịch hẹn',
    content: 'Lịch khám với BS. An lúc 09:00 hôm nay.',
    time: '30p trước',
    is_read: false,
    type: 'appointment'
  },
  {
    id: 2,
    title: 'Cảnh báo nhịp tim',
    content: 'Nhịp tim cao bất thường (110bpm) lúc 2h sáng.',
    time: '5h trước',
    is_read: false,
    type: 'alert'
  },
  {
    id: 3,
    title: 'Tin nhắn mới',
    content: 'BS. Bình đã trả lời câu hỏi của bạn.',
    time: '1 ngày trước',
    is_read: true,
    type: 'chat'
  }
]

// --- COMPONENTS ---

// 1. Mobile Bottom Navigation (Giữ nguyên bản cũ: Có Label)
const MobileBottomNav = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Trang chủ' },
    { id: 'calendar', icon: Calendar, label: 'Lịch hẹn' },
    { id: 'records', icon: FileText, label: 'Hồ sơ' },
    { id: 'chat', icon: MessageSquare, label: 'Tư vấn' },
    { id: 'profile', icon: User, label: 'Cá nhân' }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-safe flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center justify-center w-full py-1 transition-colors duration-200 ${
            activeTab === item.id
              ? 'text-teal-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}>
          <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
          <span className="text-[10px] font-medium mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// 2. Desktop Sidebar
const DesktopSidebar = ({ activeTab, setActiveTab, unreadCount }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Tổng quan' },
    { id: 'calendar', icon: Calendar, label: 'Lịch hẹn khám' },
    { id: 'records', icon: FileText, label: 'Hồ sơ bệnh án' },
    { id: 'notifications', icon: Bell, label: 'Thông báo', badge: unreadCount },
    { id: 'chat', icon: MessageSquare, label: 'Chat với bác sĩ' },
    { id: 'profile', icon: User, label: 'Thông tin cá nhân' }
  ]

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30">
      <div className="p-6 flex items-center border-b border-gray-100 h-[73px]">
        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-2">
          <Activity className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-gray-900">
          MediCare<span className="text-teal-500">App</span>
        </span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all ${
              activeTab === item.id
                ? 'bg-teal-50 text-teal-700 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'
            }`}>
            <div className="flex items-center">
              <item.icon
                className={`w-5 h-5 mr-3 ${
                  activeTab === item.id ? 'text-teal-600' : 'text-gray-400'
                }`}
              />
              {item.label}
            </div>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center p-3 bg-gray-50 rounded-xl">
          <img
            src={MOCK_PATIENT.avatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {MOCK_PATIENT.full_name}
            </p>
            <p className="text-xs text-gray-500">Mã: BN-{MOCK_PATIENT.id}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// --- VIEWS ---

const HomeView = ({ onNavigate }) => {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      {/* Header Chào mừng (Bản Cũ: Có hiển thị Chiều cao/Cân nặng)
         FIX: Sát lên trên top (-mx-4 -mt-4 trên mobile container có padding)
      */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-500 rounded-b-[2rem] md:rounded-3xl p-6 text-white shadow-xl shadow-teal-100 relative overflow-hidden -mx-4 -mt-4 md:mx-0 md:mt-0 pt-10 md:pt-6">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img
                src={MOCK_PATIENT.avatar}
                className="w-12 h-12 rounded-full border-2 border-white/40 mr-3 md:hidden"
                alt="Avatar Mobile"
              />
              <div>
                <p className="text-teal-100 text-sm mb-0.5">Xin chào,</p>
                <h1 className="text-2xl font-bold">{MOCK_PATIENT.full_name}</h1>
              </div>
            </div>

            <button
              onClick={() => onNavigate('notifications')}
              className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition relative border border-white/10">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-teal-600"></span>
              )}
            </button>
          </div>

          <div className="mt-8 flex gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex-1 text-center border border-white/10">
              <p className="text-xs text-teal-100 mb-1 opacity-80 uppercase tracking-wider">
                Chiều cao
              </p>
              <p className="font-bold text-xl">
                {MOCK_PATIENT.height}{' '}
                <span className="text-xs font-normal opacity-80">cm</span>
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex-1 text-center border border-white/10">
              <p className="text-xs text-teal-100 mb-1 opacity-80 uppercase tracking-wider">
                Cân nặng
              </p>
              <p className="font-bold text-xl">
                {MOCK_PATIENT.weight}{' '}
                <span className="text-xs font-normal opacity-80">kg</span>
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex-1 text-center border border-white/10">
              <p className="text-xs text-teal-100 mb-1 opacity-80 uppercase tracking-wider">
                Nhóm máu
              </p>
              <p className="font-bold text-xl">{MOCK_PATIENT.blood_type}</p>
            </div>
          </div>
        </div>

        {/* Background Decor */}
        <div className="absolute -right-10 -top-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 bottom-0 h-32 w-32 bg-teal-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Vitals Grid - FIX: grid-cols-2 for ALL screens (chia đều) */}
      <div className="px-0 md:px-0">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-800">Chỉ số sức khỏe</h2>
          <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            Vừa xong
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_VITALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
              <div className={`p-3 rounded-full mb-3 ${item.bg} ${item.color}`}>
                <item.icon size={28} />
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {item.value}{' '}
                <span className="text-sm text-gray-400 font-normal">
                  {item.unit}
                </span>
              </p>
              <span
                className={`mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                  item.status === 'warning'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-50 text-green-700'
                }`}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="px-0 md:px-0">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-lg font-bold text-gray-800">Lịch hẹn sắp tới</h2>
          <button
            onClick={() => onNavigate('calendar')}
            className="text-sm text-teal-600 font-medium hover:underline">
            Xem tất cả
          </button>
        </div>

        {MOCK_APPOINTMENTS.slice(0, 1).map((appt) => (
          <div
            key={appt.id}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 border-l-4 border-l-teal-500 relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {appt.doctor}
                </h3>
                <p className="text-sm text-teal-600 mt-0.5">
                  {appt.specialization}
                </p>
              </div>
              <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                {appt.type}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1.5 text-gray-400" />
                {appt.date}
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1.5 text-gray-400" />
                {appt.time}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-teal-700 shadow-sm shadow-teal-200">
                Chi tiết
              </button>
              {appt.type === 'Online' && (
                <button className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm hover:bg-blue-100 flex items-center justify-center">
                  <Video size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const NotificationsView = ({ onBack }) => (
  <div className="space-y-4 pb-20 md:pb-0 px-0 md:px-0 pt-6 md:pt-0">
    <div className="flex items-center mb-6 pt-2 md:pt-0 px-1">
      <button
        onClick={onBack}
        className="md:hidden mr-3 text-gray-500 p-2 hover:bg-gray-100 rounded-full -ml-2">
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
      <div className="ml-auto">
        <button className="text-xs text-teal-600 font-medium bg-teal-50 px-3 py-1.5 rounded-full">
          Đã đọc tất cả
        </button>
      </div>
    </div>

    <div className="space-y-3">
      {MOCK_NOTIFICATIONS.map((notif) => (
        <div
          key={notif.id}
          className={`p-4 rounded-2xl border flex items-start space-x-4 transition-colors ${
            notif.is_read
              ? 'bg-white border-gray-100'
              : 'bg-white border-teal-100 shadow-sm ring-1 ring-teal-50'
          }`}>
          <div
            className={`p-2.5 rounded-full flex-shrink-0 ${
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
            <div className="flex justify-between items-start">
              <h4
                className={`text-sm font-bold mb-1 ${
                  notif.is_read ? 'text-gray-800' : 'text-gray-900'
                }`}>
                {notif.title}
              </h4>
              {!notif.is_read && (
                <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {notif.content}
            </p>
            <span className="text-xs text-gray-400 mt-2 block">
              {notif.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const AppointmentsView = () => (
  <div className="space-y-6 pb-20 md:pb-0 px-0 md:px-0 pt-6 md:pt-0">
    <div className="flex justify-between items-center pt-2 md:pt-0 px-1">
      <h1 className="text-2xl font-bold text-gray-900">Lịch khám</h1>
      <button className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-teal-200 hover:bg-teal-700">
        <Plus size={24} />
      </button>
    </div>

    <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
      <button className="flex-1 bg-white text-gray-900 shadow-sm py-2 rounded-lg text-sm font-medium">
        Sắp tới
      </button>
      <button className="flex-1 text-gray-500 hover:text-gray-700 py-2 rounded-lg text-sm font-medium">
        Đã hoàn thành
      </button>
    </div>

    <div className="space-y-4">
      {MOCK_APPOINTMENTS.map((appt) => (
        <div
          key={appt.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mr-3">
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

          <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between text-sm">
            <span className="flex items-center text-gray-600">
              {appt.type === 'Online' ? (
                <Video size={16} className="mr-2 text-blue-500" />
              ) : (
                <MapPin size={16} className="mr-2 text-red-500" />
              )}
              {appt.type}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
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

const RecordsView = () => (
  <div className="space-y-6 pb-20 md:pb-0 px-0 md:px-0 pt-6 md:pt-0">
    <h1 className="text-2xl font-bold text-gray-900 pt-2 md:pt-0 px-1">
      Hồ sơ bệnh án
    </h1>

    <div className="relative border-l-2 border-dashed border-gray-200 ml-3 space-y-8 mt-4">
      {MOCK_RECORDS.map((rec) => (
        <div key={rec.id} className="relative pl-8">
          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-900 text-lg">
                {rec.diagnosis}
              </h3>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {rec.date}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-500 w-24 flex-shrink-0">
                  Bác sĩ:
                </span>
                <span className="text-gray-800 font-medium">{rec.doctor}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24 flex-shrink-0">
                  Đơn thuốc:
                </span>
                <span className="text-gray-800">{rec.prescription}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-3">
              <button className="flex-1 text-teal-600 bg-teal-50 py-2 rounded-lg text-sm font-medium hover:bg-teal-100">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ProfileView = () => (
  <div className="space-y-6 pb-20 md:pb-0 px-0 md:px-0 pt-6 md:pt-0">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center mt-2 md:mt-0">
      <div className="relative inline-block">
        <img
          src={MOCK_PATIENT.avatar}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-teal-50 mx-auto mb-3"
        />
        <button className="absolute bottom-0 right-0 bg-teal-600 text-white p-1.5 rounded-full border-2 border-white">
          <Settings size={14} />
        </button>
      </div>
      <h2 className="text-xl font-bold text-gray-900">
        {MOCK_PATIENT.full_name}
      </h2>
      <p className="text-gray-500 text-sm">Bệnh nhân</p>

      <div className="grid grid-cols-2 gap-4 mt-6 border-t border-gray-100 pt-6 text-left">
        <div>
          <p className="text-xs text-gray-400 mb-1">Ngày sinh</p>
          <p className="font-medium text-gray-800">{MOCK_PATIENT.dob}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Mã BHYT</p>
          <p className="font-medium text-gray-800">DN-4829104</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Điện thoại</p>
          <p className="font-medium text-gray-800">0912 345 678</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Địa chỉ</p>
          <p className="font-medium text-gray-800">Hà Nội</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100">
        <div className="flex items-center text-gray-700">
          <Settings size={20} className="mr-3 text-gray-400" />
          Cài đặt tài khoản
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>
      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100">
        <div className="flex items-center text-gray-700">
          <Activity size={20} className="mr-3 text-gray-400" />
          Thiết bị kết nối
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>
      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-red-600">
        <div className="flex items-center">
          <LogOut size={20} className="mr-3" />
          Đăng xuất
        </div>
      </button>
    </div>
  </div>
)

const ChatView = () => (
  <div className="h-[calc(100vh-80px)] md:h-full flex flex-col bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-200 mt-2 md:mt-0">
    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-900">Chat với bác sĩ</h1>
      <div className="w-2 h-2 rounded-full bg-green-500"></div>
    </div>
    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col p-8 text-center">
      <MessageSquare size={48} className="mb-4 text-gray-200" />
      <p>Chọn một bác sĩ để bắt đầu cuộc trò chuyện hoặc xem tin nhắn cũ.</p>
      <button className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-full text-sm font-medium hover:bg-teal-700">
        Bắt đầu hội thoại mới
      </button>
    </div>
  </div>
)

// --- MAIN LAYOUT ---

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState('home')
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />
      case 'calendar':
        return <AppointmentsView />
      case 'records':
        return <RecordsView />
      case 'chat':
        return <ChatView />
      case 'profile':
        return <ProfileView />
      case 'notifications':
        return <NotificationsView onBack={() => setActiveTab('home')} />
      default:
        return <HomeView onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 overflow-y-auto h-full scroll-smooth">
        {/* Content Wrapper */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-8">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation (Bản cũ: 5 mục) */}
      {activeTab !== 'notifications' && (
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  )
}
