import { Phone, X } from 'lucide-react'

import { StatusAvatar } from '@/components/common/StatusAvatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface IncomingCallDialogProps {
  open: boolean
  callerName: string
  callerAvatar?: string
  onAccept: () => void
  onDecline: () => void
}

export const IncomingCallDialog = ({
  open,
  callerName,
  callerAvatar,
  onAccept,
  onDecline,
}: IncomingCallDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="z-100 gap-8 rounded-3xl min-[392px]:max-w-90!">
        <DialogHeader className="items-center gap-2">
          <DialogTitle>Cuộc gọi video đến</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {/* Caller Info */}
        <div className="mb-2 flex flex-col items-center truncate p-1 text-xl font-semibold text-slate-900">
          <StatusAvatar
            isUserOnline={false}
            src={callerAvatar}
            alt={callerName}
            className="mb-3 size-24"
          />
          <p className="text-xl font-semibold text-slate-900">{callerName}</p>
          <p className="text-base text-gray-500">đang gọi bạn</p>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex-row justify-center! gap-10">
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="destructive"
              className="size-12 rounded-full"
              size="icon-lg"
              onClick={onDecline}>
              <X className="size-6" />
            </Button>
            <p className="text-sm text-gray-700">Từ chối</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button
              type="button"
              variant="teal_primary"
              className="size-12 rounded-full"
              size="icon-lg"
              onClick={onAccept}>
              <Phone className="size-6" />
            </Button>
            <p className="text-sm text-gray-700">Chấp nhận</p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
