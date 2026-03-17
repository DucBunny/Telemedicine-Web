import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarWidgetProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export const CalendarWidget = ({
  selectedDate,
  onSelectDate,
}: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get first day of month and total days
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  )
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  )
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => i)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const monthName = currentMonth.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    )
  }

  const isSelectedDay = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const handleSelectDay = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    )
    onSelectDate(newDate)
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Button
          onClick={handlePrevMonth}
          variant="ghost"
          size="icon-sm"
          className="rounded-full">
          <ChevronLeft className="size-5" strokeWidth="2.5" />
        </Button>
        <h2 className="text-base font-bold text-slate-900 capitalize">
          {monthName}
        </h2>
        <Button
          onClick={handleNextMonth}
          variant="ghost"
          size="icon-sm"
          className="rounded-full">
          <ChevronRight className="size-5" strokeWidth="2.5" />
        </Button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-y-2 text-center">
        {/* Header */}
        {WEEKDAYS.map((day, idx) => (
          <div
            key={`header-${idx}`}
            className="py-2 text-xs font-semibold text-slate-400 uppercase">
            {day}
          </div>
        ))}

        {/* Empty cells */}
        {emptyCells.map((_, idx) => (
          <div key={`empty-${idx}`} className="h-10"></div>
        ))}

        {/* Days */}
        {daysArray.map((day) => {
          const isSelected = isSelectedDay(day)
          return (
            <button
              key={day}
              onClick={() => handleSelectDay(day)}
              className="flex h-10 w-full items-center justify-center">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-teal-primary font-bold text-white shadow-md shadow-teal-500/30'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}>
                {day}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
