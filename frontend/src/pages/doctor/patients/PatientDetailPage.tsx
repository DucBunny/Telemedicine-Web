import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CalendarCheck, FileText } from 'lucide-react'

import type {
  AppointmentStatus,
  AppointmentType,
} from '@/features/appointments/types'
import type { MedicalRecord } from '@/features/medicalRecords/types'

import { useGetAppointmentsByPatientIdAndCurrentDoctor } from '@/features/appointments/hooks/useAppointmentQueries'
import { VitalCardsGrid } from '@/features/dashboard/components/patient'
import { useGetRecordsByPatientIdAndCurrentDoctor } from '@/features/medicalRecords/hooks/useRecordQueries'
import {
  AppointmentsHistoryTable,
  MedicalRecordsTable,
  PatientInfoCard,
} from '@/features/patients/components/doctor'
import { useGetPatientDetail } from '@/features/patients/hooks/usePatientQueries'
import LoaderScreen from '@/components/common/Loader'
import { Button } from '@/components/ui/button'
import { usePagination } from '@/hooks/usePagination'
import { selectUser, useAuthStore } from '@/stores/auth.store'

type TabType = 'appointments' | 'medical-records'

export const PatientDetailPage = () => {
  const navigate = useNavigate()
  const params = useParams({ from: '/doctor/patients/$patientId/' })
  const patientId = params.patientId ? Number.parseInt(params.patientId, 10) : 0

  const doctor = useAuthStore(selectUser)
  const [activeTab, setActiveTab] = useState<TabType>('appointments')

  const appointmentsPagination = usePagination({
    initialPage: 1,
    initialLimit: 5,
  })
  const recordsPagination = usePagination({
    initialPage: 1,
    initialLimit: 5,
  })

  // Appointments filters
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<
    'all' | AppointmentStatus
  >('all')
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState<
    'all' | AppointmentType
  >('all')
  const [appointmentScheduledFrom, setAppointmentScheduledFrom] = useState<
    string | undefined
  >()
  const [appointmentScheduledTo, setAppointmentScheduledTo] = useState<
    string | undefined
  >()

  // Medical records filters
  const [recordsCreatedFrom, setRecordsCreatedFrom] = useState<
    string | undefined
  >()
  const [recordsCreatedTo, setRecordsCreatedTo] = useState<string | undefined>()
  const [recordsDoctorFilter, setRecordsDoctorFilter] = useState<
    boolean | undefined
  >(undefined)

  // Fetch patient detail
  const { data: patient, isLoading: isLoadingPatient } =
    useGetPatientDetail(patientId)

  // Fetch appointments
  const {
    data: appointmentsResponse,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
  } = useGetAppointmentsByPatientIdAndCurrentDoctor(patientId, {
    page: appointmentsPagination.page,
    limit: appointmentsPagination.limit,
    status:
      appointmentStatusFilter === 'all' ? undefined : [appointmentStatusFilter],
    type: appointmentTypeFilter === 'all' ? undefined : appointmentTypeFilter,
    scheduledFrom: appointmentScheduledFrom,
    scheduledTo: appointmentScheduledTo,
  })

  // Fetch medical records
  const {
    data: medicalRecordsResponse,
    isLoading: isLoadingRecords,
    isError: isErrorRecords,
  } = useGetRecordsByPatientIdAndCurrentDoctor(patientId, {
    page: recordsPagination.page,
    limit: recordsPagination.limit,
    createdFrom: recordsCreatedFrom,
    createdTo: recordsCreatedTo,
    doctorId: recordsDoctorFilter ? doctor?.id : undefined,
  })

  const handleSelectRecord = (record: MedicalRecord) => {
    navigate({
      to: '/doctor/patients/$patientId/records/$recordId',
      params: {
        patientId: String(patientId),
        recordId: String(record.id),
      },
    })
  }

  const handleAppointmentsFiltersApply = (filters: {
    statusFilter: 'all' | AppointmentStatus
    typeFilter: 'all' | AppointmentType
    scheduledFrom?: string
    scheduledTo?: string
  }) => {
    setAppointmentStatusFilter(filters.statusFilter)
    setAppointmentTypeFilter(filters.typeFilter)
    setAppointmentScheduledFrom(filters.scheduledFrom)
    setAppointmentScheduledTo(filters.scheduledTo)
    appointmentsPagination.reset()
  }

  const handleMedicalRecordsFiltersApply = (filters: {
    createdFrom?: string
    createdTo?: string
    doctorFilter?: boolean
  }) => {
    setRecordsCreatedFrom(filters.createdFrom)
    setRecordsCreatedTo(filters.createdTo)
    setRecordsDoctorFilter(filters.doctorFilter)
    recordsPagination.reset()
  }

  if (isLoadingPatient) return <LoaderScreen />

  if (!patient) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-slate-500">
            Không tìm thấy thông tin bệnh nhân
          </p>
          <Button onClick={() => window.history.back()}>Quay lại</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 md:space-y-6 md:p-0">
      {/* Patient Personal Info */}
      <PatientInfoCard patient={patient} />

      {/* Vital Signs Cards */}
      <VitalCardsGrid patientId={patientId} />

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-4">
        <Button
          variant={activeTab === 'appointments' ? 'teal_primary' : 'outline'}
          onClick={() => setActiveTab('appointments')}
          className="gap-2">
          <CalendarCheck className="size-4" />
          Lịch sử hẹn
        </Button>
        <Button
          variant={activeTab === 'medical-records' ? 'teal_primary' : 'outline'}
          onClick={() => setActiveTab('medical-records')}
          className="gap-2">
          <FileText className="size-4" />
          Lịch sử bệnh án
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'appointments' && (
        <AppointmentsHistoryTable
          data={appointmentsResponse}
          isLoading={isLoadingAppointments}
          isError={isErrorAppointments}
          statusFilter={appointmentStatusFilter}
          typeFilter={appointmentTypeFilter}
          scheduledFrom={appointmentScheduledFrom}
          scheduledTo={appointmentScheduledTo}
          onApplyFilters={handleAppointmentsFiltersApply}
          pagination={appointmentsPagination}
        />
      )}

      {activeTab === 'medical-records' && (
        <MedicalRecordsTable
          data={medicalRecordsResponse}
          isLoading={isLoadingRecords}
          isError={isErrorRecords}
          onSelectRecord={handleSelectRecord}
          createdFrom={recordsCreatedFrom}
          createdTo={recordsCreatedTo}
          doctorFilter={recordsDoctorFilter}
          onApplyFilters={handleMedicalRecordsFiltersApply}
          pagination={recordsPagination}
        />
      )}
    </div>
  )
}
