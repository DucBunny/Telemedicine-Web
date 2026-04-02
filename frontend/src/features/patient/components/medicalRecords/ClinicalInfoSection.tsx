import { Stethoscope } from 'lucide-react'
import type { MedicalRecord } from '@/features/patient/types'

interface ClinicalInfoSectionProps {
  record: MedicalRecord
}

export const ClinicalInfoSection = ({ record }: ClinicalInfoSectionProps) => {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 bg-teal-50/50 px-4 py-3">
        <Stethoscope className="text-teal-primary size-5" strokeWidth="2.5" />
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          Thông tin lâm sàng
        </h3>
      </div>

      <div className="space-y-4 p-4">
        {/* Triệu chứng */}
        {record.symptoms && (
          <div>
            <h4 className="text-teal-primary mb-1 text-xs font-semibold tracking-wider uppercase">
              Triệu chứng
            </h4>
            <p className="rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
              {record.symptoms}
            </p>
          </div>
        )}

        {/* Chẩn đoán */}
        <div>
          <h4 className="text-teal-primary mb-1 text-xs font-semibold tracking-wider uppercase">
            Chẩn đoán
          </h4>
          <p className="border-teal-primary rounded-r-lg border-l-4 bg-teal-50/50 py-1 pl-3 text-sm leading-relaxed font-medium text-slate-800">
            {record.diagnosis}
          </p>
        </div>

        {/* Hướng điều trị */}
        {record.treatmentPlan && (
          <div>
            <h4 className="text-teal-primary mb-1 text-xs font-semibold tracking-wider uppercase">
              Hướng điều trị
            </h4>
            <p className="text-sm leading-relaxed text-slate-700">
              {record.treatmentPlan}
            </p>
          </div>
        )}

        {/* Ghi chú */}
        {record.notes && (
          <div>
            <h4 className="text-teal-primary mb-1 text-xs font-semibold tracking-wider uppercase">
              Ghi chú thêm
            </h4>
            <p className="border-teal-primary/80 border-l-2 pl-3 text-sm text-slate-600 italic">
              {record.notes}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
