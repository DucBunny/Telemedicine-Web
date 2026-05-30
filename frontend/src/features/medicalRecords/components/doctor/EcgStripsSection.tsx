import { ActivitySquare } from 'lucide-react'

import type { EcgAbnormalStrip } from '@/features/medicalRecords/types'

import { EcgStripChart } from '@/features/medicalRecords/components/doctor/EcgStripChart'

interface EcgStripsSectionProps {
  strips: Array<EcgAbnormalStrip>
  hasAlertSource?: boolean
}

export const EcgStripsSection = ({
  strips,
  hasAlertSource = false,
}: EcgStripsSectionProps) => {
  if (!hasAlertSource && strips.length === 0) return null

  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-rose-50/50 px-4 py-3">
        <ActivitySquare className="size-5 text-rose-600" strokeWidth="2.5" />
        <h3 className="text-base font-semibold tracking-tight text-gray-700 uppercase">
          Sóng ECG 10 giây
        </h3>
      </div>

      <div className="space-y-4 p-4">
        {strips.length > 0 ? (
          strips.map((strip) => (
            <div
              key={`${strip.stripType}-${strip.id ?? strip.referenceTimestamp}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white px-3">
              <EcgStripChart strip={strip} />
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            Hồ sơ này có liên kết với alert, nhưng chưa tìm thấy 2 đoạn ECG 10
            giây trong MongoDB.
          </div>
        )}
      </div>
    </section>
  )
}
