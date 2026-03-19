import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, CloudSun, Sun } from 'lucide-react'
import type { TimeSlot } from '@/features/patient/components/appointments/TimeSlotGrid'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'
import { Route } from '@/routes/patient/appointments/time'
import { Button } from '@/components/ui/button'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { VisitTypeToggle } from '@/features/patient/components/appointments/VisitTypeToggle'
import { CalendarWidget } from '@/features/patient/components/appointments/CalendarWidget'
import { TimeSlotGrid } from '@/features/patient/components/appointments/TimeSlotGrid'

// Mock time slots - In production, fetch from API based on doctor and date
const MORNING_SLOTS: Array<TimeSlot> = [
  { time: '08:00', isAvailable: true },
  { time: '08:30', isAvailable: true },
  { time: '09:00', isAvailable: true },
  { time: '09:30', isAvailable: true },
  { time: '10:00', isAvailable: true },
  { time: '10:30', isAvailable: true },
]

const AFTERNOON_SLOTS: Array<TimeSlot> = [
  { time: '14:00', isAvailable: true },
  { time: '14:30', isAvailable: true },
  { time: '15:00', isAvailable: true },
  { time: '15:30', isAvailable: true },
  { time: '16:00', isAvailable: false },
  { time: '16:30', isAvailable: false },
]

export const TimeSelectionPage = () => {
  useHideMobileNav()
  const { doctorId, specialtyId } = Route.useSearch()

  const navigate = useNavigate()
  const router = useRouter()

  const [visitType, setVisitType] = useState<'offline' | 'online'>('offline')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('09:00')

  const handleBack = () => {
    router.history.back()
  }

  const handleContinue = () => {
    // Serialize to local YYYY-MM-DD to avoid timezone shifts from toISOString()
    const toLocalYMD = (d: Date) => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    const formattedDate = toLocalYMD(selectedDate)
    // const formattedDate = selectedDate.toISOString().split('T')[0]
    navigate({
      to: '/patient/appointments/confirm',
      search: {
        doctorId,
        specialtyId,
        date: formattedDate,
        time: selectedTime,
        type: visitType,
      },
    })
  }

  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const estimatedCost = visitType === 'online' ? '150.000đ' : '200.000đ'

  return (
    <div className="px-4">
      <ChildPageHeader title="Chọn ngày & giờ khám" onBack={handleBack} />

      <div className="space-y-3 pb-42 md:space-y-6">
        <VisitTypeToggle value={visitType} onChange={setVisitType} />

        <CalendarWidget
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <TimeSlotGrid
          title="Buổi sáng"
          icon={Sun}
          iconColor="text-yellow-500"
          slots={MORNING_SLOTS}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />

        <TimeSlotGrid
          title="Buổi chiều"
          icon={CloudSun}
          iconColor="text-orange-500"
          slots={AFTERNOON_SLOTS}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
        />
      </div>

      {/* Bottom Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-slate-200 bg-white p-4 md:left-20 lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500 md:text-sm dark:text-slate-400">
              Thời gian đã chọn
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {selectedTime}, {formattedDate}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-slate-500 md:text-sm dark:text-slate-400">
              Phí tư vấn
            </span>
            <span className="text-teal-primary block text-lg font-bold dark:text-teal-400">
              {estimatedCost}
            </span>
          </div>
        </div>
        <Button
          onClick={handleContinue}
          variant="teal_primary"
          className="flex h-12 w-full rounded-full text-base! font-bold transition-all active:scale-[0.98]">
          Tiếp tục
          <ArrowRight className="size-6" strokeWidth="2.5" />
        </Button>
      </div>
    </div>
  )
}
