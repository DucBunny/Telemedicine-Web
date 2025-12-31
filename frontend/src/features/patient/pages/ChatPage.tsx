import React from 'react'
import { PatientLayout } from '../layouts/PatientLayout'

export const ChatPage = () => {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Tin nhắn</h2>
          <p className="text-muted-foreground mt-1">Trò chuyện với bác sĩ</p>
        </div>
        {/* TODO: Add chat interface */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">Giao diện chat...</p>
        </div>
      </div>
    </PatientLayout>
  )
}
