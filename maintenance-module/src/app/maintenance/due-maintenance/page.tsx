'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import type { DueMaintenanceRecord } from '@/types'

const ROWS_PER_PAGE = 10

function DueInChip({ dueIn }: { dueIn: string }) {
  const negative = dueIn.startsWith('-')
  const num = parseInt(dueIn.replace(/[^\d-]/g, ''))
  const isWarning = !negative && num <= 500

  if (negative) {
    return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium font-mono bg-error-container text-on-error-container">{dueIn}</span>
  }
  if (isWarning) {
    return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium font-mono bg-warning text-[#362400]">{dueIn}</span>
  }
  return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium font-mono bg-surface-bright text-on-surface-variant border border-border">{dueIn}</span>
}

export default function DueMaintenancePage() {
  const { dueMaintenance: dueMaintenanceRecords, maintenancePlans, maintenanceTypes, vehicles, trailers } = useApp()
  const [tab, setTab] = useState<'mileage' | 'date'>('mileage')
  const [unitFilter, setUnitFilter] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = dueMaintenanceRecords
    if (unitFilter === 'truck')   rows = rows.filter(r => r.unitType === 'Vehicle')
    if (unitFilter === 'trailer') rows = rows.filter(r => r.unitType === 'Trailer')
    if (tab === 'mileage') rows = rows.filter(r => r.unitType === 'Vehicle')
    if (tab === 'date')    rows = rows.filter(r => r.unitType === 'Trailer')
    return rows
  }, [dueMaintenanceRecords, unitFilter, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  function getUnitNum(r: DueMaintenanceRecord) {
    if (r.vehicleId) return vehicles.find(v => v.id === r.vehicleId)?.vehicleNumber ?? r.vehicleId
    if (r.trailerId) return trailers.find(t => t.id === r.trailerId)?.trailerNumber ?? r.trailerId
    return '—'
  }
  function getPlanName(r: DueMaintenanceRecord) {
    return maintenancePlans.find(p => p.id === r.maintenancePlanId)?.name ?? '—'
  }
  function getTypeName(r: DueMaintenanceRecord) {
    const plan = maintenancePlans.find(p => p.id === r.maintenancePlanId)
    return plan ? (maintenanceTypes.find(t => t.id === plan.maintenanceTypeId)?.name ?? '—') : '—'
  }

  const TABS = [{ key: 'mileage', label: 'By Mileage' }, { key: 'date', label: 'By Date' }] as const

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Due Maintenance</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Review and manage upcoming and overdue service requirements.</p>
          </div>
          <button className="border border-border text-on-surface px-4 py-2 rounded text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
        </div>

        {/* Tabs + filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-1 p-1 bg-surface border border-border rounded-lg">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPage(1) }}
                className={cn(
                  'px-6 py-2 rounded text-sm font-medium transition-colors',
                  tab === t.key
                    ? 'bg-surface-container-high text-on-surface border border-border shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-mono">Filter:</span>
            <select
              value={unitFilter}
              onChange={e => { setUnitFilter(e.target.value); setPage(1) }}
              className="bg-surface-container-low border border-border text-sm text-on-surface rounded py-1 pl-3 pr-8 outline-none focus:border-primary"
            >
              <option value="all">All Units</option>
              <option value="truck">Trucks</option>
              <option value="trailer">Trailers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                {['Unit No.', 'Type', 'Plan Name', 'Maintenance Type', 'Last Service (Mi)', 'Current (Mi)', 'Due In', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paged.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-outline">No records found.</td></tr>
              ) : (
                paged.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="group hover:bg-surface-container-lowest/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-on-surface font-mono text-xs">{getUnitNum(r)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{r.unitType}</td>
                    <td className="px-4 py-3 text-on-surface">{getPlanName(r)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{getTypeName(r)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">
                      {r.lastServiceMileage?.toLocaleString() ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface">
                      {r.currentMileage?.toLocaleString() ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right"><DueInChip dueIn={r.dueIn} /></td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-primary-container text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 mx-auto">
                        <span className="material-symbols-outlined text-[16px]">add_task</span> Log
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex justify-between items-center bg-surface-container-lowest">
          <span className="text-xs text-on-surface-variant font-mono">
            Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 border border-border rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-40">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1 border border-border rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-40">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
