'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import { BillModal } from './BillModal'
import type { MaintenanceBill } from '@/types'

const ROWS_PER_PAGE = 10

function BillStatusBadge({ status }: { status: string }) {
  if (status === 'Paid')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success border border-success/20">Paid</span>
  if (status === 'Pending')
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning border border-warning/20">Pending</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-container-highest text-on-surface-variant border border-outline-variant">{status}</span>
}

export default function BillsPage() {
  const { maintenanceBills, vehicles, trailers, vendors: vendorList, deleteBill } = useApp()
  const [vendorFilter, setVendorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editBill, setEditBill] = useState<MaintenanceBill | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let rows = maintenanceBills
    if (vendorFilter !== 'all') rows = rows.filter(b => b.vendorId === vendorFilter)
    if (statusFilter !== 'all') rows = rows.filter(b => b.paymentStatus === statusFilter)
    if (search) rows = rows.filter(b => b.billRefNumber?.toLowerCase().includes(search.toLowerCase()))
    return rows
  }, [maintenanceBills, vendorFilter, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  function getUnitNum(bill: MaintenanceBill) {
    if (bill.unitType === 'Vehicle') return vehicles.find(v => v.id === bill.vehicleId)?.vehicleNumber ?? bill.vehicleId ?? '—'
    return trailers.find(t => t.id === bill.trailerId)?.trailerNumber ?? bill.trailerId ?? '—'
  }

  function getVendorName(vendorId?: string) {
    return vendorId ? (vendorList.find(v => v.id === vendorId)?.name ?? '—') : '—'
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Maintenance Bills</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Track and manage all maintenance-related invoices and payments.</p>
          </div>
          <button
            onClick={() => { setEditBill(null); setModalOpen(true) }}
            className="bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-colors py-2 px-4 rounded font-medium text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Add Bill
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="h-9 px-3 border border-border rounded text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">date_range</span>
            Date Range
          </button>
          <select
            value={vendorFilter}
            onChange={e => { setVendorFilter(e.target.value); setPage(1) }}
            className="h-9 px-3 pr-8 text-sm rounded border bg-surface-container-low border-border text-on-surface outline-none focus:border-primary"
          >
            <option value="all">All Vendors</option>
            {vendorList.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="h-9 px-3 pr-8 text-sm rounded border bg-surface-container-low border-border text-on-surface outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search bills..."
              className="h-9 pl-9 pr-4 text-sm rounded border bg-surface-container-low border-border text-on-surface placeholder:text-outline outline-none focus:border-primary w-48"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mx-6 mb-6 bg-surface rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                {['Bill Ref', 'Status', 'Vendor', 'Unit', 'Date', 'Amount', 'Actions'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono', h === 'Amount' && 'text-right')}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-outline">No bills found.</td></tr>
              ) : (
                paged.map((bill, i) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    className="group hover:bg-surface-container-lowest/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-primary font-medium">{bill.billRefNumber ?? '—'}</td>
                    <td className="px-4 py-3"><BillStatusBadge status={bill.paymentStatus ?? 'Pending'} /></td>
                    <td className="px-4 py-3 text-on-surface">{getVendorName(bill.vendorId)}</td>
                    <td className="px-4 py-3 text-on-surface-variant font-mono text-xs">{getUnitNum(bill)}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{formatDate(bill.billDate)}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-on-surface font-medium">{formatCurrency(bill.totalAmount ?? 0)}</td>
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        onEdit={() => { setEditBill(bill); setModalOpen(true) }}
                        onDelete={() => setDeleteId(bill.id)}
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

      <BillModal open={modalOpen} onOpenChange={v => { setModalOpen(v); if (!v) setEditBill(null) }} editItem={editBill} />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => !v && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteBill(deleteId); toast.success('Bill deleted') } }}
        title="Delete Bill"
        description="This maintenance bill will be permanently deleted."
      />
    </div>
  )
}
