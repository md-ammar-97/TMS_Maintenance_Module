'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { cn, formatDate } from '@/lib/utils'
import Link from 'next/link'

function InspStatusBadge({ status }: { status: string }) {
  if (status === 'Passed')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success border border-success/20">Passed</span>
  if (status === 'Failed')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-error/10 text-error border border-error/20">Failed</span>
  if (status?.includes('Minor'))
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning border border-warning/20">{status}</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant">{status}</span>
}

export default function InspectionPage() {
  const { vehicles, trailers, inspections } = useApp()
  const [unitSearch, setUnitSearch] = useState('')
  const [selectedUnit, setSelectedUnit] = useState<{ type: 'vehicle' | 'trailer'; id: string } | null>(null)

  const allUnits = useMemo(() => [
    ...vehicles.map(v => ({ type: 'vehicle' as const, id: v.id, number: v.vehicleNumber, carrierId: v.carrierId })),
    ...trailers.map(t => ({ type: 'trailer' as const, id: t.id, number: t.trailerNumber, carrierId: t.carrierId })),
  ].filter(u => !unitSearch || u.number.toLowerCase().includes(unitSearch.toLowerCase())), [vehicles, trailers, unitSearch])

  const unitInspections = useMemo(() => {
    if (!selectedUnit) return []
    return inspections.filter(i =>
      selectedUnit.type === 'vehicle' ? i.vehicleId === selectedUnit.id : i.trailerId === selectedUnit.id
    )
  }, [inspections, selectedUnit])

  const lastInspection = unitInspections[0] ?? null
  const defCount = lastInspection ? lastInspection.items.filter(i => i.result === 'Def').length : 0
  const isCompliant = lastInspection ? defCount === 0 : false

  const selectedUnitData = selectedUnit
    ? (selectedUnit.type === 'vehicle'
        ? vehicles.find(v => v.id === selectedUnit.id)
        : trailers.find(t => t.id === selectedUnit.id))
    : null

  const unitNum = selectedUnit?.type === 'vehicle'
    ? (selectedUnitData as typeof vehicles[0])?.vehicleNumber ?? ''
    : (selectedUnitData as typeof trailers[0])?.trailerNumber ?? ''

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — Unit selection */}
      <div className="w-80 border-r border-border flex flex-col bg-surface-container-lowest shrink-0">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-on-surface mb-3">Unit Selection</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input
              value={unitSearch}
              onChange={e => setUnitSearch(e.target.value)}
              placeholder="Search units..."
              className="h-9 w-full pl-9 pr-3 text-sm rounded border bg-surface-container-low border-border text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {allUnits.length === 0 ? (
            <p className="text-center text-sm text-outline p-4">No units found.</p>
          ) : (
            allUnits.map(unit => {
              const isActive = selectedUnit?.id === unit.id
              return (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={cn(
                    'w-full text-left px-3 py-3 rounded-lg mb-1 border transition-colors',
                    isActive
                      ? 'bg-surface-container border-border text-primary'
                      : 'border-transparent hover:bg-surface-container-low hover:border-border text-on-surface'
                  )}
                >
                  <div className={cn('text-sm font-medium', isActive ? 'font-bold' : '')}>{unit.number}</div>
                  <div className="text-xs text-outline mt-0.5 capitalize">{unit.type}</div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {!selectedUnit ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3 block">fact_check</span>
              <p className="text-on-surface-variant text-sm">Select a unit to view inspection records.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Status cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Status card */}
              <div className="col-span-2 bg-surface rounded-lg border border-border p-4">
                <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-3">Current Status: {unitNum}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('h-2.5 w-2.5 rounded-full', isCompliant ? 'bg-success' : 'bg-error')} />
                  <span className={cn('text-base font-semibold', isCompliant ? 'text-success' : 'text-error')}>
                    {isCompliant ? 'Compliant' : 'Non-Compliant'}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  Last Inspection: <span className="text-on-surface">{lastInspection ? formatDate(lastInspection.inspectionDate) : 'No record'}</span>
                </div>
                {defCount > 0 && (
                  <div className="text-xs text-error mt-1">{defCount} defect{defCount > 1 ? 's' : ''} found</div>
                )}
              </div>

              {/* Annual report card */}
              <div className="bg-surface rounded-lg border border-border p-4 flex flex-col justify-between">
                <div className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mb-2">Annual Report</div>
                <div className="text-2xl font-bold text-on-surface font-mono">{unitInspections.length}</div>
                <div className="text-xs text-on-surface-variant">Total Inspections</div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-on-surface">Inspection Records</h3>
              <Link
                href={`/maintenance/inspection/new?unit=${selectedUnit.id}&type=${selectedUnit.type}`}
                className="flex items-center gap-2 bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm shadow-[0_0_10px_rgba(0,112,243,0.3)]"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_task</span>
                New Inspection
              </Link>
            </div>

            {/* Inspections table */}
            <div className="bg-surface rounded-lg border border-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-border">
                    {['Date', 'Type', 'Inspector', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {unitInspections.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-outline">No inspection records found.</td></tr>
                  ) : (
                    unitInspections.map((insp, i) => (
                      <motion.tr
                        key={insp.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: i * 0.03 }}
                        className="hover:bg-surface-container-lowest/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-on-surface-variant">{formatDate(insp.inspectionDate)}</td>
                        <td className="px-4 py-3 text-on-surface">{insp.unitType}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{insp.inspectionBy ?? '—'}</td>
                        <td className="px-4 py-3">
                          <InspStatusBadge status={insp.items.some(it => it.result === 'Def') ? 'Failed' : 'Passed'} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/maintenance/inspection/${insp.id}`}
                              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                            </Link>
                            <button className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
                              <span className="material-symbols-outlined text-[16px]">download</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
