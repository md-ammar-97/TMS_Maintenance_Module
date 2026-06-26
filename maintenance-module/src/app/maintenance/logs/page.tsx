'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { LogModal } from './LogModal'
import type { MaintenanceLog } from '@/types'

const ROWS_PER_PAGE = 10

export default function LogsPage() {
  const { maintenanceLogs, maintenanceTypes, vehicles, trailers, deleteLog } = useApp()
  const [tab, setTab] = useState<'vehicle' | 'trailer'>('vehicle')
  const [typeFilter, setTypeFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editLog, setEditLog] = useState<MaintenanceLog | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = maintenanceLogs
    if (tab === 'vehicle') rows = rows.filter(l => l.unitType === 'Vehicle')
    if (tab === 'trailer') rows = rows.filter(l => l.unitType === 'Trailer')
    if (typeFilter !== 'all') rows = rows.filter(l => l.maintenanceTypeId === typeFilter)
    if (search) rows = rows.filter(l => l.description?.toLowerCase().includes(search.toLowerCase()))
    return rows
  }, [maintenanceLogs, tab, typeFilter, search])

  const totalAmount = filtered.reduce((sum, l) => sum + (l.amount ?? 0), 0)
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  function getUnitNum(log: MaintenanceLog) {
    if (log.unitType === 'Vehicle') return vehicles.find(v => v.id === log.vehicleId)?.vehicleNumber ?? log.vehicleId ?? '—'
    return trailers.find(t => t.id === log.trailerId)?.trailerNumber ?? log.trailerId ?? '—'
  }

  function getTypeName(log: MaintenanceLog) {
    if (log.externalMaintenanceType) return log.externalMaintenanceType
    if (log.maintenanceTypeId) return maintenanceTypes.find(t => t.id === log.maintenanceTypeId)?.name ?? '—'
    return 'General'
  }

  function getTypeBadgeClass(typeId?: string) {
    if (!typeId) return 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'
    return 'bg-success/10 text-success border border-success/20'
  }

  const TABS = [{ key: 'vehicle', label: 'Vehicle' }, { key: 'trailer', label: 'Trailer' }] as const

  return (
    <div className="flex flex-col h-full relative">
      {/* Overlay for drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Advanced Filters Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-80 bg-surface-container-lowest border-l border-border z-40 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-on-surface">Advanced Filters</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-on-surface-variant font-mono block mb-2">Date Range</label>
                <div className="flex gap-2">
                  <input type="date" className="flex-1 h-9 px-3 rounded border bg-surface-container-low border-border text-on-surface text-sm outline-none focus:border-primary" />
                  <input type="date" className="flex-1 h-9 px-3 rounded border bg-surface-container-low border-border text-on-surface text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-on-surface-variant font-mono block mb-2">Carrier</label>
                <select className="w-full h-9 px-3 rounded border bg-surface-container-low border-border text-on-surface text-sm outline-none focus:border-primary">
                  <option>All Carriers</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-on-surface-variant font-mono block mb-2">Amount Range</label>
                <div className="flex gap-2">
                  <input placeholder="Min" type="number" className="flex-1 h-9 px-3 rounded border bg-surface-container-low border-border text-on-surface text-sm outline-none focus:border-primary placeholder:text-outline" />
                  <input placeholder="Max" type="number" className="flex-1 h-9 px-3 rounded border bg-surface-container-low border-border text-on-surface text-sm outline-none focus:border-primary placeholder:text-outline" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <button className="flex-1 border border-border text-on-surface-variant py-2 rounded text-sm hover:bg-surface-container-low transition-colors">Clear</button>
              <button className="flex-1 bg-primary-container text-on-primary-container py-2 rounded text-sm font-medium hover:bg-inverse-primary transition-colors">Apply</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Maintenance Logs</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Track and review all maintenance activities.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Total Amount card */}
            <div className="bg-surface-container-low border border-border rounded px-4 py-2 text-right">
              <div className="text-xs text-on-surface-variant font-mono">Total Amount</div>
              <div className="text-sm font-semibold text-on-surface font-mono">{formatCurrency(totalAmount)}</div>
            </div>
            <button
              onClick={() => { setEditLog(null); setModalOpen(true) }}
              className="bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
              Add Log
            </button>
          </div>
        </div>

        {/* Tabs + Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-0">
          <div className="flex gap-1 p-1 bg-surface-container rounded-lg">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPage(1) }}
                className={cn(
                  'px-5 py-1.5 rounded text-sm font-medium transition-colors',
                  tab === t.key
                    ? 'bg-surface-container-highest text-on-surface border border-border shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
            className="h-9 px-3 pr-8 text-sm rounded border bg-surface-container-low border-border text-on-surface outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Types</option>
            {maintenanceTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search..."
              className="h-9 pl-9 pr-4 text-sm rounded border bg-surface-container-low border-border text-on-surface placeholder:text-outline outline-none focus:border-primary w-44"
            />
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1 h-9 px-3 border border-border rounded text-sm text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors ml-auto"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Advanced
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                {['Type', 'Unit No.', 'Date', 'Mileage', 'Amount', 'Description', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-outline">No logs found.</td></tr>
              ) : (
                paged.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="group hover:bg-surface-container-lowest/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', getTypeBadgeClass(log.maintenanceTypeId))}>
                        {getTypeName(log)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-on-surface font-medium">{getUnitNum(log)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(log.serviceDate)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{log.mileage?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface">{formatCurrency(log.amount ?? 0)}</td>
                    <td className="px-4 py-3 text-on-surface-variant truncate max-w-[200px]">{log.description || '—'}</td>
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        onEdit={() => { setEditLog(log); setModalOpen(true) }}
                        onDelete={() => setDeleteId(log.id)}
                      />
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

      <LogModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditLog(null) }} editItem={editLog} />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteLog(deleteId); toast.success('Log deleted') } }}
        title="Delete Log"
        description="This maintenance log will be permanently deleted."
      />
    </div>
  )
}
