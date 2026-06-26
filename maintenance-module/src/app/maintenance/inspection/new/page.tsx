'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { VEHICLE_INSPECTION_ITEMS, TRAILER_INSPECTION_ITEMS } from '@/types'
import type { UnitType, InspectionItemResult } from '@/types'

type ItemResult = { itemNumber: number; description: string; result: InspectionItemResult }

export default function NewInspectionPage() {
  const router = useRouter()
  const { vehicles, trailers, carriers, addInspection } = useApp()

  const [unitType, setUnitType] = useState<UnitType>('Vehicle')
  const [vehicleId, setVehicleId] = useState('')
  const [trailerId, setTrailerId] = useState('')
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0])
  const [inspectionBy, setInspectionBy] = useState('')
  const [mileage, setMileage] = useState('')
  const [items, setItems] = useState<ItemResult[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const baseItems = unitType === 'Vehicle' ? VEHICLE_INSPECTION_ITEMS : TRAILER_INSPECTION_ITEMS
    setItems(baseItems.map(i => ({ ...i, result: 'OK' as InspectionItemResult })))
  }, [unitType])

  const vehicleOptions = vehicles.map(v => {
    const c = carriers.find(x => x.id === v.carrierId)
    return { value: v.id, label: `${v.vehicleNumber}${c ? ` — ${c.name}` : ''}` }
  })
  const trailerOptions = trailers.map(t => {
    const c = carriers.find(x => x.id === t.carrierId)
    return { value: t.id, label: `${t.trailerNumber}${c ? ` — ${c.name}` : ''}` }
  })

  function setResult(itemNumber: number, result: InspectionItemResult) {
    setItems(prev => prev.map(i => i.itemNumber === itemNumber ? { ...i, result } : i))
  }

  function setAllResult(result: InspectionItemResult) {
    setItems(prev => prev.map(i => ({ ...i, result })))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (unitType === 'Vehicle' && !vehicleId) e.unit = 'Select a vehicle'
    if (unitType === 'Trailer' && !trailerId) e.unit = 'Select a trailer'
    if (!inspectionDate) e.date = 'Date required'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const unit = unitType === 'Vehicle' ? vehicles.find(v => v.id === vehicleId) : trailers.find(t => t.id === trailerId)

    addInspection({
      unitType,
      vehicleId: unitType === 'Vehicle' ? vehicleId : undefined,
      trailerId: unitType === 'Trailer' ? trailerId : undefined,
      carrierId: unit?.carrierId,
      mileage: mileage ? Number(mileage) : undefined,
      inspectionDate,
      inspectionBy: inspectionBy || undefined,
      items,
    })
    toast.success('Inspection saved')
    router.push('/maintenance/inspection')
  }

  const defCount = items.filter(i => i.result === 'Def').length

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top bar */}
      <div className="bg-surface border-b border-border px-6 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>
        <div>
          <h1 className="text-sm font-semibold text-on-surface">New Inspection</h1>
          <p className="text-xs text-on-surface-variant">{unitType} inspection</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => router.back()} className="px-4 py-2 border border-border rounded text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-primary-container text-on-primary-container rounded text-sm font-medium hover:bg-inverse-primary transition-colors">Save Inspection</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-5">
          {/* Meta card */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold text-on-surface mb-4">Inspection Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Unit type toggle */}
              <div className="col-span-2">
                <Label>Unit Type</Label>
                <div className="flex gap-2">
                  {(['Vehicle', 'Trailer'] as UnitType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => { setUnitType(t); setVehicleId(''); setTrailerId('') }}
                      className={cn(
                        'flex-1 h-9 text-sm rounded border transition-colors font-medium',
                        unitType === t
                          ? 'border-primary-container bg-primary-container/10 text-primary-container'
                          : 'border-border bg-transparent text-on-surface-variant hover:border-outline hover:text-on-surface'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label required>{unitType}</Label>
                {unitType === 'Vehicle' ? (
                  <Select value={vehicleId} onValueChange={setVehicleId} options={vehicleOptions} placeholder="Select vehicle" error={errors.unit} />
                ) : (
                  <Select value={trailerId} onValueChange={setTrailerId} options={trailerOptions} placeholder="Select trailer" error={errors.unit} />
                )}
              </div>

              <div>
                <Label required>Inspection Date</Label>
                <Input type="date" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} error={errors.date} />
              </div>

              <div>
                <Label>Inspected By</Label>
                <Input value={inspectionBy} onChange={e => setInspectionBy(e.target.value)} placeholder="Inspector name" />
              </div>

              {unitType === 'Vehicle' && (
                <div>
                  <Label>Mileage</Label>
                  <Input value={mileage} onChange={e => setMileage(e.target.value)} type="number" placeholder="e.g. 312000" />
                </div>
              )}
            </div>
          </div>

          {/* Inspection items */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-on-surface">Inspection Items</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">{items.length} items · {defCount > 0 ? `${defCount} defects` : 'No defects'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setAllResult('OK')} className="text-xs text-success bg-success/10 px-3 py-1.5 rounded hover:bg-success/20 transition-colors">All OK</button>
                <button onClick={() => setAllResult('NA')} className="text-xs text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded hover:bg-surface-container-highest transition-colors">All N/A</button>
              </div>
            </div>

            <div className="space-y-0">
              <div className="grid grid-cols-[1fr_auto] gap-2 pb-2 border-b border-border">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase font-mono">Item</span>
                <div className="flex gap-2">
                  {(['OK', 'NA', 'Def'] as InspectionItemResult[]).map(r => (
                    <span key={r} className="w-12 text-center text-[10px] font-semibold text-on-surface-variant uppercase font-mono">{r}</span>
                  ))}
                </div>
              </div>

              {items.map(item => (
                <div
                  key={item.itemNumber}
                  className={cn(
                    'grid grid-cols-[1fr_auto] gap-2 py-2.5 border-b border-border items-center',
                    item.result === 'Def' && 'bg-error/5 -mx-5 px-5'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[11px] text-outline w-5 flex-shrink-0 mt-0.5">{item.itemNumber}.</span>
                    <span className="text-sm text-on-surface-variant">{item.description}</span>
                  </div>
                  <div className="flex gap-2">
                    {(['OK', 'NA', 'Def'] as InspectionItemResult[]).map(r => (
                      <button
                        key={r}
                        onClick={() => setResult(item.itemNumber, r)}
                        className={cn(
                          'w-12 h-8 rounded text-[11px] font-semibold border transition-colors',
                          item.result === r
                            ? r === 'OK' ? 'bg-success border-success text-white'
                              : r === 'NA' ? 'bg-surface-container-highest border-outline-variant text-on-surface'
                              : 'bg-error border-error text-white'
                            : 'bg-transparent border-border text-on-surface-variant hover:border-outline hover:text-on-surface'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => router.back()} className="px-4 py-2 border border-border rounded text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-primary-container text-on-primary-container rounded text-sm font-medium hover:bg-inverse-primary transition-colors">Save Inspection</button>
          </div>
        </div>
      </div>
    </div>
  )
}
