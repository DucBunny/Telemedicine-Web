import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { CircleCheckBig } from 'lucide-react'
import { useGetDoctorDetail } from '@/features/patient/hooks/useDoctorQueries'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Route } from '@/routes/patient/appointments/confirm'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { AppointmentConfirmInfoCard } from '@/features/patient/components/appointments/AppointmentConfirmInfoCard'
import { CostSummary } from '@/features/patient/components/appointments/CostSummary'
import { useCreateAppointment } from '@/features/patient/hooks/useAppointmentQueries'
import { formatShortDate, toUtcIsoFromVietnamLocal } from '@/lib/format-date'

export const AppointmentConfirmPage = () => {
  // Get search params
  const { doctorId, specialtyId, date, time, type } = Route.useSearch()

  const navigate = useNavigate()

  // State for reason input
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const maxReasonLength = 200

  // Fetch doctor details from API
  const { data: doctor, isLoading } = useGetDoctorDetail(doctorId)

  // Mutation for booking
  const createAppointmentMutation = useCreateAppointment()

  // Handle back navigation
  const handleBack = () => {
    navigate({
      to: '/patient/appointments/time',
      search: { doctorId, specialtyId },
    })
  }

  // Handle confirm booking
  const handleConfirm = async () => {
    if (!doctorId || !date || !time || !type) {
      toast.error('Thiếu thông tin đặt lịch')
      return
    }

    if (!reason.trim()) {
      setReasonError('Vui lòng nhập lý do khám')
      return
    }

    // Convert the selected Vietnam local date/time into UTC ISO before sending to backend.
    const scheduledAt = toUtcIsoFromVietnamLocal(date, time)

    try {
      await createAppointmentMutation.mutateAsync({
        doctorId,
        scheduledAt,
        reason,
        durationMinutes: 30,
        type,
      })
      navigate({ to: '/patient/appointments' })
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  const appointmentType = type === 'online' ? 'Tư vấn Online' : 'Khám trực tiếp'
  const estimatedCost = type === 'online' ? '150.000đ' : '200.000đ'

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Đang tải thông tin bác sĩ...</p>
      </div>
    )

  if (!doctor)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Không tìm thấy thông tin bác sĩ</p>
      </div>
    )

  return (
    <div className="px-4">
      <ChildPageHeader
        title="Xác nhận thông tin"
        onBack={handleBack}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="font-semibold">
                Chọn bác sĩ
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">
                Chọn ngày & giờ
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-teal-primary font-bold">
                  Xác nhận
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <div className="space-y-3 pb-25 md:space-y-6 lg:grid lg:grid-cols-12 lg:gap-4 lg:space-y-0 xl:gap-6">
        <div className="space-y-3 md:space-y-6 lg:col-span-8 xl:col-span-9">
          <AppointmentConfirmInfoCard
            doctor={doctor}
            appointment={{
              date: formatShortDate(date ?? ''),
              time: time ?? '',
              type: appointmentType,
            }}
          />

          <div className="lg:hidden">
            <CostSummary cost={estimatedCost} />
          </div>

          {/* Reason Input */}
          <section>
            <label
              htmlFor="reason"
              className="mb-3 block text-xl font-bold tracking-tight text-slate-900">
              Lý do khám
              <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="group relative">
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value)
                  if (e.target.value.trim()) setReasonError('')
                }}
                maxLength={maxReasonLength}
                placeholder="Mô tả ngắn gọn triệu chứng của bạn..."
                rows={4}
                className={`resize-none rounded-xl border bg-white p-4 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:ring-teal-500 ${
                  reasonError
                    ? 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-300'
                    : 'border-slate-200 focus-visible:border-teal-300'
                }`}
              />
              <div
                className={`absolute right-3 bottom-3 text-xs ${reason.length >= maxReasonLength ? 'font-bold text-red-500' : 'text-slate-400'}`}>
                {reason.length}/{maxReasonLength}
              </div>
            </div>
            {reasonError && (
              <p className="mt-1.5 text-sm text-red-500">{reasonError}</p>
            )}
          </section>
        </div>

        {/* Cột phải (desktop) */}
        <div className="hidden space-y-3 md:space-y-6 lg:col-span-4 lg:block xl:col-span-3">
          <CostSummary cost={estimatedCost} />

          <Button
            onClick={handleConfirm}
            disabled={createAppointmentMutation.isPending}
            variant="teal_primary"
            className="flex h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
            {createAppointmentMutation.isPending ? (
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

      {/* Floating Bottom Action Bar */}
      <div className="fixed right-0 bottom-0 left-0 z-60 border-t border-gray-100 bg-white p-4 md:left-20 lg:hidden">
        <Button
          onClick={handleConfirm}
          disabled={createAppointmentMutation.isPending}
          variant="teal_primary"
          className="flex h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
          {createAppointmentMutation.isPending ? (
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
