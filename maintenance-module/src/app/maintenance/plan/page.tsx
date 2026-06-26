'use client'

import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { ExportButton } from '@/components/shared/ExportButton'
import { PlanModal } from './PlanModal'
import { TruckDetailsModal } from './TruckDetailsModal'
import type { MaintenancePlan } from '@/types'
import { cn } from '@/lib/utils'

const ROWS_PER_PAGE = 10

export default function PlanPage() {
  const { maintenancePlans, maintenanceTypes, dueMaintenance, deleteMaintenancePlan } = useApp()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<MaintenancePlan | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [truckDetailId, setTruckDetailId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = maintenancePlans
    if (search)                 rows = rows.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase()))
    if (filterType !== 'all')   rows = rows.filter(p => p.maintenanceTypeId === filterType)
    if (filterStatus === 'active')   rows = rows.filter(p => p.status)
    if (filterStatus === 'inactive') rows = rows.filter(p => !p.status)
    return rows
  }, [maintenancePlans, search, filterType, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  const columns: Column<MaintenancePlan>[] = [
    {
      key: 'actions', header: 'Actions', width: 'w-16',
      render: row => (
        <RowActionsMenu
          onEdit={() => { setEditPlan(row); setModalOpen(true) }}
          onDelete={() => setDeleteId(row.id)}
          onView={() => setTruckDetailId(row.id)}
        />
      ),
    },
    {
      key: 'name', header: 'Name',
      render: row => <span className={cn('font-medium text-sm', !row.status && 'opacity-60')} style={{ color: 'var(--color-primary-fixed-dim)' }}>{row.name}</span>,
    },
    {
      key: 'type', header: 'Maintenance Type',
      render: row => <span className="text-sm text-on-surface-variant">{maintenanceTypes.find(t => t.id === row.maintenanceTypeId)?.name ?? '—'}</span>,
    },
    {
      key: 'intervalType', header: 'Interval Type',
      render: row => <span className="text-sm text-on-surface-variant font-mono">{row.intervalType}</span>,
    },
    {
      key: 'interval', header: 'Interval',
      render: row => <span className="text-sm text-on-surface font-mono">{row.interval.toLocaleString()}</span>,
    },
    {
      key: 'status', header: 'Status',
      render: row => row.status
        ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success border border-success/20">Active</span>
        : <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant">Inactive</span>,
    },
    {
      key: 'description', header: 'Description',
      render: row => <span className="text-sm text-on-surface-variant truncate max-w-xs block">{row.description || '—'}</span>,
    },
    {
      key: 'overdue', header: 'Total Overdue',
      render: row => {
        const overdue = dueMaintenance.filter(d => d.maintenancePlanId === row.id && d.dueStatus === 'Overdue').length
        return overdue > 0
          ? <span className="inline-flex items-center gap-1 rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-xs font-semibold text-error"><span className="material-symbols-outlined text-[13px]">warning</span>{overdue}</span>
          : <span className="text-sm text-on-surface-variant">—</span>
      },
    },
  ]

  const exportRows = filtered.map(plan => ({
    Name: plan.name,
    MaintenanceType: maintenanceTypes.find(t => t.id === plan.maintenanceTypeId)?.name ?? 'Unknown Type',
    IntervalType: plan.intervalType,
    Interval: plan.interval,
    Status: plan.status ? 'Active' : 'Inactive',
    Description: plan.description,
    TotalOverdue: dueMaintenance.filter(d => d.maintenancePlanId === plan.id && d.dueStatus === 'Overdue').length,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Plan</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Manage maintenance plans and service schedules.</p>
          </div>
          <button
            onClick={() => { setEditPlan(null); setModalOpen(true) }}
            className="bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Add Plan
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px]">search</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search plans..."
              className="h-9 pl-9 pr-3 text-sm rounded border bg-surface-container-low border-border text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary focus:border-primary w-52 transition-colors"
            />
          </div>

          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1) }}
            className="h-9 px-3 pr-8 text-sm rounded border bg-surface-container-low border-border text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="all">All Types</option>
            {maintenanceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            className="h-9 px-3 pr-8 text-sm rounded border bg-surface-container-low border-border text-on-surface outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button onClick={() => { setSearch(''); setFilterType('all'); setFilterStatus('all'); setPage(1) }} className="border border-border text-on-surface-variant px-4 py-2 rounded text-sm hover:bg-surface-container-low transition-colors">
            Clear Filters
          </button>

          <div className="ml-auto">
            <ExportButton
              filename="maintenance-plans"
              columns={['Name', 'MaintenanceType', 'IntervalType', 'Interval', 'Status', 'Description', 'TotalOverdue']}
              rows={exportRows}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        <DataTable
          columns={columns}
          data={paged}
          getRowId={r => r.id}
          emptyMessage="No maintenance plans found."
        />

        {/* Pagination */}
        <div className="p-4 border-t border-border flex justify-between items-center bg-surface-container-lowest">
          <span className="text-xs text-on-surface-variant font-mono">
            Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} results
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 border border-border rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  'px-2.5 py-1 border rounded text-xs font-medium transition-colors',
                  page === n
                    ? 'border-primary-container text-primary-container bg-primary-container/10'
                    : 'border-border text-on-surface-variant hover:bg-surface hover:text-on-surface'
                )}
              >
                {n}
              </button>
            ))}
            {totalPages > 5 && <span className="px-2 py-1 text-on-surface-variant text-xs">...</span>}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 border border-border rounded text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <PlanModal
        open={modalOpen}
        onOpenChange={v => { setModalOpen(v); if (!v) setEditPlan(null) }}
        editItem={editPlan}
      />

      <TruckDetailsModal
        open={!!truckDetailId}
        onOpenChange={v => !v && setTruckDetailId(null)}
        plan={maintenancePlans.find(p => p.id === truckDetailId) ?? null}
      />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) { deleteMaintenancePlan(deleteId); toast.success('Plan deleted') }
        }}
        title="Delete Plan"
        description="This maintenance plan will be permanently deleted."
      />
    </div>
  )
}
