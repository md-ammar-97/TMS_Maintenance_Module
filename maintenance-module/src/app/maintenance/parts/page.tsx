'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { ExportButton } from '@/components/shared/ExportButton'
import { PartModal } from './PartModal'
import type { Part } from '@/types'

const TABLE_HEADERS = ['Part Name', 'SKU / ID', 'Description', 'Actions']

export default function PartsPage() {
  const { parts, deletePart } = useApp()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editPart, setEditPart] = useState<Part | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    search ? parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())) : parts,
    [parts, search]
  )
  const exportRows = filtered.map(part => ({
    'Part Name': part.name,
    'SKU / ID': part.id.toUpperCase().replace('PART-', 'SKU-'),
    Description: part.description,
    Actions: '',
  }))

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }
  function toggleAll() {
    setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Parts Catalog</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Manage spare parts and components inventory.</p>
          </div>
          <button
            onClick={() => { setEditPart(null); setModalOpen(true) }}
            className="bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Create New Part
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-border bg-surface-container">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">filter_list</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by Category"
              className="h-8 pl-9 pr-4 text-sm rounded border bg-surface border-border text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary w-48 transition-colors"
            />
          </div>
          <span className="text-xs text-on-surface-variant font-mono ml-auto">{filtered.length} items found</span>
          <ExportButton filename="parts" columns={TABLE_HEADERS} rows={exportRows} />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-border">
              <th className="w-12 px-4 py-3">
                <Checkbox checked={selected.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">Part Name</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono hidden sm:table-cell">SKU / ID</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono">Description</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-outline">No parts found.</td>
              </tr>
            ) : (
              filtered.map((part, i) => (
                <motion.tr
                  key={part.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  className="group hover:bg-surface-container-lowest/50 transition-colors"
                >
                  <td className="w-12 p-4">
                    <Checkbox checked={selected.includes(part.id)} onCheckedChange={() => toggleSelect(part.id)} />
                  </td>
                  <td className="p-4 font-medium text-on-surface">{part.name}</td>
                  <td className="p-4 text-on-surface-variant font-mono text-xs hidden sm:table-cell">
                    {part.id.toUpperCase().replace('PART-', 'SKU-')}
                  </td>
                  <td className="p-4 text-on-surface-variant truncate max-w-[200px] md:max-w-none">{part.description || '—'}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditPart(part); setModalOpen(true) }}
                        className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all p-1 rounded hover:bg-surface-container-highest"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteId(part.id)}
                        className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-all p-1 rounded hover:bg-error/10"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-border flex justify-between items-center bg-surface-container-lowest">
          <span className="text-xs text-on-surface-variant font-mono">
            {selected.length > 0 ? `${selected.length} selected` : `${filtered.length} items`}
          </span>
        </div>
      </div>

      <PartModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditPart(null) }} editItem={editPart ?? null} />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deletePart(deleteId); toast.success('Part deleted') } }}
        title="Delete Part"
        description="This part will be permanently deleted."
      />
    </div>
  )
}
