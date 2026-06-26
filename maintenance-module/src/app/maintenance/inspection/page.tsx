'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'
import { cn, formatDate, formatMileage } from '@/lib/utils'
import type { Inspection, UnitType } from '@/types'

function InspectionStatusBadge({ inspection }: { inspection: Inspection }) {
  const defects = inspection.items.filter(item => item.result === 'Def').length
  const passed = defects === 0
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
      passed ? 'border-success/20 bg-success/10 text-success' : 'border-warning/20 bg-warning/10 text-warning'
    )}>
      <span className="material-symbols-outlined text-[13px]">{passed ? 'check_circle' : 'warning'}</span>
      {passed ? 'Passed' : 'Needs Minor Repair'}
    </span>
  )
}

function DefectsChip({ count }: { count: number }) {
  if (count === 0) return <span className="text-on-surface-variant">—</span>
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-xs font-semibold text-error">
      <span className="material-symbols-outlined text-[13px]">report</span>
      {count}
    </span>
  )
}

export default function InspectionPage() {
  const { vehicles, trailers, carriers, inspections } = useApp()
  const [tab, setTab] = useState<'vehicle' | 'trailer'>('vehicle')
  const [unitSearch, setUnitSearch] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [reportYear, setReportYear] = useState('2026')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const type = params.get('type')
    const unit = params.get('unit')
    if (type === 'trailer' || type === 'vehicle') setTab(type)
    if (unit) setSelectedUnitId(unit)
  }, [])

  const units = useMemo(() => {
    const source = tab === 'vehicle'
      ? vehicles.map(v => ({ id: v.id, number: v.vehicleNumber, carrierId: v.carrierId, status: v.status }))
      : trailers.map(t => ({ id: t.id, number: t.trailerNumber, carrierId: t.carrierId, status: t.status }))
    return source
      .filter(unit => carrierFilter === 'all' || unit.carrierId === carrierFilter)
      .filter(unit => !unitSearch || unit.number.toLowerCase().includes(unitSearch.toLowerCase()))
  }, [tab, vehicles, trailers, carrierFilter, unitSearch])

  useEffect(() => {
    if (selectedUnitId && !units.some(unit => unit.id === selectedUnitId)) setSelectedUnitId('')
  }, [selectedUnitId, units])

  const unitInspections = useMemo(() => {
    return inspections
      .filter(inspection => tab === 'vehicle' ? inspection.vehicleId === selectedUnitId : inspection.trailerId === selectedUnitId)
      .sort((a, b) => b.inspectionDate.localeCompare(a.inspectionDate))
  }, [inspections, selectedUnitId, tab])

  const selectedUnit = units.find(unit => unit.id === selectedUnitId)
  const lastInspection = unitInspections[0]
  const lastDefects = lastInspection?.items.filter(item => item.result === 'Def').length ?? 0

  function selectedCarrierName(carrierId?: string) {
    return carriers.find(carrier => carrier.id === carrierId)?.name ?? 'Unknown Carrier'
  }

  function handleTabChange(next: 'vehicle' | 'trailer') {
    setTab(next)
    setSelectedUnitId('')
    setUnitSearch('')
    setCarrierFilter('all')
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-surface-container-lowest">
        <div className="border-b border-border p-4">
          <h2 className="mb-3 text-sm font-semibold text-on-surface">Inspection Compliance</h2>
          <div className="mb-3 flex rounded bg-surface-container-high p-1">
            {(['vehicle', 'trailer'] as const).map(value => (
              <button
                key={value}
                onClick={() => handleTabChange(value)}
                className={cn(
                  'flex-1 rounded px-3 py-1.5 text-sm font-medium capitalize',
                  tab === value ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="relative mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
            <input
              value={unitSearch}
              onChange={event => setUnitSearch(event.target.value)}
              placeholder="Unit Number"
              className="h-9 w-full rounded border border-border bg-surface-container-low pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary"
            />
          </div>
          <select
            value={carrierFilter}
            onChange={event => setCarrierFilter(event.target.value)}
            className="h-9 w-full rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface"
          >
            <option value="all">All Carriers</option>
            {carriers.map(carrier => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {units.length === 0 ? (
            <p className="p-6 text-center text-sm text-outline">No units found.</p>
          ) : units.map(unit => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              className={cn(
                'mb-1 w-full rounded border px-3 py-3 text-left transition-colors',
                selectedUnitId === unit.id
                  ? 'border-primary-container bg-primary-container/10 text-primary-container'
                  : 'border-transparent text-on-surface hover:border-border hover:bg-surface-container-low'
              )}
            >
              <div className="font-mono text-sm font-semibold">{unit.number}</div>
              <div className="mt-0.5 truncate text-xs text-outline" title={selectedCarrierName(unit.carrierId)}>
                {selectedCarrierName(unit.carrierId)}{unit.status === 'Inactive' ? ' · Inactive' : ''}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
        {!selectedUnit ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined mb-3 block text-[48px] text-outline">fact_check</span>
              <p className="text-sm text-on-surface-variant">Select a unit from the list to view inspection records.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-10 min-w-10 items-center justify-center rounded px-2 font-mono text-sm font-bold', tab === 'vehicle' ? 'bg-primary-container/10 text-primary-container' : 'bg-success/10 text-success')}>
                    {selectedUnit.number.slice(0, 3)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold text-on-surface">{selectedUnit.number}</h1>
                    <p className="text-sm text-on-surface-variant">{selectedCarrierName(selectedUnit.carrierId)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {lastInspection ? <InspectionStatusBadge inspection={lastInspection} /> : <span className="text-sm text-on-surface-variant">No inspection record</span>}
                  <span className="text-sm text-on-surface-variant">Last inspection: {lastInspection ? formatDate(lastInspection.inspectionDate) : '—'}</span>
                  {lastDefects > 0 && <DefectsChip count={lastDefects} />}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select value={reportYear} onChange={event => setReportYear(event.target.value)} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
                  {['2026', '2025', '2024', '2023', '2022', '2021'].map(year => <option key={year}>{year}</option>)}
                </select>
                <button onClick={() => window.print()} className="h-9 rounded border border-border px-3 text-sm text-on-surface-variant hover:bg-surface-container-high">
                  Download
                </button>
                <Link
                  href={`/maintenance/inspection/new?type=${tab}&unit=${selectedUnit.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded bg-primary-container px-4 text-sm font-medium text-on-primary-container hover:bg-inverse-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  {tab === 'vehicle' ? 'Create new truck inspection' : 'Create new trailer inspection'}
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-surface">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-container-low">
                    {['Actions', 'Inspection Date', 'Inspection By', 'Status', 'Defects', 'Mileage'].map(header => (
                      <th key={header} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {unitInspections.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-16 text-center text-sm text-outline">No inspection records found.</td></tr>
                  ) : unitInspections.map(inspection => {
                    const defects = inspection.items.filter(item => item.result === 'Def').length
                    return (
                      <tr key={inspection.id} className="hover:bg-surface-container-low">
                        <td className="px-4 py-3">
                          <button onClick={() => window.print()} className="rounded p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-primary">
                            <span className="material-symbols-outlined text-[16px]">download</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-on-surface-variant">{formatDate(inspection.inspectionDate)}</td>
                        <td className="px-4 py-3 text-on-surface">{inspection.inspectionBy}</td>
                        <td className="px-4 py-3"><InspectionStatusBadge inspection={inspection} /></td>
                        <td className="px-4 py-3"><DefectsChip count={defects} /></td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatMileage(inspection.mileage)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
