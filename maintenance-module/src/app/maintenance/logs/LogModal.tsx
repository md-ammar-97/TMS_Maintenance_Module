'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { MaintenanceLog, UnitType, Currency, TirePosition } from '@/types'

interface LogModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem?: MaintenanceLog | null
  prefillVehicleId?: string
  prefillTrailerId?: string
  prefillPlanId?: string
}

const TIRE_POSITIONS: TirePosition[] = ['LFI', 'LFO', 'RFI', 'RFO', 'LRI', 'LRO', 'RRI', 'RRO', 'RS', 'LS']

export function LogModal({ open, onOpenChange, editItem, prefillVehicleId, prefillTrailerId, prefillPlanId }: LogModalProps) {
  const { vehicles, trailers, vendors, maintenanceTypes, maintenancePlans, parts, carriers, addLog, updateLog } = useApp()

  const [unitType, setUnitType] = useState<UnitType>('Vehicle')
  const [vehicleId, setVehicleId] = useState('')
  const [trailerId, setTrailerId] = useState('')
  const [maintenanceTypeId, setMaintenanceTypeId] = useState('')
  const [maintenancePlanId, setMaintenancePlanId] = useState('')
  const [tirePosition, setTirePosition] = useState<TirePosition | ''>('')
  const [vendorId, setVendorId] = useState('')
  const [mileage, setMileage] = useState('')
  const [serviceDate, setServiceDate] = useState('')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [billRefNumber, setBillRefNumber] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (editItem) {
        setUnitType(editItem.unitType)
        setVehicleId(editItem.vehicleId ?? '')
        setTrailerId(editItem.trailerId ?? '')
        setMaintenanceTypeId(editItem.maintenanceTypeId ?? '')
        setMaintenancePlanId(editItem.maintenancePlanId ?? '')
        setTirePosition(editItem.tirePosition ?? '')
        setVendorId(editItem.vendorId ?? '')
        setMileage(editItem.mileage?.toString() ?? '')
        setServiceDate(editItem.serviceDate ?? '')
        setCurrency(editItem.currency ?? 'USD')
        setAmount(editItem.amount?.toString() ?? '')
        setDescription(editItem.description ?? '')
        setBillRefNumber(editItem.billRefNumber ?? '')
      } else {
        setUnitType(prefillTrailerId ? 'Trailer' : 'Vehicle')
        setVehicleId(prefillVehicleId ?? '')
        setTrailerId(prefillTrailerId ?? '')
        setMaintenancePlanId(prefillPlanId ?? '')
        setMaintenanceTypeId('')
        setTirePosition('')
        setVendorId('')
        setMileage('')
        setServiceDate(new Date().toISOString().split('T')[0])
        setCurrency('USD')
        setAmount('')
        setDescription('')
        setBillRefNumber('')
      }
      setErrors({})
    }
  }, [open, editItem, prefillVehicleId, prefillTrailerId, prefillPlanId])

  const vehicleOptions = vehicles.map(v => {
    const c = carriers.find(x => x.id === v.carrierId)
    return { value: v.id, label: `${v.vehicleNumber}${c ? ` — ${c.name}` : ''}` }
  })
  const trailerOptions = trailers.map(t => {
    const c = carriers.find(x => x.id === t.carrierId)
    return { value: t.id, label: `${t.trailerNumber}${c ? ` — ${c.name}` : ''}` }
  })
  const typeOptions = maintenanceTypes.map(t => ({ value: t.id, label: t.name }))
  const planOptions = maintenancePlans.filter(p => !maintenanceTypeId || p.maintenanceTypeId === maintenanceTypeId).map(p => ({ value: p.id, label: p.name }))
  const vendorOptions = vendors.filter(v => v.status).map(v => ({ value: v.id, label: v.name }))

  const isTireType = maintenanceTypes.find(t => t.id === maintenanceTypeId)?.name.toLowerCase().includes('tire')

  function validate() {
    const e: Record<string, string> = {}
    if (unitType === 'Vehicle' && !vehicleId) e.vehicleId = 'Select a vehicle'
    if (unitType === 'Trailer' && !trailerId) e.trailerId = 'Select a trailer'
    if (!serviceDate) e.serviceDate = 'Service date required'
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) e.amount = 'Enter a valid amount'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const payload: Omit<MaintenanceLog, 'id' | 'createdAt'> = {
      unitType,
      vehicleId: unitType === 'Vehicle' ? vehicleId : undefined,
      trailerId: unitType === 'Trailer' ? trailerId : undefined,
      maintenanceTypeId: maintenanceTypeId || undefined,
      maintenancePlanId: maintenancePlanId || undefined,
      tirePosition: (isTireType && tirePosition) ? tirePosition as TirePosition : undefined,
      vendorId: vendorId || undefined,
      mileage: mileage ? Number(mileage) : undefined,
      serviceDate,
      currency,
      amount: Number(amount),
      description,
      billRefNumber: billRefNumber || undefined,
      createdBy: 'demo',
    }

    if (editItem) {
      updateLog(editItem.id, payload)
      toast.success('Log updated')
    } else {
      addLog(payload)
      toast.success('Maintenance log added')
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={editItem ? 'Edit Log' : 'Add Maintenance Log'} width="w-[540px]">
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Unit Type */}
          <div>
            <Label>Unit Type</Label>
            <div className="flex gap-2">
              {(['Vehicle', 'Trailer'] as UnitType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setUnitType(t)}
                  className={`flex-1 h-9 text-[13px] rounded-md border transition-colors ${unitType === t ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Unit selector */}
          {unitType === 'Vehicle' ? (
            <div>
              <Label required>Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId} options={vehicleOptions} placeholder="Select vehicle" error={errors.vehicleId} />
            </div>
          ) : (
            <div>
              <Label required>Trailer</Label>
              <Select value={trailerId} onValueChange={setTrailerId} options={trailerOptions} placeholder="Select trailer" error={errors.trailerId} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Maintenance Type</Label>
              <Select value={maintenanceTypeId} onValueChange={setMaintenanceTypeId} options={typeOptions} placeholder="Select type" />
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={maintenancePlanId} onValueChange={setMaintenancePlanId} options={planOptions} placeholder="Select plan" />
            </div>
          </div>

          {isTireType && (
            <div>
              <Label>Tire Position</Label>
              <Select value={tirePosition} onValueChange={v => setTirePosition(v as TirePosition)} options={TIRE_POSITIONS.map(p => ({ value: p, label: p }))} placeholder="Select position" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Vendor</Label>
              <Select value={vendorId} onValueChange={setVendorId} options={vendorOptions} placeholder="Select vendor" />
            </div>
            <div>
              <Label>Service Date</Label>
              <Input type="date" value={serviceDate} onChange={e => setServiceDate(e.target.value)} error={errors.serviceDate} />
            </div>
          </div>

          {unitType === 'Vehicle' && (
            <div>
              <Label>Mileage</Label>
              <Input value={mileage} onChange={e => setMileage(e.target.value)} type="number" placeholder="e.g. 312000" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Amount</Label>
              <Input value={amount} onChange={e => setAmount(e.target.value)} type="number" step="0.01" placeholder="0.00" error={errors.amount} />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)} options={[{ value: 'USD', label: 'USD' }, { value: 'CAD', label: 'CAD' }]} />
            </div>
          </div>

          <div>
            <Label>Bill Reference #</Label>
            <Input value={billRefNumber} onChange={e => setBillRefNumber(e.target.value)} placeholder="e.g. BILL-001" />
          </div>

          <div>
            <Label>Description / Notes</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Add Log'}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
