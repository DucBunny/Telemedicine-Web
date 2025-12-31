import React from 'react'
import { Activity, AlertTriangle, Heart } from 'lucide-react'
import { VitalsCard } from '../components/VitalsCard'
import { QuickActions } from '../components/QuickActions'

export const PatientDashboardPage = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-4">
        <VitalsCard
          title="Nhịp tim"
          value={86}
          unit="BPM"
          icon={Heart}
          status="normal"
        />
        <VitalsCard
          title="SpO2"
          value={98}
          unit="%"
          icon={Activity}
          status="normal"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Alert Card */}
      <div className="flex items-start gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 shadow-sm">
        <div className="shrink-0 rounded-full bg-white p-2.5 text-rose-500 shadow-sm">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-700">Cảnh báo sức khỏe</h4>
          <p className="mt-1 text-xs leading-relaxed text-rose-600/80">
            Nhịp tim tăng cao bất thường (110 BPM) lúc 14:00. Hãy nghỉ ngơi
            ngay.
          </p>
        </div>
      </div>
    </div>
  )
}
