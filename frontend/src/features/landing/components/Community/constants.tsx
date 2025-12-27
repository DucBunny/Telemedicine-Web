import { Code2, FlaskConical, Heart } from 'lucide-react'

export type CommunityCardType = {
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

export const COMMUNITY_DATA: Array<CommunityCardType> = [
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
