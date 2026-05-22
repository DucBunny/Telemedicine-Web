import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDebounceValue } from 'usehooks-ts'

import {
  DoctorCard,
  FilterChips,
} from '@/features/appointments/components/patient'
import { useGetDoctors } from '@/features/doctors/hooks/useDoctorQueries'
import { useGetSpecialtyDetail } from '@/features/doctors/hooks/useSpecialtyQueries'
import { ChildPageHeader } from '@/components/common/PageHeader'
import { SearchBar } from '@/components/common/SearchBar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBookingAppointment } from '@/stores/bookAppointment.store'

export const DoctorSelectionPage = () => {
  const specialtyId = useBookingAppointment((state) => state.specialtyId)
  const { data: specialty } = useGetSpecialtyDetail(specialtyId!)
  const setDoctorId = useBookingAppointment((state) => state.setDoctorId)

  const navigate = useNavigate()

  // Filter state
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching
  const [expFilter, setExpFilter] = useState('all')

  // Fetch doctors from API
  const { data: doctorsData, isLoading } = useGetDoctors({
    page: 1,
    limit: 50,
    specialtyId: specialtyId!,
    search: debouncedSearch,
  })

  // Handle book appointment to time selection page
  const handleBookAppointment = (doctorId: number) => {
    setDoctorId(doctorId)
    navigate({
      to: '/patient/appointments/time',
    })
  }

  // Filter by experience
  const filteredDoctors = doctorsData?.data.filter((doctor) => {
    if (expFilter === 'exp_5') return doctor.experienceYears > 5
    if (expFilter === 'exp_10') return doctor.experienceYears > 10
    return true
  })

  return (
    <>
      <div className="px-4">
        <ChildPageHeader
          title={specialty?.name ? `Bác sĩ ${specialty.name}` : `Chọn bác sĩ`}
          onBack={() => navigate({ to: '/patient/appointments' })}
          breadcrumb={
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-teal-primary font-bold">
                    Chọn bác sĩ
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="font-semibold">
                  Chọn ngày & giờ
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="font-semibold">
                  Xác nhận
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          }
        />

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Tìm tên bác sĩ, bệnh viện..."
        />
      </div>

      <div className="my-3 space-y-3 md:my-6">
        <FilterChips activeFilter={expFilter} onSelect={setExpFilter} />

        <div className="space-y-3 px-4 md:space-y-4">
          {isLoading ? (
            <div className="mt-6 text-center text-base text-gray-400">
              Đang tải...
            </div>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.userId}
                doctor={doctor}
                onBook={handleBookAppointment}
              />
            ))
          ) : (
            <div className="mt-6 text-center text-base text-gray-400">
              Không tìm thấy bác sĩ nào phù hợp.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
