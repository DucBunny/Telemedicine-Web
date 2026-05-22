import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm?: () => void
  title: string
  description: ReactNode
  cancelButton?: ReactNode
  confirmButton?: ReactNode
  cancelLabel?: string
  confirmLabel?: string
}

export const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  cancelButton,
  confirmButton,
  cancelLabel,
  confirmLabel,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="scrollbar-hide max-h-[80vh] overflow-y-auto lg:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {cancelButton ?? (
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-sm">
              {cancelLabel ?? 'Hủy'}
            </Button>
          )}
          {confirmButton ?? (
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="text-sm">
              {confirmLabel ?? 'Xác nhận'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
