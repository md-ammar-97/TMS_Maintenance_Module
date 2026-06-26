'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { Vendor } from '@/types'

interface VendorModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem: Vendor | null
}

export function VendorModal({ open, onOpenChange, editItem }: VendorModalProps) {
  const { addVendor, updateVendor } = useApp()
  const [name, setName] = useState('')
  const [status, setStatus] = useState(true)
  const [errors, setErrors] = useState<{ name?: string }>({})

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? '')
      setStatus(editItem?.status ?? true)
      setErrors({})
    }
  }, [open, editItem])

  function handleSubmit() {
    if (!name.trim()) { setErrors({ name: 'Name is required' }); return }
    if (editItem) {
      updateVendor(editItem.id, { name: name.trim(), status })
      toast.success('Vendor updated')
    } else {
      addVendor({ name: name.trim(), status })
      toast.success('Vendor added')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editItem ? 'Edit Vendor' : 'Add Vendor'} size="sm">
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <Label required>Vendor Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. PilotFlyingJ" error={errors.name} autoFocus />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-gray-700">Active</div>
              <div className="text-[11px] text-gray-500">Enable this vendor</div>
            </div>
            <Switch checked={status} onCheckedChange={setStatus} />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Add Vendor'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
