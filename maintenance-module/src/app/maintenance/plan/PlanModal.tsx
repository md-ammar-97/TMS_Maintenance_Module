'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { MaintenancePlan, IntervalType } from '@/types'

interface PlanModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem: MaintenancePlan | null
}

const INTERVAL_TYPES: IntervalType[] = ['Days', 'Months', 'Mileage']

export function PlanModal({ open, onOpenChange, editItem }: PlanModalProps) {
  const { maintenanceTypes, addMaintenancePlan, updateMaintenancePlan } = useApp()
  const [name, setName] = useState('')
  const [typeId, setTypeId] = useState('')
  const [description, setDescription] = useState('')
  const [intervalType, setIntervalType] = useState<IntervalType>('Mileage')
  const [interval, setInterval] = useState('')
  const [validateUpcoming, setValidateUpcoming] = useState(false)
  const [validateDue, setValidateDue] = useState(false)
  const [status, setStatus] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setName(editItem?.name ?? '')
      setTypeId(editItem?.maintenanceTypeId ?? '')
      setDescription(editItem?.description ?? '')
      setIntervalType(editItem?.intervalType ?? 'Mileage')
      setInterval(editItem?.interval?.toString() ?? '')
      setValidateUpcoming(editItem?.validateUpcomingAtDispatch ?? false)
      setValidateDue(editItem?.validateDueAtDispatch ?? false)
      setStatus(editItem?.status ?? true)
      setErrors({})
    }
  }, [open, editItem])

  const typeOptions = maintenanceTypes.map(t => ({ value: t.id, label: t.name }))

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required'
    if (!typeId) e.typeId = 'Select a maintenance type'
    if (!interval || isNaN(Number(interval)) || Number(interval) <= 0) e.interval = 'Enter a valid interval'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const payload = {
      name: name.trim(), maintenanceTypeId: typeId, description: description.trim(),
      intervalType, interval: Number(interval),
      validateUpcomingAtDispatch: validateUpcoming, validateDueAtDispatch: validateDue,
      status,
    }
    if (editItem) {
      updateMaintenancePlan(editItem.id, payload)
      toast.success('Plan updated')
    } else {
      addMaintenancePlan(payload)
      toast.success('Plan added')
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={editItem ? 'Edit Plan' : 'Add Plan'} size="md">
        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Plan Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} error={errors.name} placeholder="e.g. 30000 miles" />
            </div>
            <div>
              <Label required>Maintenance Type</Label>
              <Select value={typeId} onValueChange={setTypeId} options={typeOptions} placeholder="Select type" error={errors.typeId} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[60px]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Interval Type</Label>
              <Select
                value={intervalType}
                onValueChange={v => setIntervalType(v as IntervalType)}
                options={INTERVAL_TYPES.map(t => ({ value: t, label: t }))}
              />
            </div>
            <div>
              <Label required>Interval</Label>
              <Input
                value={interval}
                onChange={e => setInterval(e.target.value)}
                type="number"
                min={1}
                error={errors.interval}
                placeholder={intervalType === 'Mileage' ? '30000' : intervalType === 'Days' ? '90' : '3'}
              />
            </div>
          </div>

          <div className="border border-gray-100 rounded-md p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-gray-700">Validate Upcoming at Dispatch</div>
                <div className="text-[11px] text-gray-500">Warn when maintenance is upcoming</div>
              </div>
              <Switch checked={validateUpcoming} onCheckedChange={setValidateUpcoming} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-gray-700">Validate Due at Dispatch</div>
                <div className="text-[11px] text-gray-500">Block dispatch when maintenance is due</div>
              </div>
              <Switch checked={validateDue} onCheckedChange={setValidateDue} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-medium text-gray-700">Status</div>
                <div className="text-[11px] text-gray-500">Active / Inactive</div>
              </div>
              <Switch checked={status} onCheckedChange={setStatus} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Add Plan'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
