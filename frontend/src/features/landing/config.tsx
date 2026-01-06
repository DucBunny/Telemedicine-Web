import {
  BrainCircuit,
  Code2,
  FlaskConical,
  Heart,
  Lock,
  ShieldCheck,
  Users,
  Video,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Types
export interface NavItem {
  label: string
  href: string
}

export interface HeroStat {
  icon: LucideIcon
  color: string
  label: string
  sub: string
}

export interface ProcessStep {
  step: number
  title: string
  desc: string
  color: string
  bg: string
}

export interface Feature {
  icon: LucideIcon
  color: string
  title: string
  desc: string
}

export interface CommunityCard {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  theme: 'green' | 'teal' | 'blue'
  features: Array<string>
  isFeatured?: boolean
  action: {
    type: 'link' | 'external' | 'button'
    label: string
    href?: string
  }
}

// Data
export const NAV_LINKS: Array<NavItem> = [
  { label: 'Hoạt động', href: '#how-it-works' },
  { label: 'Tính năng', href: '#features' },
  { label: 'Ứng dụng', href: '#app-showcase' },
  { label: 'Cộng đồng', href: '#community' },
]

export const HERO_STATS: Array<HeroStat> = [
  {
    icon: ShieldCheck,
    color: 'text-teal-500',
    label: '24/7',
    sub: 'Giám sát liên tục',
  },
  {
    icon: Zap,
    color: 'text-yellow-500',
    label: 'Realtime',
    sub: 'Cảnh báo tức thì',
  },
  {
    icon: Users,
    color: 'text-blue-500',
    label: '1-1',
    sub: 'Kết nối Bác sĩ',
  },
]

export const PROCESS_STEPS: Array<ProcessStep> = [
  {
    step: 1,
    title: 'Thu thập Dữ liệu',
    desc: 'Cảm biến MAX30102 đo SpO2 và nhịp tim liên tục, gửi về ESP32 xử lý tín hiệu.',
    color: 'text-teal-600',
    bg: 'bg-teal-100',
  },
  {
    step: 2,
    title: 'Truyền tải IoT',
    desc: 'Dữ liệu được mã hóa và gửi qua giao thức MQTT siêu tốc đến Cloud Server.',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    step: 3,
    title: 'Phân tích AI',
    desc: 'Máy học (Machine Learning) quét tìm dấu hiệu bất thường và gửi cảnh báo ngay lập tức.',
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    step: 4,
    title: 'Tư vấn Bác sĩ',
    desc: 'Bác sĩ xem hồ sơ, gọi Video Call tư vấn và kê đơn thuốc trực tuyến.',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
]

export const FEATURES_LIST: Array<Feature> = [
  {
    icon: Video,
    color: 'text-teal-600',
    title: 'Video Call WebRTC',
    desc: 'Khám bệnh từ xa với chất lượng HD, độ trễ thấp, tích hợp ngay trên trình duyệt.',
  },
  {
    icon: BrainCircuit,
    color: 'text-blue-600',
    title: 'Dự báo Đột quỵ',
    desc: 'Thuật toán phân tích xu hướng nhịp tim để đưa ra cảnh báo sớm nguy cơ đột quỵ.',
  },
  {
    icon: Lock,
    color: 'text-purple-600',
    title: 'Bảo mật tuyệt đối',
    desc: 'Dữ liệu y tế được mã hóa đầu cuối (End-to-End Encryption) đảm bảo quyền riêng tư.',
  },
]

export const COMMUNITY_CARDS: Array<CommunityCard> = [
  {
    id: 'user',
    title: 'Người dùng Phổ thông',
    subtitle: 'Dành cho cá nhân và gia đình muốn theo dõi sức khỏe chủ động.',
    icon: Heart,
    theme: 'green',
    features: ['Miễn phí trọn đời', 'Mã nguồn mở', 'Quyền riêng tư tuyệt đối'],
    action: {
      type: 'link',
      label: 'Truy cập App ngay',
      href: '/',
    },
  },
  {
    id: 'research',
    title: 'Cơ sở Y tế & Nghiên cứu',
    subtitle: 'Dành cho bệnh viện, trường đại học muốn thử nghiệm lâm sàng.',
    icon: FlaskConical,
    theme: 'teal',
    isFeatured: true, // Card này nổi bật hơn
    features: [
      'Truy cập Dataset ẩn danh',
      'Dashboard phân tích',
      'Hỗ trợ triển khai Pilot',
    ],
    action: {
      type: 'button',
      label: 'Đăng ký Hợp tác',
    },
  },
  {
    id: 'dev',
    title: 'Nhà phát triển',
    subtitle: 'Dành cho lập trình viên muốn đóng góp vào hệ sinh thái MedCare.',
    icon: Code2,
    theme: 'blue',
    features: ['Truy cập GitHub Repo', 'Tài liệu API đầy đủ', 'Cộng đồng Dev'],
    action: {
      type: 'external',
      label: 'Xem GitHub',
      href: 'https://github.com/DucBunny/Telemedicine-Web',
    },
  },
]
