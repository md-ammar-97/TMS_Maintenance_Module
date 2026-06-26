'use client'

import { useState } from 'react'
import { Plus, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { ActiveStatusBadge } from '@/components/shared/StatusBadge'
import { Button } from '@/components/ui/button'
import { PlanModal } from './PlanModal'
import { TruckDetailsModal } from './TruckDetailsModal'
import type { MaintenancePlan } from '@/types'

export default function PlanPage() {
  const { maintenancePlans, maintenanceTypes, deleteMaintenancePlan } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<MaintenancePlan | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewPlan, setViewPlan] = useState<MaintenancePlan | null>(null)

  const filtered = maintenancePlans.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (maintenanceTypes.find(t => t.id === p.maintenanceTypeId)?.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id: string) {
    deleteMaintenancePlan(id)
    toast.success('Plan deleted')
  }

  const columns: Column<MaintenancePlan>[] = [
    {
      key: 'name',
      header: 'Plan Name',
      render: row => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'type',
      header: 'Maintenance Type',
      render: row => {
        const t = maintenanceTypes.find(x => x.id === row.maintenanceTypeId)
        return <span className="text-gray-600">{t?.name ?? '—'}</span>
      },
    },
    {
      key: 'interval',
      header: 'Interval',
      render: row => <span className="text-gray-600">{row.interval.toLocaleString()} {row.intervalType}</span>,
    },
    {
      key: 'dispatch',
      header: 'Dispatch Validation',
      render: row => (
        <div className="flex gap-2 text-[11px]">
          {row.validateUpcomingAtDispatch && (
            <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded">Upcoming</span>
          )}
          {row.validateDueAtDispatch && (
            <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded">Due</span>
          )}
          {!row.validateUpcomingAtDispatch && !row.validateDueAtDispatch && (
            <span className="text-gray-400">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-24',
      render: row => <ActiveStatusBadge active={row.status} />,
    },
    {
      key: 'trucks',
      header: 'Trucks',
      width: 'w-24',
      render: row => (
        <button
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-[12px] font-medium"
          onClick={e => { e.stopPropagation(); setViewPlan(row) }}
        >
          <Truck size={12} />
          View
        </button>
      ),
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

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Maintenance Plans"
        actions={
          <Button onClick={() => { setEditItem(null); setModalOpen(true) }}>
            <Plus size={14} />
            Add Plan
          </Button>
        }
        filters={
          <SearchInput value={search} onChange={setSearch} placeholder="Search plans..." />
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={r => r.id}
        emptyMessage="No plans yet."
      />

      <PlanModal
        open={modalOpen}
        onOpenChange={v => { setModalOpen(v); if (!v) setEditItem(null) }}
        editItem={editItem}
      />

      <TruckDetailsModal
        open={!!viewPlan}
        onOpenChange={v => { if (!v) setViewPlan(null) }}
        plan={viewPlan}
      />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => { if (!v) setDeleteId(null) }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId) }}
        description="This plan will be permanently removed."
      />
    </div>
  )
}
