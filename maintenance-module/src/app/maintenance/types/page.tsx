'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { TypeModal } from './TypeModal'
import type { MaintenanceType } from '@/types'
import { formatDate } from '@/lib/utils'

export default function MaintenanceTypesPage() {
  const { maintenanceTypes, deleteMaintenanceType } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<MaintenanceType | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = maintenanceTypes.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  function handleEdit(item: MaintenanceType) {
    setEditItem(item)
    setModalOpen(true)
  }
  function handleDelete(id: string) {
    deleteMaintenanceType(id)
    toast.success('Maintenance type deleted')
  }

  const columns: Column<MaintenanceType>[] = [
    {
      key: 'name',
      header: 'Name',
      render: row => (
        <span className="font-medium text-gray-900">{row.name}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: row => (
        <span className="text-gray-600">{row.description || '—'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: 'w-32',
      render: row => (
        <span className="text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      render: row => (
        <RowActionsMenu
          onEdit={() => handleEdit(row)}
          onDelete={() => setDeleteId(row.id)}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Maintenance Types"
        actions={
          <Button onClick={() => { setEditItem(null); setModalOpen(true) }}>
            <Plus size={14} />
            Add Type
          </Button>
        }
        filters={
          <SearchInput value={search} onChange={setSearch} placeholder="Search types..." />
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={r => r.id}
        emptyMessage={search ? 'No types match your search.' : 'No maintenance types yet.'}
      />

      <TypeModal
        open={modalOpen}
        onOpenChange={(v) => { setModalOpen(v); if (!v) setEditItem(null) }}
        editItem={editItem}
      />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => { if (!v) setDeleteId(null) }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId) }}
        description="This maintenance type will be permanently removed."
      />
    </div>
  )
}
