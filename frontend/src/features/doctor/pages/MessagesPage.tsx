import React from 'react'
import { DoctorLayout } from '../layouts/DoctorLayout'

export const MessagesPage = () => {
  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Tin nhắn
          </h2>
          <p className="text-muted-foreground mt-1">
            Liên lạc với bệnh nhân và đồng nghiệp
          </p>
        </div>
        {/* TODO: Add messages/chat component */}
        <div className="rounded-xl border bg-white p-6">
          <p className="text-slate-500">Tin nhắn sẽ hiển thị ở đây...</p>
        </div>
      </div>
    </DoctorLayout>
  )
}
