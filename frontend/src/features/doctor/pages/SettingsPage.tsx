import React from 'react'
import { DoctorLayout } from '../layouts/DoctorLayout'

export const SettingsPage = () => {
  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Cài đặt
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin cá nhân và tùy chọn hệ thống
          </p>
        </div>
        {/* TODO: Add settings form */}
        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-500">Cài đặt sẽ hiển thị ở đây...</p>
        </div>
      </div>
    </DoctorLayout>
  )
}
