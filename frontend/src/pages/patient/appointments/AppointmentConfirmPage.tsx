import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CircleCheckBig } from 'lucide-react'
import { toast } from 'sonner'

import {
  AppointmentConfirmInfoCard,
  CostSummary,
} from '@/features/appointments/components/patient'
import { useCreateAppointment } from '@/features/appointments/hooks/useAppointmentQueries'
import { useGetDoctorDetail } from '@/features/doctors/hooks/useDoctorQueries'
import LoaderScreen from '@/components/common/Loader'
import { ChildPageHeader } from '@/components/common/PageHeader'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatShortDate, toUtcIsoFromVietnamLocal } from '@/lib/format-date'
import {
  useBookingAppointment,
  useBookingFormValues,
} from '@/stores/bookAppointment.store'

export const AppointmentConfirmPage = () => {
  const { doctorId, date, time, type } = useBookingFormValues()
  const resetForm = useBookingAppointment((state) => state.resetForm)

  const navigate = useNavigate()

  // State for reason input
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const maxReasonLength = 200

  // Fetch doctor details from API
  const {
    data: doctor,
    isLoading,
    isError,
  } = useGetDoctorDetail(doctorId ?? undefined)

  // Mutation for booking
  const { mutateAsync: createAppointment, isPending: isCreatePending } =
    useCreateAppointment()

  // Handle back navigation
  const handleBack = () => {
    navigate({
      to: '/patient/appointments/time',
    })
  }

  // Handle confirm booking
  const handleConfirm = async () => {
    if (!doctorId || !date || !time) {
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
      await createAppointment({
        doctorId,
        scheduledAt,
        reason,
        durationMinutes: 30,
        type,
      })
      resetForm()
      navigate({ to: '/patient/appointments' })
    } catch (error) {
      console.error('[Appointments] Create Error:', error)
    }
  }

  const appointmentType = type === 'online' ? 'Tư vấn Online' : 'Khám trực tiếp'
  const estimatedCost = type === 'online' ? '150.000đ' : '200.000đ'

  if (!doctorId || !date || !time) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Thiếu thông tin đặt lịch</p>
      </div>
    )
  }

  if (isLoading) return <LoaderScreen />

  if (isError || !doctor)
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
              date: formatShortDate(date),
              time: time,
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
              className="block text-xl! font-bold! tracking-tight text-slate-900!">
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
                className={`mt-3 resize-none rounded-xl border bg-white p-4 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:ring-teal-500 ${
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
            disabled={isCreatePending}
            variant="teal_primary"
            className="flex h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
            {isCreatePending ? (
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
          disabled={isCreatePending}
          variant="teal_primary"
          className="flex h-12 w-full rounded-full text-base! font-bold active:scale-[0.98]">
          {isCreatePending ? (
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
