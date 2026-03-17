import type { Medication } from '../../data/recordsMockData'
import { Badge } from '@/components/ui/badge'

interface PrescriptionSectionProps {
  medications: Array<Medication>
}

export const PrescriptionSection = ({
  medications,
}: PrescriptionSectionProps) => {
  return (
    <section>
      <div className="mb-3 flex items-center gap-1">
        <span
          className="material-symbols-outlined text-teal-primary size-5"
          style={{
            fontVariationSettings: '"FILL" 1',
            fontSize: '20px',
          }}>
          prescriptions
        </span>
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          Đơn thuốc
        </h3>
      </div>

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm">
        {medications.map((med) => (
          <div key={med.id} className="flex gap-3 border-gray-100 p-4">
            <div className={`mt-2 size-2 rounded-full ${med.dotColorClass}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold">{med.name}</h4>
                <Badge variant="teal_outline" className="text-xs">
                  {med.quantity}
                </Badge>
              </div>

              <p className="text-xs font-semibold text-slate-500">
                {med.dosage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
