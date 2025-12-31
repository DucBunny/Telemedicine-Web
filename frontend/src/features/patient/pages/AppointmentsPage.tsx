import React from 'react'
import { PatientLayout } from '../layouts/PatientLayout'

export const PatientAppointmentsPage = () => {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Lịch hẹn</h2>
          <p className="text-muted-foreground mt-1">
            Danh sách lịch khám và cuộc hẹn
          </p>
        </div>
        {/* TODO: Add patient appointments list */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">Danh sách lịch hẹn của bạn...</p>
        </div>
      </div>
    </PatientLayout>
  )
}
