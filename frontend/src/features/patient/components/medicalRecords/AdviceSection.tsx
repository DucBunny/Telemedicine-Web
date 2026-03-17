import { BriefcaseMedical, CircleCheck } from 'lucide-react'
import React from 'react'

interface AdviceSectionProps {
  advices: Array<string>
}

export const AdviceSection: React.FC<AdviceSectionProps> = ({ advices }) => {
  return (
    <section>
      <div className="mb-3 flex items-center gap-1">
        <BriefcaseMedical
          className="text-teal-primary size-5"
          strokeWidth="2.5"
        />
        <h3 className="text-base font-semibold tracking-tight text-gray-500 uppercase">
          Lời khuyên
        </h3>
      </div>

      <div className="space-y-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        {advices.map((advice, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-white">
              <CircleCheck className="size-5 fill-teal-500" />
            </span>
            <span className="text-sm">{advice}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
