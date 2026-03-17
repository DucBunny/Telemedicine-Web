import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { MedicalRecord } from '@/features/patient/components/medicalRecords/RecordCard'
import { MainPageHeader } from '@/features/patient/components/common/PageHeader'
import { SearchBar } from '@/features/patient/components/common/SearchBar'
import {
  RecordCard,
  StatCard,
} from '@/features/patient/components/medicalRecords'

const STATS_DATA = [
  {
    id: 'total',
    label: 'Tổng hồ sơ',
    value: '12',
    icon: 'clinical_notes',
    iconBgClass:
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'last_visit',
    label: 'Lần khám cuối',
    value: '20/10/2023',
    icon: 'calendar_month',
    iconBgClass: 'bg-teal-primary/15 text-teal-primary',
  },
]

const HISTORY_DATA: Array<MedicalRecord> = [
  {
    id: '1',
    title: 'Viêm họng cấp',
    date: '20/10/2023',
    status: 'Tái khám',
    providerName: 'BS. Nguyễn Văn A',
    providerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl4JmaaK3mnpVWX7FITkEqoAWg-Xof6rStNTqVBg6doV7jXjNT0HeDRoEwU9X_vofFXcFm-1Ed5LlknJijU5EngkFJtsCwfyuZPSeJSmxM2oPcr50JWOF82ZxUxEqRHfu4vEdmDqJrCQw0VvcvU9z-AKNeEoMEmeEM3XoUJKNPxAXinGEHSUYotJ71VW-phxrmCZgD-cI0ft96ti5AuPruPM-QsL2sDivI8A42A4r2kFrS2VRJubuuGpztPVeI4ccaKfq5W3egRN0p',
    diagnosis:
      'Sốt cao, đau họng, ho khan. Đã kê đơn thuốc kháng sinh và giảm đau trong 5 ngày.',
    isPrimaryAction: true,
  },
  {
    id: '2',
    title: 'Kiểm tra định kỳ',
    date: '15/09/2023',
    status: 'Hoàn thành',
    providerName: 'BS. Trần Thị B',
    providerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmWOacBAQTalsuXI-k6a4XCr5_cZym6IWy72hskeVggislLz1moxmbHNSlhMdAqjnH-iPkCkr2c8iVHQjUmav7713aYITGcH2rJezUmepj_NV1suXNoXwIk03v2JNFzVnywPzxr7MhA1RBz4CzrRaZH0iwFs2MsvvtQ_hWbM1l-LJD6Y70sPMTxhJ8kLKhu6Ggix2WV9sSRJ02ZEJzHJss3-K2I5QKVniCQuQ_pl6cHz9jMwHQuZ3zBdjtsh-zcv26Im2OEbTqDrqf',
    diagnosis:
      'Sức khỏe bình thường. Chỉ số huyết áp ổn định. Cần bổ sung thêm vitamin C.',
    isPrimaryAction: false,
  },
  {
    id: '3',
    title: 'Tiêm phòng cúm',
    date: '05/08/2023',
    providerName: 'Y tá Lê Văn C',
    providerInitials: 'YT',
    isPrimaryAction: false,
  },
  {
    id: '4',
    title: 'Đau dạ dày',
    date: '12/07/2023',
    status: 'Điều trị',
    providerName: 'BS. Phạm Thị D',
    providerAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD_4Tic_H8BggHZO08mP9dJEWZ0UEUwHnGsRVUlCIcuVo8rIH3w-fV4a_UF_jUHJ6ex4stnvpnRLP6RVib7vF2oheibh_HABPwAR25815R-mXtgL8Cz0n9iiXVMtq4gyx91kkEhtNgv9mFSe7dUOKH1-C5SvfTzJPM-y8rKQfNNB6a-owTi3LcpT4Jw-aVjzHtcg-sSCgQ8OOifU_GoiWmutDWZsXonrwRChd_AIU_Lq77_pMK-Bkfrcs_z4gF9nfKBcjsGk6I3doVH',
    diagnosis: 'Viêm loét dạ dày nhẹ. Cần ăn uống điều độ, tránh đồ cay nóng.',
    isPrimaryAction: false,
  },
]

export const RecordsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleRecordClick = (recordId: string) => {
    navigate({ to: '/patient/records/$recordId', params: { recordId } })
  }

  return (
    <div className="px-4">
      <MainPageHeader title="Hồ sơ bệnh án" />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Tìm kiếm bệnh án, bác sĩ..."
      />

      <div className="space-y-3 py-3">
        {/* Khối thống kê đầu trang */}
        <div className="grid grid-cols-2 gap-3">
          {STATS_DATA.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              iconBgClass={stat.iconBgClass}
            />
          ))}
        </div>

        {/* Danh sách lịch sử khám bệnh */}
        <section className="space-y-3">
          <h2 className="mb-3 text-sm font-bold tracking-wider text-gray-500 uppercase">
            Lịch sử khám bệnh
          </h2>

          {HISTORY_DATA.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onClick={handleRecordClick}
            />
          ))}
        </section>
      </div>
    </div>
  )
}
