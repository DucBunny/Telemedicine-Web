import { useState } from 'react'
import { MOCK_APPOINTMENTS } from '../data/mockData'
import { Filters } from '../components/appointments/Filters'
import { AppointmentsTable } from '../components/appointments/AppointmentsTable'

export const AppointmentsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredAppointments = MOCK_APPOINTMENTS.filter((item) => {
    // 1. Search text
    const matchesSearch = item.patient_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    // 2. Status
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus

    return matchesStatus && matchesSearch
  })

  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      {/* Filters & Actions */}
      <Filters
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Appointments List */}
      <AppointmentsTable filteredAppointments={filteredAppointments} />
    </div>
  )
}
