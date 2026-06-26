'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { ExportButton } from '@/components/shared/ExportButton'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { useApp } from '@/context/AppContext'
import { cn, formatCurrency, formatDate, formatEmpty, formatMileage, getUnitOptionLabel } from '@/lib/utils'
import { LogModal } from './LogModal'
import type { MaintenanceLog } from '@/types'

const ROWS_PER_PAGE = 10
const TABLE_HEADERS = ['Actions', 'Unit #', 'Carrier', 'Vendor', 'Maintenance Type', 'External Type', 'Plan Name', 'Tire Position', 'Service Date', 'Mileage', 'Amount', 'Description', 'Created By', 'Bill Ref Number', 'Log Status', 'Currency', 'GST', 'HST', 'QST']

function StatusPill({ mapped }: { mapped: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold',
      mapped ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border bg-surface-container-high text-on-surface-variant'
    )}>
      {mapped ? 'Mapped' : 'UnMapped'}
    </span>
  )
}

export default function LogsPage() {
  const {
    maintenanceLogs,
    maintenanceTypes,
    maintenancePlans,
    carriers,
    vehicles,
    trailers,
    vendors,
    deleteLog,
  } = useApp()
  const [tab, setTab] = useState<'vehicle' | 'trailer'>('vehicle')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editLog, setEditLog] = useState<MaintenanceLog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  function getUnit(log: MaintenanceLog) {
    return log.unitType === 'Vehicle'
      ? vehicles.find(v => v.id === log.vehicleId)
      : trailers.find(t => t.id === log.trailerId)
  }
  function getUnitNumber(log: MaintenanceLog) {
    if (log.unitType === 'Vehicle') return vehicles.find(v => v.id === log.vehicleId)?.vehicleNumber ?? log.vehicleId ?? '—'
    return trailers.find(t => t.id === log.trailerId)?.trailerNumber ?? log.trailerId ?? '—'
  }
  function getCarrierId(log: MaintenanceLog) {
    return getUnit(log)?.carrierId ?? ''
  }
  function getCarrierName(log: MaintenanceLog) {
    const carrierId = getCarrierId(log)
    return carriers.find(c => c.id === carrierId)?.name ?? '—'
  }
  function getTypeName(log: MaintenanceLog) {
    if (log.maintenanceTypeId) return maintenanceTypes.find(t => t.id === log.maintenanceTypeId)?.name ?? 'Unknown Type'
    return 'Unknown Type'
  }
  function getPlanName(log: MaintenanceLog) {
    return log.maintenancePlanId ? maintenancePlans.find(p => p.id === log.maintenancePlanId)?.name ?? 'Unknown Plan' : '—'
  }
  function getVendorName(log: MaintenanceLog) {
    return log.vendorId ? vendors.find(v => v.id === log.vendorId)?.name ?? 'Unknown Vendor' : '—'
  }

  const unitOptions = tab === 'vehicle'
    ? vehicles.map(v => ({ id: v.id, number: getUnitOptionLabel(v.vehicleNumber, v.status) }))
    : trailers.map(t => ({ id: t.id, number: getUnitOptionLabel(t.trailerNumber, t.status) }))

  const filtered = useMemo(() => {
    return maintenanceLogs
      .filter(log => tab === 'vehicle' ? log.unitType === 'Vehicle' : log.unitType === 'Trailer')
      .filter(log => statusFilter === 'all' || (statusFilter === 'mapped' ? Boolean(log.billId) : !log.billId))
      .filter(log => typeFilter === 'all' || log.maintenanceTypeId === typeFilter)
      .filter(log => planFilter === 'all' || log.maintenancePlanId === planFilter)
      .filter(log => carrierFilter === 'all' || getCarrierId(log) === carrierFilter)
      .filter(log => unitFilter === 'all' || log.vehicleId === unitFilter || log.trailerId === unitFilter)
      .filter(log => {
        if (!search) return true
        const haystack = [
          getTypeName(log),
          log.externalMaintenanceType,
          getPlanName(log),
          getUnitNumber(log),
          getCarrierName(log),
          getVendorName(log),
          log.description,
          log.billRefNumber,
          log.createdBy,
        ].join(' ').toLowerCase()
        return haystack.includes(search.toLowerCase())
      })
  }, [maintenanceLogs, tab, statusFilter, typeFilter, planFilter, carrierFilter, unitFilter, search, maintenanceTypes, maintenancePlans, carriers, vehicles, trailers, vendors])

  const totalAmount = filtered.reduce((sum, log) => sum + (log.amount || 0), 0)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const exportRows = filtered.map(log => ({
    Actions: '',
    'Unit #': getUnitNumber(log),
    Carrier: getCarrierName(log),
    Vendor: getVendorName(log),
    'Maintenance Type': getTypeName(log),
    'External Type': log.externalMaintenanceType ?? '',
    'Plan Name': getPlanName(log),
    'Tire Position': log.tirePosition ?? '',
    'Service Date': log.serviceDate,
    Mileage: log.mileage ?? '',
    Amount: log.amount,
    Description: log.description ?? '',
    'Created By': log.createdBy,
    'Bill Ref Number': log.billRefNumber ?? '',
    'Log Status': log.billId ? 'Mapped' : 'UnMapped',
    Currency: log.currency,
    GST: log.gst ?? '',
    HST: log.hst ?? '',
    QST: log.qst ?? '',
  }))

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setTypeFilter('all')
    setPlanFilter('all')
    setCarrierFilter('all')
    setUnitFilter('all')
    setPage(1)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Logs</h2>
            <p className="mt-0.5 text-sm text-on-surface-variant">Track maintenance work across vehicles and trailers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded border border-border bg-surface-container-low px-4 py-2 text-right">
              <div className="font-mono text-xs text-on-surface-variant">Total Amount</div>
              <div className="font-mono text-sm font-semibold text-on-surface">{formatCurrency(totalAmount)}</div>
            </div>
            <button onClick={() => { setEditLog(null); setModalOpen(true) }} className="inline-flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container hover:bg-inverse-primary">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create new maintenance log
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded bg-surface-container-high p-1">
            {(['vehicle', 'trailer'] as const).map(value => (
              <button
                key={value}
                onClick={() => { setTab(value); setUnitFilter('all'); setPage(1) }}
                className={cn('rounded px-5 py-1.5 text-sm font-medium capitalize', tab === value ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant')}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search logs..." className="h-9 w-56 rounded border border-border bg-surface-container-low pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Statuses</option>
            <option value="mapped">Mapped</option>
            <option value="unmapped">UnMapped</option>
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Types</option>
            {maintenanceTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
          </select>
          <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Plans</option>
            {maintenancePlans.map(plan => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
          </select>
          <select value={carrierFilter} onChange={e => { setCarrierFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Carriers</option>
            {carriers.map(carrier => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
          </select>
          <select value={unitFilter} onChange={e => { setUnitFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All {tab === 'vehicle' ? 'Vehicles' : 'Trailers'}</option>
            {unitOptions.map(unit => <option key={unit.id} value={unit.id}>{unit.number}</option>)}
          </select>
          <button onClick={clearFilters} className="h-9 rounded border border-border px-3 text-sm text-on-surface-variant hover:bg-surface-container-high">Clear</button>
          <div className="ml-auto">
            <ExportButton
              filename="maintenance-logs"
              columns={TABLE_HEADERS}
              rows={exportRows}
            />
          </div>
        </div>
      </div>

      <div className="mx-6 mb-6 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-container-low">
                {TABLE_HEADERS.map(header => (
                  <th key={header} className={cn('px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant', ['Mileage', 'Amount', 'GST', 'HST', 'QST'].includes(header) && 'text-right')}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 ? (
                <tr><td colSpan={19} className="px-4 py-16 text-center text-sm text-outline">No logs found. Try adjusting your filters.</td></tr>
              ) : paged.map(log => (
                <tr key={log.id} className="group hover:bg-surface-container-low">
                  <td className="px-4 py-3">
                    <RowActionsMenu
                      onEdit={() => { setEditLog(log); setModalOpen(true) }}
                      onDelete={() => setDeleteId(log.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-on-surface">{getUnitNumber(log)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{getCarrierName(log)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{getVendorName(log)}</td>
                  <td className="px-4 py-3"><span className="rounded bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">{getTypeName(log)}</span></td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatEmpty(log.externalMaintenanceType)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{getPlanName(log)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{formatEmpty(log.tirePosition)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatDate(log.serviceDate)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatMileage(log.mileage)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-on-surface">{formatCurrency(log.amount, log.currency)}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-on-surface-variant" title={log.description}>{formatEmpty(log.description)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{log.createdBy}</td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">{formatEmpty(log.billRefNumber)}</td>
                  <td className="px-4 py-3"><StatusPill mapped={Boolean(log.billId)} /></td>
                  <td className="px-4 py-3 text-on-surface-variant">{log.currency}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatEmpty(log.gst)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatEmpty(log.hst)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatEmpty(log.qst)}</td>
                </tr>
              ))}
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

      <LogModal open={modalOpen} onOpenChange={open => { setModalOpen(open); if (!open) setEditLog(null) }} editItem={editLog} />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteLog(deleteId); toast.success('Log deleted') } }}
        title="Delete Log"
        description="This maintenance log will be permanently deleted."
      />
    </div>
  )
}
