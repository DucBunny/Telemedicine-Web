import React from 'react'
import { PatientLayout } from '../layouts/PatientLayout'

export const ProfilePage = () => {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Hồ sơ</h2>
          <p className="text-muted-foreground mt-1">
            Thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>
        {/* TODO: Add profile form */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">Thông tin hồ sơ của bạn...</p>
        </div>
      </div>
    </PatientLayout>
  )
}
