import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ReactElement } from "react"

interface ConfirmDialogProps {
  title: string
  message: string
  confirmButton: ReactElement
  cancelButton: ReactElement
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function ConfirmDialog({
  title,
  message,
  confirmButton,
  cancelButton,
  isOpen,
  onOpenChange,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <p className="my-2">{message}</p>

        <DialogFooter>
          <DialogClose render={confirmButton} />
          {cancelButton}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
