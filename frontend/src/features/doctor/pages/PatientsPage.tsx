import { Filters } from '../components/patients/Filters'
import { PatientsTable } from '../components/patients/PatientsTable'

export const PatientsPage = () => {
  return (
    <div className="mx-auto space-y-4 md:space-y-6">
      <Filters />

      <PatientsTable />
    </div>
  )
}
