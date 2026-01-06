import { DASHBOARD_STATS } from '../../config'
import { Card, CardContent } from '@/components/ui/card'

export const StatCards = () => {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {DASHBOARD_STATS.map((stat, idx) => (
        <Card
          key={idx}
          className="border-gray-100 p-0 transition-all duration-200 hover:shadow-md md:py-3">
          <CardContent className="my-auto flex items-center gap-4 p-4 md:justify-between lg:p-5">
            <div className="order-2 md:order-1">
              <p className="mb-0.5 text-xs font-medium text-gray-500 md:text-sm">
                {stat.label}
              </p>
              <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                {stat.value}
              </h3>
            </div>

            <div
              className={`order-1 rounded-lg p-2 md:order-2 md:p-3 ${stat.bg} `}>
              <stat.icon className={`size-5 md:size-6 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
