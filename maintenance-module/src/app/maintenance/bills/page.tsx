'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { ExportButton } from '@/components/shared/ExportButton'
import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { BillModal } from './BillModal'
import type { MaintenanceBill } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function BillsPage() {
  const { maintenanceBills, deleteBill, vehicles, trailers, vendors, carriers } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<MaintenanceBill | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return maintenanceBills.filter(bill => {
      if (statusFilter !== 'all' && bill.paymentStatus !== statusFilter) return false
      if (unitFilter !== 'all' && bill.unitType !== unitFilter) return false
      if (search) {
        const vehicle = bill.vehicleId ? vehicles.find(v => v.id === bill.vehicleId) : null
        const trailer = bill.trailerId ? trailers.find(t => t.id === bill.trailerId) : null
        const vendor = vendors.find(v => v.id === bill.vendorId)
        const q = search.toLowerCase()
        if (
          !bill.billRefNumber.toLowerCase().includes(q) &&
          !vehicle?.vehicleNumber.toLowerCase().includes(q) &&
          !trailer?.trailerNumber.toLowerCase().includes(q) &&
          !vendor?.name.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [maintenanceBills, statusFilter, unitFilter, search, vehicles, trailers, vendors])

  function handleDelete(id: string) {
    deleteBill(id)
    toast.success('Bill deleted')
  }

  const columns: Column<MaintenanceBill>[] = [
    {
      key: 'billRef',
      header: 'Bill Ref #',
      render: row => <span className="font-medium text-blue-600 text-[12px]">{row.billRefNumber}</span>,
    },
    {
      key: 'unit',
      header: 'Unit',
      render: row => {
        const vehicle = row.vehicleId ? vehicles.find(v => v.id === row.vehicleId) : null
        const trailer = row.trailerId ? trailers.find(t => t.id === row.trailerId) : null
        return (
          <div>
            <div className="font-medium text-gray-900">{vehicle?.vehicleNumber ?? trailer?.trailerNumber ?? '—'}</div>
            <div className="text-[11px] text-gray-400">{row.unitType}</div>
          </div>
        )
      },
    },
    {
      key: 'vendor',
      header: 'Vendor',
      render: row => {
        const v = vendors.find(x => x.id === row.vendorId)
        return <span className="text-gray-600">{v?.name ?? '—'}</span>
      },
    },
    {
      key: 'carrier',
      header: 'Carrier',
      render: row => {
        const c = carriers.find(x => x.id === row.carrierId)
        return <span className="text-gray-600 text-[12px] truncate max-w-[160px] block">{c?.name ?? '—'}</span>
      },
    },
    {
      key: 'billDate',
      header: 'Bill Date',
      width: 'w-28',
      render: row => <span className="text-gray-600">{formatDate(row.billDate)}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: 'w-28',
      render: row => <span className="font-medium text-gray-900">{formatCurrency(row.totalAmount, row.currency)}</span>,
    },
    {
      key: 'status',
      header: 'Payment',
      width: 'w-24',
      render: row => <PaymentStatusBadge status={row.paymentStatus} />,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      render: row => (
        <RowActionsMenu
          onEdit={() => { setEditItem(row); setModalOpen(true) }}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  const exportRows = filtered.map(bill => {
    const vehicle = bill.vehicleId ? vehicles.find(v => v.id === bill.vehicleId) : null
    const trailer = bill.trailerId ? trailers.find(t => t.id === bill.trailerId) : null
    const vendor = vendors.find(v => v.id === bill.vendorId)
    const carrier = carriers.find(c => c.id === bill.carrierId)
    return {
      'Bill Ref': bill.billRefNumber,
      'Unit': vehicle?.vehicleNumber ?? trailer?.trailerNumber ?? '',
      'Unit Type': bill.unitType,
      'Vendor': vendor?.name ?? '',
      'Carrier': carrier?.name ?? '',
      'Bill Date': bill.billDate,
      'Amount': bill.totalAmount,
      'Currency': bill.currency,
      'Payment Status': bill.paymentStatus,
      'Payment Method': bill.paymentMethod ?? '',
    }
  })

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Maintenance Bills"
        actions={
          <>
            <ExportButton filename="maintenance-bills" columns={Object.keys(exportRows[0] ?? {})} rows={exportRows} />
            <Button onClick={() => { setEditItem(null); setModalOpen(true) }}>
              <Plus size={14} />
              Add Bill
            </Button>
          </>
        }
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search bills..." />
            <Select
              value={unitFilter}
              onValueChange={setUnitFilter}
              options={[{ value: 'all', label: 'All Units' }, { value: 'Vehicle', label: 'Vehicles' }, { value: 'Trailer', label: 'Trailers' }]}
              triggerClassName="h-8 text-[12px] w-36"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[{ value: 'all', label: 'All Status' }, { value: 'Pending', label: 'Pending' }, { value: 'Paid', label: 'Paid' }]}
              triggerClassName="h-8 text-[12px] w-36"
            />
          </>
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={r => r.id}
        emptyMessage="No bills yet."
      />

      <BillModal
        open={modalOpen}
        onOpenChange={v => { setModalOpen(v); if (!v) setEditItem(null) }}
        editItem={editItem}
      />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => { if (!v) setDeleteId(null) }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId) }}
        description="This bill will be permanently removed."
      />
    </div>
  )
}
