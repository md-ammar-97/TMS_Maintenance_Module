'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { MaintenanceType } from '@/types'

interface TypeModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem: MaintenanceType | null
}

export function TypeModal({ open, onOpenChange, editItem }: TypeModalProps) {
  const { addMaintenanceType, updateMaintenanceType } = useApp()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? '')
      setDescription(editItem?.description ?? '')
      setErrors({})
    }
  }, [open, editItem])

  function validate() {
    const e: { name?: string } = {}
    if (!name.trim()) e.name = 'Name is required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    if (editItem) {
      updateMaintenanceType(editItem.id, { name: name.trim(), description: description.trim() })
      toast.success('Maintenance type updated')
    } else {
      addMaintenanceType({ name: name.trim(), description: description.trim() })
      toast.success('Maintenance type added')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editItem ? 'Edit Maintenance Type' : 'Add Maintenance Type'} size="sm">
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <Label required>Name</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Oil Change"
              error={errors.name}
              autoFocus
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional description"
              className="min-h-[60px]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Add Type'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
