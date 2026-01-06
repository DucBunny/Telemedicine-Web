import { AlertOctagon } from 'lucide-react'
import { MOCK_ALERTS } from '../../data/mockData'
import { Button } from '@/components/ui/button'

export const AlertsCard = () => {
  return (
    <div className="h-full rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-red-50/50 p-3 md:p-5">
        <h2 className="flex items-center text-sm font-semibold text-gray-800 md:text-base">
          <AlertOctagon className="mr-2 h-4 w-4 text-red-500 md:h-5 md:w-5" />
          Cảnh báo
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {MOCK_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className="p-3 transition hover:bg-red-50/30 md:px-6 md:py-3">
            <div className="mb-1 flex items-start justify-between">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                {alert.severity}
              </span>
              <span className="text-[10px] text-gray-400">{alert.time}</span>
            </div>
            <h4 className="mt-1 text-xs font-semibold text-gray-800 md:text-sm">
              {alert.patient_name}
            </h4>
            <p className="mt-0.5 text-xs text-gray-600">{alert.message}</p>
            <div className="mt-3 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-200 text-xs">
                Chi tiết
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-teal-600 text-xs hover:bg-teal-700">
                Xử lý ngay
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
