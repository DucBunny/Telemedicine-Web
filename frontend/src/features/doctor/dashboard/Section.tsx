import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Section = () => {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Tổng quan
        </h2>
        <p className="text-muted-foreground mt-1">
          Báo cáo tình hình bệnh nhân ngày hôm nay.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="bg-teal-600 shadow-sm hover:bg-teal-700">
          <Calendar className="mr-2 h-4 w-4" /> Đặt lịch khám mới
        </Button>
      </div>
    </div>
  )
}
