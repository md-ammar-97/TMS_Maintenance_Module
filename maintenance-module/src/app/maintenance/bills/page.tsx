'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { ExportButton } from '@/components/shared/ExportButton'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { useApp } from '@/context/AppContext'
import { cn, formatCurrency, formatDate, formatEmpty, formatMileage, getUnitOptionLabel } from '@/lib/utils'
import { BillModal } from './BillModal'
import type { MaintenanceBill } from '@/types'

const ROWS_PER_PAGE = 10

function BillStatusBadge({ status }: { status: string }) {
  if (status === 'Paid') return <span className="inline-flex rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">Paid</span>
  if (status === 'Pending') return <span className="inline-flex rounded-full border border-warning/20 bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">Pending</span>
  return <span className="inline-flex rounded-full border border-border bg-surface-container-high px-2 py-0.5 text-xs font-semibold text-on-surface-variant">{status}</span>
}

export default function BillsPage() {
  const { maintenanceBills, vehicles, trailers, carriers, vendors, deleteBill } = useApp()
  const [tab, setTab] = useState<'vehicle' | 'trailer'>('vehicle')
  const [search, setSearch] = useState('')
  const [carrierFilter, setCarrierFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editBill, setEditBill] = useState<MaintenanceBill | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  function getUnit(bill: MaintenanceBill) {
    return bill.unitType === 'Vehicle'
      ? vehicles.find(v => v.id === bill.vehicleId)
      : trailers.find(t => t.id === bill.trailerId)
  }
  function getUnitNumber(bill: MaintenanceBill) {
    if (bill.unitType === 'Vehicle') return vehicles.find(v => v.id === bill.vehicleId)?.vehicleNumber ?? bill.vehicleId ?? '—'
    return trailers.find(t => t.id === bill.trailerId)?.trailerNumber ?? bill.trailerId ?? '—'
  }
  function getCarrierName(bill: MaintenanceBill) {
    const carrierId = bill.carrierId ?? getUnit(bill)?.carrierId
    return carrierId ? carriers.find(c => c.id === carrierId)?.name ?? 'Unknown Carrier' : '—'
  }
  function getVendorName(bill: MaintenanceBill) {
    return vendors.find(v => v.id === bill.vendorId)?.name ?? 'Unknown Vendor'
  }

  const unitOptions = tab === 'vehicle'
    ? vehicles.map(v => ({ id: v.id, number: getUnitOptionLabel(v.vehicleNumber, v.status) }))
    : trailers.map(t => ({ id: t.id, number: getUnitOptionLabel(t.trailerNumber, t.status) }))

  const filtered = useMemo(() => {
    return maintenanceBills
      .filter(bill => tab === 'vehicle' ? bill.unitType === 'Vehicle' : bill.unitType === 'Trailer')
      .filter(bill => vendorFilter === 'all' || bill.vendorId === vendorFilter)
      .filter(bill => statusFilter === 'all' || bill.paymentStatus === statusFilter)
      .filter(bill => carrierFilter === 'all' || (bill.carrierId ?? getUnit(bill)?.carrierId) === carrierFilter)
      .filter(bill => unitFilter === 'all' || bill.vehicleId === unitFilter || bill.trailerId === unitFilter)
      .filter(bill => !search || bill.billRefNumber.toLowerCase().includes(search.toLowerCase()))
  }, [maintenanceBills, tab, vendorFilter, statusFilter, carrierFilter, unitFilter, search, vehicles, trailers])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
  const exportRows = filtered.map(bill => ({
    BillRefNumber: bill.billRefNumber,
    PaymentStatus: bill.paymentStatus,
    VendorName: getVendorName(bill),
    Carrier: getCarrierName(bill),
    UnitNumber: getUnitNumber(bill),
    BillDate: bill.billDate,
    TotalAmount: bill.totalAmount,
    WorkCompletedDate: bill.workCompletedDate ?? '',
    Mileage: bill.mileage ?? '',
    Location: bill.location ?? '',
  }))

  function clearFilters() {
    setSearch('')
    setCarrierFilter('all')
    setUnitFilter('all')
    setVendorFilter('all')
    setStatusFilter('all')
    setPage(1)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-on-surface">Maintenance Bills</h2>
            <p className="mt-0.5 text-sm text-on-surface-variant">Track vendor invoices and linked maintenance log items.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => toast.info('PullRay Integration Logs are not available in this prototype.')} className="rounded border border-border px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">
              PullRay Integration Logs
            </button>
            <button onClick={() => { setEditBill(null); setModalOpen(true) }} className="inline-flex items-center gap-2 rounded bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container hover:bg-inverse-primary">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create new maintenance bill
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
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Bill Ref Number" className="h-9 w-52 rounded border border-border bg-surface-container-low pl-9 pr-3 text-sm text-on-surface outline-none focus:border-primary" />
          </div>
          <select value={carrierFilter} onChange={e => { setCarrierFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Carriers</option>
            {carriers.map(carrier => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
          </select>
          <select value={unitFilter} onChange={e => { setUnitFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All {tab === 'vehicle' ? 'Vehicles' : 'Trailers'}</option>
            {unitOptions.map(unit => <option key={unit.id} value={unit.id}>{unit.number}</option>)}
          </select>
          <select value={vendorFilter} onChange={e => { setVendorFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Vendors</option>
            {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }} className="h-9 rounded border border-border bg-surface-container-low px-3 text-sm text-on-surface">
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <button onClick={clearFilters} className="h-9 rounded border border-border px-3 text-sm text-on-surface-variant hover:bg-surface-container-high">Clear</button>
          <div className="ml-auto">
            <ExportButton
              filename="maintenance-bills"
              columns={['BillRefNumber', 'PaymentStatus', 'VendorName', 'Carrier', 'UnitNumber', 'BillDate', 'TotalAmount', 'WorkCompletedDate', 'Mileage', 'Location']}
              rows={exportRows}
            />
          </div>
        </div>
      </div>

      <div className="mx-6 mb-6 flex-1 overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-container-low">
                {['Actions', 'Bill Ref Number', 'Payment Status', 'Vendor Name', 'Carrier', 'Vehicle/Trailer Number', 'Bill Date', 'Total Amount', 'Work Completed Date', 'Mileage', 'Location'].map(header => (
                  <th key={header} className={cn('px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant', ['Total Amount', 'Mileage'].includes(header) && 'text-right')}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.length === 0 ? (
                <tr><td colSpan={11} className="px-4 py-16 text-center text-sm text-outline">No bills found. Try adjusting your filters.</td></tr>
              ) : paged.map(bill => (
                <tr key={bill.id} className="group hover:bg-surface-container-low">
                  <td className="px-4 py-3">
                    <RowActionsMenu
                      onEdit={() => { setEditBill(bill); setModalOpen(true) }}
                      onDelete={() => setDeleteId(bill.id)}
                    />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">{bill.billRefNumber}</td>
                  <td className="px-4 py-3"><BillStatusBadge status={bill.paymentStatus} /></td>
                  <td className="px-4 py-3 text-on-surface">{getVendorName(bill)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{getCarrierName(bill)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-on-surface">{getUnitNumber(bill)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatDate(bill.billDate)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs font-semibold text-on-surface">{formatCurrency(bill.totalAmount, bill.currency)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{bill.workCompletedDate ? formatDate(bill.workCompletedDate) : '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-on-surface-variant">{formatMileage(bill.mileage)}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{formatEmpty(bill.location)}</td>
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

      <BillModal open={modalOpen} onOpenChange={open => { setModalOpen(open); if (!open) setEditBill(null) }} editItem={editBill} />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={open => !open && setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteBill(deleteId); toast.success('Bill deleted') } }}
        title="Delete Bill"
        description="This maintenance bill will be permanently deleted."
      />
    </div>
  )
}
