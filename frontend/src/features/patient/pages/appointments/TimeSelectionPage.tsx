import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowRight, Clock, CloudSun, Sun } from 'lucide-react'
import type { TimeSlot } from '@/features/patient/components/appointments/TimeSlotGrid'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
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
  const { doctorId, specialtyId } = Route.useSearch()

  const navigate = useNavigate()
  const router = useRouter()
  const { open } = useSidebar()

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
      <ChildPageHeader
        title="Chọn ngày & giờ khám"
        onBack={handleBack}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="font-semibold">
                Chọn bác sĩ
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-teal-primary font-bold">
                  Chọn ngày & giờ
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">
                Xác nhận
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="space-y-3 pb-42 md:space-y-6 md:pb-36 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0 xl:gap-6">
        <div className="space-y-3 md:space-y-6 lg:col-span-2">
          <VisitTypeToggle value={visitType} onChange={setVisitType} />

          <CalendarWidget
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        <div className="space-y-3 md:space-y-6 lg:col-span-1 lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-white lg:p-4 lg:shadow-sm xl:p-6">
          <div className="mb-3 hidden items-center justify-center gap-2 xl:flex">
            <Clock className="text-teal-primary size-6" />
            <h2 className="text-lg font-bold text-slate-800 lg:text-base">
              Chọn thời gian
            </h2>
          </div>

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
      </div>

      {/* Bottom Bar */}
      <div
        className={cn(
          'fixed right-0 bottom-0 left-0 z-60 border-t border-slate-200 bg-white p-4',
          open ? 'lg:left-64' : 'md:left-20',
        )}>
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
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            variant="teal_primary"
            className="flex h-12 w-full rounded-full text-base! font-bold transition-all active:scale-[0.98] sm:max-w-lg">
            Tiếp tục
            <ArrowRight className="size-6" strokeWidth="2.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
