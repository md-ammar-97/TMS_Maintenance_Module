'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { TypeModal } from './TypeModal'
import type { MaintenanceType } from '@/types'
import { getInitials } from '@/lib/utils'

const AVATAR_COLORS = [
  { bg: '#6807ba', text: '#d0a6ff' },
  { bg: '#ca4e00', text: '#fffeff' },
  { bg: '#001a43', text: '#aec6ff' },
  { bg: '#1c1f27', text: '#dbb8ff' },
]

const ROWS_PER_PAGE = 10

export default function TypesPage() {
  const { maintenanceTypes, deleteMaintenanceType } = useApp()
  const [nameFilter, setNameFilter] = useState('')
  const [descFilter, setDescFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editType, setEditType] = useState<MaintenanceType | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = maintenanceTypes
    if (nameFilter) rows = rows.filter(t => t.name.toLowerCase().includes(nameFilter.toLowerCase()))
    if (descFilter) rows = rows.filter(t => t.description.toLowerCase().includes(descFilter.toLowerCase()))
    return rows
  }, [maintenanceTypes, nameFilter, descFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  function clear() { setNameFilter(''); setDescFilter(''); setPage(1) }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Maintenance Types</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Define and manage categories of maintenance work.</p>
          </div>
          <button
            onClick={() => { setEditType(null); setModalOpen(true) }}
            className="bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Add Type
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input
              value={nameFilter}
              onChange={e => { setNameFilter(e.target.value); setPage(1) }}
              placeholder="Filter by Name..."
              className="h-9 w-full pl-9 pr-3 text-sm rounded border bg-surface-container-lowest border-border text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input
              value={descFilter}
              onChange={e => { setDescFilter(e.target.value); setPage(1) }}
              placeholder="Filter by Description..."
              className="h-9 w-full pl-9 pr-3 text-sm rounded border bg-surface-container-lowest border-border text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <button onClick={clear} className="border border-border text-on-surface-variant px-4 h-9 rounded text-sm hover:bg-surface-container-low transition-colors">Clear</button>
        </div>
      </div>

      {/* Grid table */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container-low border-b border-border">
          <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">Actions</div>
          <div className="col-span-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">Name</div>
          <div className="col-span-6 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">Description</div>
        </div>

        <AnimatePresence>
          {paged.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-outline">No maintenance types found.</div>
          ) : (
            paged.map((type, i) => {
              const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                  className="group grid grid-cols-12 gap-4 px-6 py-4 border-b border-border hover:bg-surface-container-lowest/50 transition-colors"
                >
                  {/* Actions */}
                  <div className="col-span-2 flex items-center gap-1">
                    <button
                      onClick={() => { setEditType(type); setModalOpen(true) }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(type.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error/10 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* Name with avatar */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: avatarColor.bg, color: avatarColor.text }}
                    >
                      {getInitials(type.name)}
                    </div>
                    <span className="text-sm font-medium text-on-surface">{type.name}</span>
                  </div>

                  {/* Description */}
                  <div className="col-span-6 flex items-center">
                    <span className="text-sm text-on-surface-variant truncate">{type.description || '—'}</span>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>

        {/* Pagination */}
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

      <TypeModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditType(null) }} editItem={editType ?? null} />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteMaintenanceType(deleteId); toast.success('Type deleted') } }}
        title="Delete Type"
        description="This maintenance type will be permanently deleted."
      />
    </div>
  )
}
