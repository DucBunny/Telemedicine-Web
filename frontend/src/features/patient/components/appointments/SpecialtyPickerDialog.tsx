import { useNavigate } from '@tanstack/react-router'
import { useGetSpecialties } from '@/features/patient/hooks/useSpecialtyQueries'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SpecialtyPickerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const SpecialtyPickerDialog = ({
  isOpen,
  onOpenChange,
}: SpecialtyPickerDialogProps) => {
  const { data: specialtiesData } = useGetSpecialties()
  const navigate = useNavigate()

  const handleSelect = (specialtyId: number) => {
    navigate({
      to: '/patient/appointments/doctors',
      search: { specialtyId },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl p-4 md:p-6" showCloseButton={false}>
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Chọn chuyên khoa
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Vui lòng chọn chuyên khoa bạn muốn đặt lịch khám.
          </DialogDescription>
        </DialogHeader>

        {/* Lưới các chuyên khoa */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {specialtiesData?.map((specialty) => (
            <Button
              key={specialty.id}
              variant="ghost"
              onClick={() => handleSelect(specialty.id)}
              className={`h-auto flex-col rounded-2xl border border-gray-200 p-3 transition-all hover:scale-105`}>
              <img
                src={specialty.imageUrl}
                className="ring-teal-primary/50 h-12 w-full rounded-md border-2 border-white/40 object-cover ring-2"
                alt={specialty.name}
              />
              <span className="text-center text-sm font-semibold">
                {specialty.name}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
