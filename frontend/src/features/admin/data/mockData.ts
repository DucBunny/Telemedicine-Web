export const ADMIN_USER = {
  id: 1,
  full_name: 'Administrator',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=0d9488&color=fff',
}

export const SYSTEM_STATS = {
  total_users: 1250,
  active_doctors: 45,
  active_patients: 1180,
  total_devices: 500,
  devices_online: 420,
  devices_maintenance: 15,
  pending_alerts: 12,
}

export const MOCK_USERS_LIST = [
  {
    id: 101,
    full_name: 'BS. Nguyễn Văn An',
    email: 'dr.an@medicare.com',
    role: 'doctor',
    status: 'active',
    last_login: '2023-12-29 08:00',
    phone: '0901234567',
  },
  {
    id: 102,
    full_name: 'BS. Lê Thị Bình',
    email: 'dr.binh@medicare.com',
    role: 'doctor',
    status: 'active',
    last_login: '2023-12-28 14:30',
    phone: '0901234568',
  },
  {
    id: 201,
    full_name: 'Trần Văn Cường',
    email: 'cuong.tv@gmail.com',
    role: 'patient',
    status: 'active',
    last_login: '2023-12-29 09:15',
    phone: '0912345678',
  },
  {
    id: 202,
    full_name: 'Phạm Thị Dung',
    email: 'dung.pt@yahoo.com',
    role: 'patient',
    status: 'locked',
    last_login: '2023-11-15 10:00',
    phone: '0912345679',
  },
  {
    id: 203,
    full_name: 'Hoàng Minh E',
    email: 'hme@gmail.com',
    role: 'patient',
    status: 'active',
    last_login: '2023-12-29 07:45',
    phone: '0912345680',
  },
]

export const MOCK_DEVICES = [
  {
    device_id: 'EC:62:60:85:40:01',
    name: 'Heart Rate Monitor V1',
    status: 'active',
    assigned_to: 'Trần Văn Cường',
    last_ping: '2s trước',
  },
  {
    device_id: 'EC:62:60:85:40:02',
    name: 'SpO2 Sensor Pro',
    status: 'maintenance',
    assigned_to: null,
    last_ping: '5 ngày trước',
  },
  {
    device_id: 'EC:62:60:85:40:03',
    name: 'Blood Pressure Kit',
    status: 'active',
    assigned_to: 'Hoàng Minh E',
    last_ping: '10s trước',
  },
  {
    device_id: 'EC:62:60:85:40:04',
    name: 'Gateway Hub',
    status: 'inactive',
    assigned_to: null,
    last_ping: 'Unknown',
  },
  {
    device_id: 'EC:62:60:85:40:05',
    name: 'Heart Rate Monitor V2',
    status: 'active',
    assigned_to: null,
    last_ping: '15p trước',
  },
]
