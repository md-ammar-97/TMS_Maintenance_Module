'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency, generateId, getUnitOptionLabel } from '@/lib/utils'
import type { MaintenanceBill, MaintenanceBillLogItem, UnitType, Currency, PaymentStatus, PaymentMethod } from '@/types'

interface BillModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  editItem?: MaintenanceBill | null
}

const PAYMENT_METHODS: PaymentMethod[] = ['EFS', 'ComCheck', 'ACH', 'Cash', 'Card']

export function BillModal({ open, onOpenChange, editItem }: BillModalProps) {
  const { vehicles, trailers, vendors, carriers, maintenanceTypes, maintenancePlans, parts, addBill, updateBill, addLog } = useApp()

  const [unitType, setUnitType] = useState<UnitType>('Vehicle')
  const [billRefNumber, setBillRefNumber] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [trailerId, setTrailerId] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [carrierId, setCarrierId] = useState('')
  const [billDate, setBillDate] = useState('')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Pending')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [mileage, setMileage] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [workCompletedDate, setWorkCompletedDate] = useState('')
  const [logItems, setLogItems] = useState<MaintenanceBillLogItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (editItem) {
        setUnitType(editItem.unitType)
        setBillRefNumber(editItem.billRefNumber)
        setVehicleId(editItem.vehicleId ?? '')
        setTrailerId(editItem.trailerId ?? '')
        setVendorId(editItem.vendorId ?? '')
        setCarrierId(editItem.carrierId ?? '')
        setBillDate(editItem.billDate ?? '')
        setCurrency(editItem.currency)
        setPaymentStatus(editItem.paymentStatus)
        setPaymentMethod(editItem.paymentMethod ?? '')
        setMileage(editItem.mileage?.toString() ?? '')
        setLocation(editItem.location ?? '')
        setDescription(editItem.description ?? '')
        setWorkCompletedDate(editItem.workCompletedDate ?? '')
        setLogItems(editItem.logItems ?? [])
      } else {
        setUnitType('Vehicle')
        setBillRefNumber('')
        setVehicleId('')
        setTrailerId('')
        setVendorId('')
        setCarrierId('')
        setBillDate(new Date().toISOString().split('T')[0])
        setCurrency('USD')
        setPaymentStatus('Pending')
        setPaymentMethod('')
        setMileage('')
        setLocation('')
        setDescription('')
        setWorkCompletedDate('')
        setLogItems([{ id: generateId(), logType: 'Service', amount: 0, description: '' }])
      }
      setErrors({})
    }
  }, [open, editItem])

  // Auto-fill carrier when vehicle/trailer selected
  useEffect(() => {
    if (vehicleId) {
      const v = vehicles.find(x => x.id === vehicleId)
      if (v) setCarrierId(v.carrierId)
    }
  }, [vehicleId, vehicles])
  useEffect(() => {
    if (trailerId) {
      const t = trailers.find(x => x.id === trailerId)
      if (t) setCarrierId(t.carrierId)
    }
  }, [trailerId, trailers])

  const vehicleOptions = vehicles.map(v => ({ value: v.id, label: getUnitOptionLabel(v.vehicleNumber, v.status) }))
  const trailerOptions = trailers.map(t => ({ value: t.id, label: getUnitOptionLabel(t.trailerNumber, t.status) }))
  const vendorOptions = vendors.filter(v => v.status).map(v => ({ value: v.id, label: v.name }))
  const carrierOptions = carriers.map(c => ({ value: c.id, label: c.name }))
  const typeOptions = maintenanceTypes.map(t => ({ value: t.id, label: t.name }))
  const planOptions = maintenancePlans.map(p => ({ value: p.id, label: p.name }))
  const partOptions = parts.map(p => ({ value: p.id, label: p.name }))

  const totalAmount = logItems.reduce((s, i) => s + (Number(i.amount) || 0), 0)

  function addLineItem() {
    setLogItems(prev => [...prev, { id: generateId(), logType: 'Service', amount: 0, description: '' }])
  }
  function removeLineItem(id: string) {
    setLogItems(prev => prev.filter(i => i.id !== id))
  }
  function updateLineItem(id: string, updates: Partial<MaintenanceBillLogItem>) {
    setLogItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!billRefNumber.trim()) e.billRefNumber = 'Bill Ref Number is required'
    if (!vendorId) e.vendorId = 'Vendor is required'
    if (unitType === 'Vehicle' && !vehicleId) e.vehicleId = 'Select a vehicle'
    if (unitType === 'Trailer' && !trailerId) e.trailerId = 'Select a trailer'
    if (unitType === 'Vehicle' && (!mileage || isNaN(Number(mileage)) || Number(mileage) < 0)) e.mileage = 'Mileage is required for vehicles'
    if (!billDate) e.billDate = 'Bill date required'
    if (logItems.length === 0) e.items = 'Add at least one line item'
    logItems.forEach((item, index) => {
      if (!item.amount || Number(item.amount) <= 0) e.items = `Line item ${index + 1} needs an amount`
      if (item.logType === 'Service' && !item.maintenanceTypeId) e.items = `Line item ${index + 1} needs a maintenance type`
      if (item.logType === 'Part' && !item.partId) e.items = `Line item ${index + 1} needs a part`
    })
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const payload: Omit<MaintenanceBill, 'id' | 'createdAt'> = {
      billRefNumber: billRefNumber.trim(),
      unitType,
      vehicleId: unitType === 'Vehicle' ? vehicleId : undefined,
      trailerId: unitType === 'Trailer' ? trailerId : undefined,
      vendorId,
      carrierId: carrierId || undefined,
      billDate,
      currency,
      totalAmount,
      paymentStatus,
      paymentMethod: paymentMethod || undefined,
      mileage: unitType === 'Vehicle' && mileage ? Number(mileage) : undefined,
      location: location || undefined,
      description: description || undefined,
      workCompletedDate: workCompletedDate || undefined,
      logItems,
      linkedLogIds: editItem?.linkedLogIds ?? [],
    }

    if (editItem) {
      updateBill(editItem.id, payload)
      toast.success('Bill updated')
    } else {
      const newBill = addBill(payload)
      const linkedLogIds: string[] = []
      // Auto-create a log entry for each line item
      logItems.forEach(item => {
        const part = item.partId ? parts.find(p => p.id === item.partId) : undefined
        const newLog = addLog({
          unitType,
          vehicleId: unitType === 'Vehicle' ? vehicleId : undefined,
          trailerId: unitType === 'Trailer' ? trailerId : undefined,
          maintenanceTypeId: item.maintenanceTypeId ?? '',
          externalMaintenanceType: item.logType === 'Part' ? part?.name ?? 'Part' : undefined,
          maintenancePlanId: item.maintenancePlanId,
          vendorId,
          mileage: unitType === 'Vehicle' && mileage ? Number(mileage) : undefined,
          serviceDate: billDate,
          currency,
          amount: Number(item.amount) || 0,
          description: item.description || description || undefined,
          billRefNumber: newBill.billRefNumber,
          billId: newBill.id,
          createdBy: 'demo',
        })
        linkedLogIds.push(newLog.id)
      })
      updateBill(newBill.id, { linkedLogIds })
      toast.success('Bill added and logs created')
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title={editItem ? 'Edit Bill' : 'Add Maintenance Bill'} width="w-[580px]">
        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Unit type */}
          <div>
            <Label required>Bill Ref Number</Label>
            <Input
              value={billRefNumber}
              onChange={e => setBillRefNumber(e.target.value)}
              placeholder="e.g. BILL-V004"
              error={errors.billRefNumber}
            />
          </div>

          {/* Unit type */}
          <div>
            <Label>Unit Type</Label>
            <div className="flex gap-2">
              {(['Vehicle', 'Trailer'] as UnitType[]).map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setUnitType(t)
                    if (t === 'Vehicle') setTrailerId('')
                    if (t === 'Trailer') {
                      setVehicleId('')
                      setMileage('')
                    }
                  }}
                  className={`flex-1 h-9 text-sm rounded border transition-colors font-medium ${unitType === t ? 'border-primary-container bg-primary-container/10 text-primary-container' : 'border-border bg-transparent text-on-surface-variant hover:border-outline hover:text-on-surface'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <Label>Carrier</Label>
              <Select value={carrierId} onValueChange={setCarrierId} options={carrierOptions} placeholder="Auto-filled" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Vendor</Label>
              <Select value={vendorId} onValueChange={setVendorId} options={vendorOptions} placeholder="Select vendor" error={errors.vendorId} />
            </div>
            <div>
              <Label required>Bill Date</Label>
              <Input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} error={errors.billDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Work Completed Date</Label>
              <Input type="date" value={workCompletedDate} onChange={e => setWorkCompletedDate(e.target.value)} />
            </div>
            {unitType === 'Vehicle' && (
              <div>
                <Label>Mileage</Label>
                <Input value={mileage} onChange={e => setMileage(e.target.value)} type="number" min={0} placeholder="e.g. 312000" error={errors.mileage} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Currency</Label>
              <Select value={currency} onValueChange={v => setCurrency(v as Currency)} options={[{ value: 'USD', label: 'USD' }, { value: 'CAD', label: 'CAD' }]} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Chicago, IL" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={v => setPaymentStatus(v as PaymentStatus)} options={[{ value: 'Pending', label: 'Pending' }, { value: 'Paid', label: 'Paid' }]} />
            </div>
            {paymentStatus === 'Paid' && (
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as PaymentMethod)} options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))} placeholder="Select method" />
              </div>
            )}
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[50px]" />
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="mb-0">Line Items</Label>
              <button onClick={addLineItem} className="text-xs text-primary flex items-center gap-1 hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[14px]">add</span> Add Item
              </button>
            </div>
            {errors.items && <p className="text-[11px] text-error mb-2">{errors.items}</p>}
            <div className="flex flex-col gap-2">
              {logItems.map((item, idx) => (
                <div key={item.id} className="border border-border rounded p-3 bg-surface-container-low">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-on-surface-variant uppercase font-mono">Item {idx + 1}</span>
                    {logItems.length > 1 && (
                      <button onClick={() => removeLineItem(item.id)} className="text-error hover:text-error/80 p-0.5 rounded hover:bg-error/10 transition-colors">
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px]">Type</Label>
                      <Select
                        value={item.logType}
                        onValueChange={v => updateLineItem(item.id, { logType: v as 'Service' | 'Part', partId: undefined, maintenanceTypeId: undefined })}
                        options={[{ value: 'Service', label: 'Service' }, { value: 'Part', label: 'Part' }]}
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.amount || ''}
                        onChange={e => updateLineItem(item.id, { amount: Number(e.target.value) })}
                        placeholder="0.00"
                      />
                    </div>
                    {item.logType === 'Service' && (
                      <>
                        <div>
                          <Label className="text-[10px]">Maint. Type</Label>
                          <Select value={item.maintenanceTypeId ?? ''} onValueChange={v => updateLineItem(item.id, { maintenanceTypeId: v || undefined })} options={typeOptions} placeholder="Select" />
                        </div>
                        <div>
                          <Label className="text-[10px]">Plan</Label>
                          <Select value={item.maintenancePlanId ?? ''} onValueChange={v => updateLineItem(item.id, { maintenancePlanId: v || undefined })} options={planOptions} placeholder="Select" />
                        </div>
                      </>
                    )}
                    {item.logType === 'Part' && (
                      <div className="col-span-2">
                        <Label className="text-[10px]">Part</Label>
                        <Select value={item.partId ?? ''} onValueChange={v => updateLineItem(item.id, { partId: v || undefined })} options={partOptions} placeholder="Select part" />
                      </div>
                    )}
                    <div className="col-span-2">
                      <Label className="text-[10px]">Description</Label>
                      <Input value={item.description || ''} onChange={e => updateLineItem(item.id, { description: e.target.value })} placeholder="Optional" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {logItems.length > 0 && (
              <div className="flex justify-end mt-2 text-sm font-semibold text-on-surface font-mono">
                Total: {formatCurrency(totalAmount, currency)}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editItem ? 'Save Changes' : 'Create Bill'}</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
