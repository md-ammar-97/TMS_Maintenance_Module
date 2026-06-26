'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Part } from '@/types'

interface PartModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem: Part | null
}

export function PartModal({ open, onOpenChange, editItem }: PartModalProps) {
  const { addPart, updatePart } = useApp()
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

  function handleSubmit() {
    if (!name.trim()) { setErrors({ name: 'Name is required' }); return }
    if (editItem) {
      updatePart(editItem.id, { name: name.trim(), description: description.trim() })
      toast.success('Part updated')
    } else {
      addPart({ name: name.trim(), description: description.trim() })
      toast.success('Part added')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editItem ? 'Edit Part' : 'Add Part'} size="sm">
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <Label required>Part Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oil Filter" error={errors.name} autoFocus />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[60px]" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Add Part'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
