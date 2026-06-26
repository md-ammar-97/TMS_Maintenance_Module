'use client'

import { X } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import type { Inspection, InspectionItemResult } from '@/types'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface InspectionDetailProps {
  inspection: Inspection
  onClose: () => void
}

const RESULT_CLASSES: Record<InspectionItemResult, string> = {
  OK: 'bg-green-50 text-green-700 border-green-200',
  NA: 'bg-gray-50 text-gray-500 border-gray-200',
  Def: 'bg-red-50 text-red-700 border-red-200',
}

export function InspectionDetail({ inspection, onClose }: InspectionDetailProps) {
  const { vehicles, trailers, carriers } = useApp()
  const isVehicle = inspection.unitType === 'Vehicle'
  const vehicle = isVehicle ? vehicles.find(v => v.id === inspection.vehicleId) : null
  const trailer = !isVehicle ? trailers.find(t => t.id === inspection.trailerId) : null
  const unit = vehicle ?? trailer
  const carrier = unit ? carriers.find(c => c.id === unit.carrierId) : null

  const defItems = inspection.items.filter(i => i.result === 'Def')
  const okCount = inspection.items.filter(i => i.result === 'OK').length
  const naCount = inspection.items.filter(i => i.result === 'NA').length

  return (
    <div className="w-[380px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <div className="text-[14px] font-semibold text-gray-900">
            {isVehicle ? `Vehicle #${vehicle?.vehicleNumber}` : `Trailer #${trailer?.trailerNumber}`}
          </div>
          <div className="text-[11px] text-gray-400">{carrier?.name ?? ''} · {formatDate(inspection.inspectionDate)}</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
          <X size={15} />
        </button>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-gray-100 grid grid-cols-3 gap-2 text-center">
        <div className="bg-green-50 rounded-md py-2">
          <div className="text-[18px] font-bold text-green-700">{okCount}</div>
          <div className="text-[10px] text-green-600 font-medium">OK</div>
        </div>
        <div className="bg-gray-50 rounded-md py-2">
          <div className="text-[18px] font-bold text-gray-600">{naCount}</div>
          <div className="text-[10px] text-gray-500 font-medium">N/A</div>
        </div>
        <div className="bg-red-50 rounded-md py-2">
          <div className="text-[18px] font-bold text-red-700">{defItems.length}</div>
          <div className="text-[10px] text-red-600 font-medium">Defects</div>
        </div>
      </div>

      {/* Meta */}
      <div className="px-4 py-3 border-b border-gray-100 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <div className="text-gray-400 text-[10px] uppercase font-semibold mb-0.5">Inspected By</div>
          <div className="text-gray-700">{inspection.inspectionBy ?? '—'}</div>
        </div>
        <div>
          <div className="text-gray-400 text-[10px] uppercase font-semibold mb-0.5">Mileage</div>
          <div className="text-gray-700">{inspection.mileage?.toLocaleString() ?? '—'}</div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {defItems.length > 0 && (
          <div className="px-4 pt-3 pb-2">
            <div className="text-[11px] font-semibold text-red-600 uppercase mb-2">Defective Items</div>
            {defItems.map(item => (
              <div key={item.itemNumber} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <div className="flex items-start gap-2 flex-1">
                  <span className="text-[11px] text-gray-400 w-5 flex-shrink-0 mt-0.5">{item.itemNumber}.</span>
                  <span className="text-[12px] text-gray-700 leading-snug">{item.description}</span>
                </div>
                <span className={cn('ml-2 px-1.5 py-0.5 rounded border text-[10px] font-semibold flex-shrink-0', RESULT_CLASSES['Def'])}>Def</span>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 pt-3 pb-4">
          <div className="text-[11px] font-semibold text-gray-500 uppercase mb-2">All Items</div>
          {inspection.items.map(item => (
            <div key={item.itemNumber} className="flex items-center justify-between py-1.5 border-b border-gray-50">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-[11px] text-gray-400 w-5 flex-shrink-0 mt-0.5">{item.itemNumber}.</span>
                <span className="text-[12px] text-gray-700 leading-snug">{item.description}</span>
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
