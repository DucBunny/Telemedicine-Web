import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import type { FilterOption } from '@/features/patient/components/appointments/FilterChips'
import { useGetDoctors } from '@/features/patient/hooks/useDoctorQueries'
import { useGetSpecialtyDetail } from '@/features/patient/hooks/useSpecialtyQueries'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Route } from '@/routes/patient/appointments/doctors'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { SearchBar } from '@/features/patient/components/common/SearchBar'
import { FilterChips } from '@/features/patient/components/appointments/FilterChips'
import { DoctorCard } from '@/features/patient/components/appointments/DoctorCard'

const FILTERS: Array<FilterOption> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'exp_5', label: 'Kinh nghiệm > 5 năm' },
  { id: 'exp_10', label: 'Kinh nghiệm > 10 năm' },
]

export const DoctorSelectionPage = () => {
  // Get specialtyId from search params & fetch specialty name
  const { specialtyId } = Route.useSearch()
  const { data: specialty } = useGetSpecialtyDetail(specialtyId)

  const navigate = useNavigate()

  // Filter state
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounceValue(search, 500) // 500ms delay before fetching
  const [expFilter, setExpFilter] = useState('all')

  // Fetch doctors from API
  const { data: doctorsData, isLoading } = useGetDoctors({
    page: 1,
    limit: 10,
    specialtyId: specialtyId,
    search: debouncedSearch,
  })

  // Handle book appointment to time selection page
  const handleBookAppointment = (doctorId: number) => {
    navigate({
      to: '/patient/appointments/time',
      search: { doctorId, specialtyId },
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
        <FilterChips
          filters={FILTERS}
          activeFilter={expFilter}
          onSelect={setExpFilter}
        />

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
