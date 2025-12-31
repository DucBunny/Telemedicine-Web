import React from 'react'
import { DoctorLayout } from '../layouts/DoctorLayout'

export const PatientsPage = () => {
  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Danh sách bệnh nhân
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi thông tin bệnh nhân
          </p>
        </div>
        {/* TODO: Add patient list component */}
        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-500">
            Danh sách bệnh nhân sẽ hiển thị ở đây...
          </p>
        </div>
      </div>
    </DoctorLayout>
  )
}
