'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn, getUnitOptionLabel } from '@/lib/utils'
import { INSPECTORS, TRAILER_INSPECTION_ITEMS, VEHICLE_INSPECTION_ITEMS } from '@/types'
import type { Inspection, InspectionItemResult, UnitType } from '@/types'

type ItemResult = { itemNumber: number; description: string; result: InspectionItemResult }

function createInspectionItems(unitType: UnitType): ItemResult[] {
  const baseItems = unitType === 'Vehicle' ? VEHICLE_INSPECTION_ITEMS : TRAILER_INSPECTION_ITEMS
  return baseItems.map(item => ({ ...item, result: 'NA' }))
}

export default function NewInspectionPage() {
  const router = useRouter()
  const { vehicles, trailers, carriers, inspections, addInspection, updateInspection } = useApp()
  const [editId, setEditId] = useState<string | null>(null)
  const [unitType, setUnitType] = useState<UnitType>('Vehicle')
  const [carrierId, setCarrierId] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [trailerId, setTrailerId] = useState('')
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0])
  const [inspectionBy, setInspectionBy] = useState('')
  const [mileage, setMileage] = useState('')
  const [items, setItems] = useState<ItemResult[]>(() => createInspectionItems('Vehicle'))
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedEditId = params.get('edit')
    const type = params.get('type')
    const unit = params.get('unit')

    if (requestedEditId) {
      const inspection = inspections.find(item => item.id === requestedEditId)
      if (!inspection) return
      setEditId(inspection.id)
      setUnitType(inspection.unitType)
      setCarrierId(inspection.carrierId)
      setVehicleId(inspection.vehicleId ?? '')
      setTrailerId(inspection.trailerId ?? '')
      setInspectionDate(inspection.inspectionDate)
      setInspectionBy(inspection.inspectionBy)
      setMileage(inspection.mileage == null ? '' : String(inspection.mileage))
      setItems(inspection.items.map(item => ({ ...item })))
      return
    }

    if (type === 'trailer') {
      setUnitType('Trailer')
      setItems(createInspectionItems('Trailer'))
      if (unit) setTrailerId(unit)
    } else if (type === 'vehicle') {
      setUnitType('Vehicle')
      setItems(createInspectionItems('Vehicle'))
      if (unit) setVehicleId(unit)
    }
  }, [inspections])

  useEffect(() => {
    const unit = unitType === 'Vehicle'
      ? vehicles.find(v => v.id === vehicleId)
      : trailers.find(t => t.id === trailerId)
    if (unit) setCarrierId(unit.carrierId)
  }, [unitType, vehicleId, trailerId, vehicles, trailers])

  const unitOptions = useMemo(() => {
    if (unitType === 'Vehicle') {
      return vehicles.map(v => ({ value: v.id, label: getUnitOptionLabel(v.vehicleNumber, v.status) }))
    }
    return trailers.map(t => ({ value: t.id, label: getUnitOptionLabel(t.trailerNumber, t.status) }))
  }, [unitType, vehicles, trailers])

  function setResult(itemNumber: number, result: InspectionItemResult) {
    setItems(prev => prev.map(item => item.itemNumber === itemNumber ? { ...item, result } : item))
  }

  function setAllResult(result: InspectionItemResult) {
    setItems(prev => prev.map(item => ({ ...item, result })))
  }

  function handleUnitTypeChange(type: UnitType) {
    setUnitType(type)
    setVehicleId('')
    setTrailerId('')
    setMileage('')
    setCarrierId('')
    setItems(createInspectionItems(type))
  }

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (!carrierId) nextErrors.carrierId = 'Carrier is required'
    if (unitType === 'Vehicle' && !vehicleId) nextErrors.unit = 'Vehicle is required'
    if (unitType === 'Trailer' && !trailerId) nextErrors.unit = 'Trailer is required'
    if (unitType === 'Vehicle' && mileage && Number(mileage) < 0) nextErrors.mileage = 'Mileage must be 0 or greater'
    if (!inspectionDate) nextErrors.date = 'Inspection date is required'
    if (!inspectionBy) nextErrors.inspectionBy = 'Inspection by is required'
    return nextErrors
  }

  function handleSubmit() {
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const inspectionData: Omit<Inspection, 'id' | 'createdAt'> = {
      unitType,
      vehicleId: unitType === 'Vehicle' ? vehicleId : undefined,
      trailerId: unitType === 'Trailer' ? trailerId : undefined,
      carrierId,
      mileage: unitType === 'Vehicle' && mileage ? Number(mileage) : undefined,
      inspectionDate,
      inspectionBy,
      items,
    }

    if (editId) {
      updateInspection(editId, inspectionData)
      toast.success('Inspection updated')
    } else {
      addInspection(inspectionData)
      toast.success('Inspection saved')
    }

    const unitId = inspectionData.vehicleId ?? inspectionData.trailerId
    router.push(`/maintenance/inspection?type=${unitType.toLowerCase()}&unit=${unitId}`)
  }

  const defCount = items.filter(item => item.result === 'Def').length

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border bg-surface px-6 py-3">
        <button onClick={() => router.push('/maintenance/inspection')} className="flex h-8 w-8 items-center justify-center rounded hover:bg-surface-container-high text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-on-surface">{editId ? 'Edit inspection' : 'Create new inspection'}</h1>
          <p className="text-xs text-on-surface-variant">{unitType} checklist</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => router.push('/maintenance/inspection')} className="rounded border border-border px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">Back to list</button>
          <button onClick={handleSubmit} className="rounded bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container hover:bg-inverse-primary">{editId ? 'Save changes' : 'Save'}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-6">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-on-surface">Inspection Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Vehicle entity type</Label>
                <div className="flex gap-2">
                  {(['Vehicle', 'Trailer'] as UnitType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => handleUnitTypeChange(type)}
                      className={cn(
                        'h-9 flex-1 rounded border text-sm font-medium transition-colors',
                        unitType === type ? 'border-primary-container bg-primary-container/10 text-primary-container' : 'border-border text-on-surface-variant hover:border-outline'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label required>Carrier</Label>
                <Select value={carrierId} onValueChange={setCarrierId} options={carriers.map(c => ({ value: c.id, label: c.name }))} placeholder="Select carrier" error={errors.carrierId} />
              </div>

              <div>
                <Label required>{unitType}</Label>
                <Select
                  value={unitType === 'Vehicle' ? vehicleId : trailerId}
                  onValueChange={value => unitType === 'Vehicle' ? setVehicleId(value) : setTrailerId(value)}
                  options={unitOptions}
                  placeholder={`Select ${unitType.toLowerCase()}`}
                  error={errors.unit}
                />
              </div>

              {unitType === 'Vehicle' && (
                <div>
                  <Label>Mileage</Label>
                  <Input value={mileage} onChange={e => setMileage(e.target.value)} type="number" min={0} placeholder="e.g. 312000" error={errors.mileage} />
                </div>
              )}

              <div>
                <Label required>Inspection date</Label>
                <Input type="date" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} error={errors.date} />
              </div>

              <div>
                <Label required>Inspection by</Label>
                <Select value={inspectionBy} onValueChange={setInspectionBy} options={INSPECTORS.map(name => ({ value: name, label: name }))} placeholder="Select inspector" error={errors.inspectionBy} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-on-surface">Inspection Item</h2>
                <p className="mt-0.5 text-xs text-on-surface-variant">{items.length} items · {defCount > 0 ? `${defCount} defects` : 'No defects'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAllResult('OK')} className="rounded border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-medium text-success">Mark all OK</button>
                <button onClick={() => setAllResult('NA')} className="rounded border border-border bg-surface-container-low px-3 py-1.5 text-xs font-medium text-on-surface-variant">Mark all N/A</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {items.map(item => (
                <div key={item.itemNumber} className="rounded border border-border bg-surface-container-lowest p-3">
                  <div className="mb-3 flex gap-2">
                    <span className="font-mono text-xs text-outline">{item.itemNumber}.</span>
                    <span className="text-sm text-on-surface-variant">{item.description}</span>
                  </div>
                  <div className="grid grid-cols-3 overflow-hidden rounded border border-border">
                    {(['NA', 'OK', 'Def'] as InspectionItemResult[]).map(result => (
                      <button
                        key={result}
                        onClick={() => setResult(item.itemNumber, result)}
                        className={cn(
                          'h-9 border-r border-border text-xs font-semibold last:border-r-0',
                          item.result === result && result === 'OK' && 'bg-success/10 text-success',
                          item.result === result && result === 'Def' && 'bg-error/10 text-error',
                          item.result === result && result === 'NA' && 'bg-surface-container-high text-on-surface',
                          item.result !== result && 'text-on-surface-variant hover:bg-surface-container-low'
                        )}
                      >
                        {result}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => router.push('/maintenance/inspection')} className="rounded border border-border px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">Back to list</button>
            <button onClick={handleSubmit} className="rounded bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container hover:bg-inverse-primary">{editId ? 'Save changes' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
