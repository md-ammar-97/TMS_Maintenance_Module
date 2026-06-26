'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ExportButton } from '@/components/shared/ExportButton'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { useApp } from '@/context/AppContext'
import { cn, formatDate, formatMileage } from '@/lib/utils'
import { LogModal } from '../logs/LogModal'
import type { DueMaintenanceRecord, DueStatus, MaintenanceLog } from '@/types'

const ROWS_PER_PAGE = 10
const MS_PER_DAY = 24 * 60 * 60 * 1000

function DueInChip({ status, dueIn }: { status: DueStatus; dueIn: string }) {
  const classes: Record<DueStatus, string> = {
    Overdue: 'bg-error-container text-on-error-container border-error/20',
    Upcoming: 'bg-warning/10 text-warning border-warning/20',
    OK: 'bg-success/10 text-success border-success/20',
  }
  const icon = status === 'Overdue' ? 'arrow_downward' : status === 'Upcoming' ? 'schedule' : 'check'
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold font-mono', classes[status])}>
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      {dueIn}
    </span>
  )
}

function classifyMileage(diff: number): DueStatus {
  if (diff <= 0) return 'Overdue'
  if (diff <= 2000) return 'Upcoming'
  return 'OK'
}

function classifyDays(diff: number): DueStatus {
  if (diff < 0) return 'Overdue'
  if (diff <= 30) return 'Upcoming'
  return 'OK'
}

function addInterval(dateStr: string, intervalType: string, interval: number): string {
  const date = new Date(`${dateStr}T00:00:00`)
  if (intervalType === 'Days') date.setDate(date.getDate() + interval)
  else date.setMonth(date.getMonth() + interval)
  return date.toISOString().split('T')[0]
}

function formatSigned(value: number, suffix: string) {
  return `${value >= 0 ? '+' : ''}${value.toLocaleString()} ${suffix}`
}

