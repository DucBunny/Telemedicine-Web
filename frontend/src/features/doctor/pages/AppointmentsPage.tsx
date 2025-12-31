import React from 'react'
import { DoctorLayout } from '../layouts/DoctorLayout'

export const AppointmentsPage = () => {
  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Lịch khám
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý lịch hẹn và cuộc hẹn khám bệnh
          </p>
        </div>
        {/* TODO: Add appointments calendar component */}
        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-500">Lịch khám sẽ hiển thị ở đây...</p>
        </div>
      </div>
    </DoctorLayout>
  )
}
