import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../../components/ui/breadcrumb'
import type { FilterOption } from '@/features/patient/components/appointments/FilterChips'
import { Route } from '@/routes/patient/appointments/doctors'
import { ChildPageHeader } from '@/features/patient/components/common/PageHeader'
import { SearchBar } from '@/features/patient/components/common/SearchBar'
import { FilterChips } from '@/features/patient/components/appointments/FilterChips'
import { DoctorCard } from '@/features/patient/components/appointments/DoctorCard'
import { useGetDoctors } from '@/features/patient/hooks/useAppointmentQueries'
import { getMockDoctorsBySpecialty } from '@/features/patient/data/appointmentMockData'

// Set to true to use mock data for UI testing
const USE_MOCK_DATA = true

const FILTERS: Array<FilterOption> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'exp_5', label: 'Kinh nghiệm > 5 năm' },
  { id: 'exp_10', label: 'Kinh nghiệm > 10 năm' },
]

export const DoctorSelectionPage = () => {
  const { specialtyId, specialtyName } = Route.useSearch()

  const navigate = useNavigate()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  // Fetch doctors from API
  const { data: apiDoctorsData, isLoading } = useGetDoctors({
    specialty_id: specialtyId,
    search: searchQuery,
  })

  // Use mock data if enabled, otherwise use API data
  const doctorsData = USE_MOCK_DATA
    ? { data: getMockDoctorsBySpecialty(specialtyId) }
    : apiDoctorsData

  const handleBack = () => {
    router.history.back()
  }

  const handleBookAppointment = (doctorId: number) => {
    navigate({
      to: '/patient/appointments/time',
      search: { doctorId, specialtyId },
    })
  }

  // Filter by search query
  let filteredDoctors = doctorsData?.data.filter((doctor) => {
    if (searchQuery) {
      return doctor.user.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    }
    return true
  })

  // Filter by experience
  filteredDoctors = filteredDoctors?.filter((doctor) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'exp_5') return doctor.experienceYears > 5
    if (activeFilter === 'exp_10') return doctor.experienceYears > 10
    return true
  })

  return (
    <>
      <div className="px-4">
        <ChildPageHeader
          title={specialtyName ? `Bác sĩ ${specialtyName}` : `Chọn bác sĩ`}
          onBack={handleBack}
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
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Tìm tên bác sĩ..."
        />
      </div>

      <div className="my-3 space-y-3 md:my-6">
        <FilterChips
          filters={FILTERS}
          activeFilter={activeFilter}
          onSelect={setActiveFilter}
        />

        <div className="space-y-3 px-4 md:space-y-4">
          {!USE_MOCK_DATA && isLoading ? (
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
