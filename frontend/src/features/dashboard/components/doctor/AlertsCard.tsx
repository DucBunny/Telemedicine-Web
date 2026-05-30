import { useState } from 'react'
import { AlertOctagon } from 'lucide-react'

import type { Alert } from '@/features/alerts/types'

import { AlertDetailDialog } from '@/features/alerts/components/doctor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatShortDate, formatTime } from '@/lib/format-date'
import { ALERT_STATUS_FILTERS } from '@/types/constants'

interface AlertsCardProps {
  alerts: Array<Alert> | undefined
}

export const AlertsCard = ({ alerts }: AlertsCardProps) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-red-50/50 p-3 md:p-5">
        <h2 className="flex items-center text-sm font-semibold text-gray-800 md:text-base">
          <AlertOctagon className="mr-2 h-4 w-4 text-red-500 md:h-5 md:w-5" />
          Cảnh báo chưa xử lý
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {alerts && alerts.length === 0 && (
          <div className="py-6 text-center text-sm text-gray-600 lg:py-10">
            Không có cảnh báo chưa xử lý
          </div>
        )}

        {alerts &&
          alerts.length > 0 &&
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 transition hover:bg-red-50/30 md:px-6 md:py-3">
              <div className="mb-1 flex items-start justify-between">
                <Badge
                  variant={
                    ALERT_STATUS_FILTERS[alert.status].variant || 'default'
                  }>
                  {ALERT_STATUS_FILTERS[alert.status].label}
                </Badge>
                <span className="text-xs text-gray-400">
                  {formatShortDate(alert.triggerTimestamp)} -{' '}
                  {formatTime(alert.triggerTimestamp)}
                </span>
              </div>
              <h4 className="mt-1 text-xs font-semibold text-gray-800 md:text-sm">
                {alert.patient?.user.fullName}
              </h4>
              <p className="mt-0.5 text-xs text-gray-600">{alert.message}</p>
              <div className="mt-3 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedAlert(alert)
                    setIsDetailDialogOpen(true)
                  }}>
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
      </div>

      <AlertDetailDialog
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        alert={selectedAlert}
      />
    </div>
  )
}
