'use client'

import { useState, useMemo } from 'react'
import { Plus, Settings2 } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { ExportButton } from '@/components/shared/ExportButton'
import { ActiveStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LogModal } from './LogModal'
import { VendorModal } from './VendorModal'
import type { MaintenanceLog, Vendor } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function LogsPage() {
  const { maintenanceLogs, deleteLog, maintenanceTypes, vehicles, trailers, carriers, vendors, deleteVendor } = useApp()
  const [tab, setTab] = useState('logs')
  const [search, setSearch] = useState('')
  const [unitFilter, setUnitFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [vendorModalOpen, setVendorModalOpen] = useState(false)
  const [editLog, setEditLog] = useState<MaintenanceLog | null>(null)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)
  const [deleteLogId, setDeleteLogId] = useState<string | null>(null)
  const [deleteVendorId, setDeleteVendorId] = useState<string | null>(null)

  const filteredLogs = useMemo(() => {
    return maintenanceLogs.filter(log => {
      if (unitFilter !== 'all' && log.unitType !== unitFilter) return false
      if (typeFilter !== 'all' && log.maintenanceTypeId !== typeFilter) return false
      if (search) {
        const vehicle = log.vehicleId ? vehicles.find(v => v.id === log.vehicleId) : null
        const trailer = log.trailerId ? trailers.find(t => t.id === log.trailerId) : null
        const vendor = log.vendorId ? vendors.find(v => v.id === log.vendorId) : null
        const type = maintenanceTypes.find(t => t.id === log.maintenanceTypeId)
        const q = search.toLowerCase()
        if (
          !vehicle?.vehicleNumber.toLowerCase().includes(q) &&
          !trailer?.trailerNumber.toLowerCase().includes(q) &&
          !vendor?.name.toLowerCase().includes(q) &&
          !type?.name.toLowerCase().includes(q) &&
          !log.billRefNumber?.toLowerCase().includes(q) &&
          !log.description?.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [maintenanceLogs, unitFilter, typeFilter, search, vehicles, trailers, vendors, maintenanceTypes])

  const typeOptions = [{ value: 'all', label: 'All Types' }, ...maintenanceTypes.map(t => ({ value: t.id, label: t.name }))]

  const logColumns: Column<MaintenanceLog>[] = [
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
      key: 'type',
      header: 'Type',
      render: row => {
        const t = maintenanceTypes.find(x => x.id === row.maintenanceTypeId)
        return <span className="text-gray-700">{t?.name ?? '—'}</span>
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
      key: 'serviceDate',
      header: 'Service Date',
      width: 'w-32',
      render: row => <span className="text-gray-600">{formatDate(row.serviceDate)}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      width: 'w-28',
      render: row => <span className="text-gray-900 font-medium">{formatCurrency(row.amount, row.currency)}</span>,
    },
    {
      key: 'billRef',
      header: 'Bill Ref',
      width: 'w-32',
      render: row => <span className="text-gray-500 text-[12px]">{row.billRefNumber ?? '—'}</span>,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      render: row => (
        <RowActionsMenu
          onEdit={() => { setEditLog(row); setLogModalOpen(true) }}
          onDelete={() => setDeleteLogId(row.id)}
        />
      ),
    },
  ]

  const vendorColumns: Column<Vendor>[] = [
    {
      key: 'name',
      header: 'Vendor Name',
      render: row => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-28',
      render: row => <ActiveStatusBadge active={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      render: row => (
        <RowActionsMenu
          onEdit={() => { setEditVendor(row); setVendorModalOpen(true) }}
          onDelete={() => setDeleteVendorId(row.id)}
        />
      ),
    },
  ]

  const exportRows = filteredLogs.map(log => {
    const vehicle = log.vehicleId ? vehicles.find(v => v.id === log.vehicleId) : null
    const trailer = log.trailerId ? trailers.find(t => t.id === log.trailerId) : null
    const vendor = vendors.find(v => v.id === log.vendorId)
    const type = maintenanceTypes.find(t => t.id === log.maintenanceTypeId)
    return {
      'Unit': vehicle?.vehicleNumber ?? trailer?.trailerNumber ?? '',
      'Unit Type': log.unitType,
      'Maintenance Type': type?.name ?? '',
      'Vendor': vendor?.name ?? '',
      'Service Date': log.serviceDate,
      'Amount': log.amount,
      'Currency': log.currency,
      'Bill Ref': log.billRefNumber ?? '',
      'Description': log.description ?? '',
    }
  })

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Maintenance Logs"
        actions={
          <>
            {tab === 'logs' && (
              <>
                <ExportButton filename="maintenance-logs" columns={Object.keys(exportRows[0] ?? {})} rows={exportRows} />
                <Button onClick={() => { setEditLog(null); setLogModalOpen(true) }}>
                  <Plus size={14} />
                  Add Log
                </Button>
              </>
            )}
            {tab === 'vendors' && (
              <Button onClick={() => { setEditVendor(null); setVendorModalOpen(true) }}>
                <Plus size={14} />
                Add Vendor
              </Button>
            )}
          </>
        }
        filters={tab === 'logs' ? (
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search logs..." />
            <Select
              value={unitFilter}
              onValueChange={setUnitFilter}
              options={[{ value: 'all', label: 'All Units' }, { value: 'Vehicle', label: 'Vehicles' }, { value: 'Trailer', label: 'Trailers' }]}
              triggerClassName="h-8 text-[12px] w-36"
            />
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={typeOptions}
              triggerClassName="h-8 text-[12px] w-40"
            />
          </>
        ) : undefined}
      />

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="px-6 bg-white">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="flex-1 flex flex-col overflow-hidden mt-0">
          <DataTable
            columns={logColumns}
            data={filteredLogs}
            getRowId={r => r.id}
            emptyMessage="No maintenance logs yet."
          />
        </TabsContent>

        <TabsContent value="vendors" className="flex-1 flex flex-col overflow-hidden mt-0">
          <DataTable
            columns={vendorColumns}
            data={vendors}
            getRowId={r => r.id}
            emptyMessage="No vendors yet."
          />
        </TabsContent>
      </Tabs>

      <LogModal
        open={logModalOpen}
        onOpenChange={v => { setLogModalOpen(v); if (!v) setEditLog(null) }}
        editItem={editLog}
      />
      <VendorModal
        open={vendorModalOpen}
        onOpenChange={v => { setVendorModalOpen(v); if (!v) setEditVendor(null) }}
        editItem={editVendor}
      />
      <ConfirmDeleteDialog
        open={!!deleteLogId}
        onOpenChange={v => { if (!v) setDeleteLogId(null) }}
        onConfirm={() => { if (deleteLogId) { deleteLog(deleteLogId); toast.success('Log deleted') } }}
      />
      <ConfirmDeleteDialog
        open={!!deleteVendorId}
        onOpenChange={v => { if (!v) setDeleteVendorId(null) }}
        onConfirm={() => { if (deleteVendorId) { deleteVendor(deleteVendorId); toast.success('Vendor deleted') } }}
      />
    </div>
  )
}
