'use client'

import { useApp } from '@/context/AppContext'
import type { Inspection, InspectionItemResult } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface InspectionDetailProps {
  inspection: Inspection
  onClose: () => void
}

const RESULT_CLASSES: Record<InspectionItemResult, string> = {
  OK: 'bg-success/10 text-success border-success/20',
  NA: 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
  Def: 'bg-error/10 text-error border-error/20',
}

export function InspectionDetail({ inspection, onClose }: InspectionDetailProps) {
  const { vehicles, trailers, carriers } = useApp()
  const isVehicle = inspection.unitType === 'Vehicle'
  const vehicle = isVehicle ? vehicles.find(v => v.id === inspection.vehicleId) : null
  const trailer = !isVehicle ? trailers.find(t => t.id === inspection.trailerId) : null
  const unit = vehicle ?? trailer
  const carrier = unit ? carriers.find(c => c.id === unit.carrierId) : null

  const defItems = inspection.items.filter(i => i.result === 'Def')
  const okCount  = inspection.items.filter(i => i.result === 'OK').length
  const naCount  = inspection.items.filter(i => i.result === 'NA').length

  return (
    <div className="w-[380px] flex-shrink-0 border-l border-border bg-surface-container-lowest flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <div className="text-sm font-semibold text-on-surface">
            {isVehicle ? `Vehicle #${vehicle?.vehicleNumber}` : `Trailer #${trailer?.trailerNumber}`}
          </div>
          <div className="text-xs text-on-surface-variant mt-0.5">{carrier?.name ?? ''} · {formatDate(inspection.inspectionDate)}</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container-high text-on-surface-variant transition-colors">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-border grid grid-cols-3 gap-2 text-center">
        <div className="bg-success/10 rounded py-2">
          <div className="text-lg font-bold text-success">{okCount}</div>
          <div className="text-[10px] text-success font-mono uppercase">OK</div>
        </div>
        <div className="bg-surface-container-high rounded py-2">
          <div className="text-lg font-bold text-on-surface-variant">{naCount}</div>
          <div className="text-[10px] text-on-surface-variant font-mono uppercase">N/A</div>
        </div>
        <div className="bg-error/10 rounded py-2">
          <div className="text-lg font-bold text-error">{defItems.length}</div>
          <div className="text-[10px] text-error font-mono uppercase">Defects</div>
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 py-3 border-b border-border grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-on-surface-variant text-[10px] uppercase font-mono tracking-wider mb-0.5">Inspected By</div>
          <div className="text-on-surface">{inspection.inspectionBy ?? '—'}</div>
        </div>
        <div>
          <div className="text-on-surface-variant text-[10px] uppercase font-mono tracking-wider mb-0.5">Mileage</div>
          <div className="text-on-surface font-mono">{inspection.mileage?.toLocaleString() ?? '—'}</div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {defItems.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            <div className="text-[11px] font-semibold text-error uppercase font-mono mb-2">Defective Items</div>
            {defItems.map(item => (
              <div key={item.itemNumber} className="flex items-center justify-between py-1.5 border-b border-border">
                <div className="flex items-start gap-2 flex-1">
                  <span className="text-[11px] text-outline w-5 flex-shrink-0 mt-0.5">{item.itemNumber}.</span>
                  <span className="text-xs text-on-surface-variant leading-snug">{item.description}</span>
                </div>
                <span className={cn('ml-2 px-1.5 py-0.5 rounded border text-[10px] font-semibold flex-shrink-0', RESULT_CLASSES['Def'])}>Def</span>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 pt-3 pb-4">
          <div className="text-[11px] font-semibold text-on-surface-variant uppercase font-mono mb-2">All Items</div>
          {inspection.items.map(item => (
            <div key={item.itemNumber} className="flex items-center justify-between py-1.5 border-b border-border">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-[11px] text-outline w-5 flex-shrink-0 mt-0.5">{item.itemNumber}.</span>
                <span className="text-xs text-on-surface-variant leading-snug">{item.description}</span>
              </div>
              <span className={cn('ml-2 px-1.5 py-0.5 rounded border text-[10px] font-semibold flex-shrink-0', RESULT_CLASSES[item.result])}>
                {item.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
