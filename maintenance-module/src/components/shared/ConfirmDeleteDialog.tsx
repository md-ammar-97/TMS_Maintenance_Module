'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDeleteDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
}

export function ConfirmDeleteDialog({
  open, onOpenChange, onConfirm,
  title = 'Delete Record',
  description = 'This action cannot be undone. Are you sure you want to delete this record?',
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={title} size="sm">
        <div className="px-5 py-4">
          <p className="text-sm text-on-surface-variant">{description}</p>
          <div className="flex justify-end gap-2 mt-5">
            <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => { onConfirm(); onOpenChange(false) }}>Delete</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
