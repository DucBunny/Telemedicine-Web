import { Stethoscope } from 'lucide-react'
import type { Diagnosis } from '../../data/recordsMockData'

interface DiagnosisSectionProps {
  diagnosis: Diagnosis
}

export const DiagnosisSection = ({ diagnosis }: DiagnosisSectionProps) => {
  return (
    <section>
      <div className="mb-3 flex items-center gap-1">
        <Stethoscope className="text-teal-primary size-5" strokeWidth="2.5" />
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          Chẩn đoán
        </h3>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm leading-relaxed md:text-base">
          {diagnosis.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {diagnosis.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary rounded-lg px-3 py-1 text-xs font-semibold">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
