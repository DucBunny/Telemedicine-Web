import { useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { CircleCheckBig } from 'lucide-react'
import { useHideMobileNav } from '@/features/patient/hooks/useHideMobileNav'
import { Route } from '@/routes/patient/appointments/confirm'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { AppointmentConfirmInfoCard } from '@/features/patient/components/appointments/AppointmentConfirmInfoCard'
import { CostSummary } from '@/features/patient/components/appointments/CostSummary'
import {
  useBookAppointment,
  useGetDoctors,
} from '@/features/patient/hooks/useAppointmentQueries'
import { getMockDoctorById } from '@/features/patient/data/appointmentMockData'

// Set to true to use mock data for UI testing
const USE_MOCK_DATA = true

export const AppointmentConfirmPage = () => {
  useHideMobileNav()
  const { doctorId, specialtyId, date, time, type } = Route.useSearch()

  const navigate = useNavigate()
  const router = useRouter()

  const [reason, setReason] = useState('')
  const maxReasonLength = 200

  // Fetch doctor details from API
  const { data: apiDoctorsData } = useGetDoctors()

  // Use mock data if enabled, otherwise use API data
  const doctor = USE_MOCK_DATA
    ? getMockDoctorById(doctorId || 0)
    : apiDoctorsData?.data.find((d) => d.userId === doctorId)

  // Mutation for booking
  const bookMutation = useBookAppointment()

  const handleBack = () => {
    router.history.back()
  }

  const handleConfirm = async () => {
    if (!doctorId || !date || !time) {
      toast.error('Thiếu thông tin đặt lịch')
      return
    }

    // Combine date and time into ISO string
    const scheduledAt = `${date}T${time}:00`

    try {
      await bookMutation.mutateAsync({
        doctor_id: doctorId,
        scheduled_at: scheduledAt,
        reason: reason || 'Khám tổng quát',
        duration: 30,
      })

      toast.success('Đặt lịch thành công!')
      navigate({ to: '/patient/appointments' })
    } catch (error) {
      toast.error('Đặt lịch thất bại. Vui lòng thử lại.')
    }
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Đang tải thông tin bác sĩ...</p>
      </div>
    )
  }

  // Format date and time for display
  const formattedDate = date
    ? new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : ''

  const appointmentType = type === 'online' ? 'Tư vấn Online' : 'Khám trực tiếp'
  const estimatedCost = type === 'online' ? '150.000đ' : '200.000đ'

  return (
    <div className="px-4">
      <ChildPageHeader title="Xác nhận thông tin" onBack={handleBack} />

      <div className="space-y-3 pb-25 md:space-y-6">
        <AppointmentConfirmInfoCard
          doctor={doctor}
          appointment={{
            date: formattedDate,
            time: time || '',
            type: appointmentType,
          }}
        />

        <CostSummary cost={estimatedCost} />

        {/* Reason Input */}
        <section>
          <label
            htmlFor="reason"
            className="mb-3 block text-xl font-bold tracking-tight text-slate-900">
            Lý do khám
          </label>
          <div className="group relative">
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={maxReasonLength}
              placeholder="Mô tả ngắn gọn triệu chứng của bạn (không bắt buộc)..."
              rows={4}
              className="resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-teal-300 focus-visible:ring-teal-500"
            />
            <div
              className={`absolute right-3 bottom-3 text-xs ${reason.length >= maxReasonLength ? 'font-bold text-red-500' : 'text-slate-400'}`}>
              {reason.length}/{maxReasonLength}
            </div>
          </div>
        </section>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-gray-100 bg-white p-4 md:left-20 lg:hidden">
        <Button
          onClick={handleConfirm}
          disabled={bookMutation.isPending}
          variant="teal_primary"
          className="flex h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
          {bookMutation.isPending ? (
            'Đang xử lý...'
          ) : (
            <>
              <span>Xác nhận đặt lịch</span>
              <CircleCheckBig className="size-5" strokeWidth="2.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