export default function DueMaintenancePage() {
  const {
    dueMaintenance,
    maintenancePlans,
    maintenanceTypes,
    carriers,
    vehicles,
    trailers,
    updateDueMaintenance,
  } = useApp()
  const [tab, setTab] = useState<'mileage' | 'date'>('mileage')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [vehicleFilter, setVehicleFilter] = useState('all')
  const [trailerFilter, setTrailerFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [activeDue, setActiveDue] = useState<DueMaintenanceRecord | null>(null)

  function getPlan(record: DueMaintenanceRecord) {
    return maintenancePlans.find(p => p.id === record.maintenancePlanId)
  }
  function getType(record: DueMaintenanceRecord) {
    const plan = getPlan(record)
    return plan ? maintenanceTypes.find(t => t.id === plan.maintenanceTypeId) : undefined
  }
  function getVehicle(record: DueMaintenanceRecord) {
    return record.vehicleId ? vehicles.find(v => v.id === record.vehicleId) : undefined
  }
  function getTrailer(record: DueMaintenanceRecord) {
    return record.trailerId ? trailers.find(t => t.id === record.trailerId) : undefined
  }
  function getCarrierId(record: DueMaintenanceRecord) {
    return getVehicle(record)?.carrierId ?? getTrailer(record)?.carrierId ?? ''
  }
  function getUnitNumber(record: DueMaintenanceRecord) {
    return getVehicle(record)?.vehicleNumber ?? getTrailer(record)?.trailerNumber ?? '—'
  }

  const filtered = useMemo(() => {
    const rank: Record<DueStatus, number> = { Overdue: 0, Upcoming: 1, OK: 2 }
    return dueMaintenance
      .filter(record => tab === 'mileage' ? Boolean(record.dueMileage) : Boolean(record.dueDate))
      .filter(record => carrierFilter === 'all' || getCarrierId(record) === carrierFilter)
      .filter(record => vehicleFilter === 'all' || record.vehicleId === vehicleFilter)
      .filter(record => trailerFilter === 'all' || record.trailerId === trailerFilter)
      .filter(record => planFilter === 'all' || record.maintenancePlanId === planFilter)
      .filter(record => typeFilter === 'all' || getPlan(record)?.maintenanceTypeId === typeFilter)
      .sort((a, b) => rank[a.dueStatus] - rank[b.dueStatus])
  }, [dueMaintenance, tab, carrierFilter, vehicleFilter, trailerFilter, planFilter, typeFilter, maintenancePlans])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const exportRows = filtered.map(record => {
    const plan = getPlan(record)
    const type = getType(record)
    return {
      Plan: plan?.name ?? 'Unknown Plan',
      Type: record.unitType,
      Number: getUnitNumber(record),
      MaintenanceType: type?.name ?? 'Unknown Type',
      LastServiceDate: record.lastServiceDate ?? '',
      LastServiceMileage: record.lastServiceMileage ?? '',
      CurrentMileage: record.currentMileage ?? '',
      DueIn: record.dueIn,
      DueStatus: record.dueStatus,
    }
  })

  function clearFilters() {
    setCarrierFilter('all')
    setVehicleFilter('all')
    setTrailerFilter('all')
    setTypeFilter('all')
    setPlanFilter('all')
    setPage(1)
  }

  function handleLogSaved(record: DueMaintenanceRecord, log: MaintenanceLog) {
    const plan = getPlan(record)
    if (!plan) return

    if (plan.intervalType === 'Mileage') {
      const lastServiceMileage = log.mileage ?? record.lastServiceMileage ?? 0
      const currentMileage = record.currentMileage ?? getVehicle(record)?.currentMileage ?? lastServiceMileage
      const dueMileage = lastServiceMileage + plan.interval
      const diff = dueMileage - currentMileage
      updateDueMaintenance(record.id, {
        lastServiceDate: log.serviceDate,
        lastServiceMileage,
        currentMileage,
        dueMileage,
        dueStatus: classifyMileage(diff),
        dueIn: formatSigned(diff, 'mi'),
      })
    } else {
      const dueDate = addInterval(log.serviceDate, plan.intervalType, plan.interval)
      const today = new Date()
      const diff = Math.ceil((new Date(`${dueDate}T00:00:00`).getTime() - today.getTime()) / MS_PER_DAY)
      updateDueMaintenance(record.id, {
        lastServiceDate: log.serviceDate,
        lastServiceMileage: log.mileage ?? record.lastServiceMileage,
        dueDate,
        dueStatus: classifyDays(diff),
        dueIn: formatSigned(diff, 'days'),
      })
    }
    toast.success('Due maintenance updated')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Due Maintenance</h2>
            <p className="mt-0.5 text-sm text-on-surface-variant">Upcoming and overdue service across vehicles and trailers.</p>
          </div>
          <ExportButton
            filename="due-maintenance"
            columns={['Plan', 'Type', 'Number', 'MaintenanceType', 'LastServiceDate', 'LastServiceMileage', 'CurrentMileage', 'DueIn', 'DueStatus']}
            rows={exportRows}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-full bg-surface-container-high p-1">
            {(['mileage', 'date'] as const).map(value => (
              <button
                key={value}
                onClick={() => { setTab(value); setPage(1) }}
                className={cn(
                  'rounded-full px-5 py-1.5 text-sm font-medium transition-colors',
                  tab === value ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {value === 'mileage' ? 'By Mileage' : 'By Date'}
              </button>
            ))}
          </div>

          <select value={carrierFilter} onChange={e => { setCarrierFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Carriers</option>
            {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={vehicleFilter} onChange={e => { setVehicleFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Vehicles</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleNumber}{v.status === 'Inactive' ? ' (Inactive)' : ''}</option>)}
          </select>
          <select value={trailerFilter} onChange={e => { setTrailerFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Trailers</option>
            {trailers.map(t => <option key={t.id} value={t.id}>{t.trailerNumber}{t.status === 'Inactive' ? ' (Inactive)' : ''}</option>)}
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Types</option>
            {maintenanceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Plans</option>
            {maintenancePlans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={clearFilters} className="h-9 rounded border border-border px-3 text-sm text-on-surface-variant hover:bg-surface-container-high">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mx-6 mb-6 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-container-low">
                {['Actions', 'Plan Name', 'Vehicle Type', 'Number', 'Last Service Date', 'Last Service Mileage', 'Current Mileage', 'Due In'].map(header => (
                  <th key={header} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-sm text-outline">No records found. Try adjusting your filters.</td>
                </tr>
              ) : paged.map(record => {
                const plan = getPlan(record)
                return (
                  <tr key={record.id} className="group hover:bg-surface-container-low">
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        extraItems={[{
                          label: 'Create Log',
                          onClick: () => setActiveDue(record),
                        }]}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-on-surface">{plan?.name ?? 'Unknown Plan'}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{record.unitType}</td>
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-on-surface">{getUnitNumber(record)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{record.lastServiceDate ? formatDate(record.lastServiceDate) : '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatMileage(record.lastServiceMileage)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface">{formatMileage(record.currentMileage)}</td>
                    <td className="px-4 py-3 text-right"><DueInChip status={record.dueStatus} dueIn={record.dueIn} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-surface-container-lowest p-4">
          <span className="font-mono text-xs text-on-surface-variant">
            Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded border border-border p-1 text-on-surface-variant disabled:opacity-40">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border border-border p-1 text-on-surface-variant disabled:opacity-40">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <LogModal
        open={!!activeDue}
        onOpenChange={open => { if (!open) setActiveDue(null) }}
        prefillVehicleId={activeDue?.vehicleId}
        prefillTrailerId={activeDue?.trailerId}
        prefillPlanId={activeDue?.maintenancePlanId}
        prefillMaintenanceTypeId={activeDue ? getPlan(activeDue)?.maintenanceTypeId : undefined}
        onSaved={log => {
          if (activeDue) handleLogSaved(activeDue, log)
          setActiveDue(null)
        }}
      />
    </div>
  )
}
