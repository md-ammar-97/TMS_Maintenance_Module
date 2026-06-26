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
import { PartModal } from './PartModal'
import type { Part } from '@/types'
import { formatDate } from '@/lib/utils'

export default function PartsPage() {
  const { parts, deletePart } = useApp()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Part | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  )

  function handleDelete(id: string) {
    deletePart(id)
    toast.success('Part deleted')
  }

  const columns: Column<Part>[] = [
    {
      key: 'name',
      header: 'Part Name',
      render: row => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: row => <span className="text-gray-600">{row.description || '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      width: 'w-32',
      render: row => <span className="text-gray-500">{formatDate(row.createdAt)}</span>,
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
        title="Parts"
        actions={
          <Button onClick={() => { setEditItem(null); setModalOpen(true) }}>
            <Plus size={14} />
            Add Part
          </Button>
        }
        filters={
          <SearchInput value={search} onChange={setSearch} placeholder="Search parts..." />
        }
      />

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={r => r.id}
        emptyMessage="No parts yet."
      />

      <PartModal
        open={modalOpen}
        onOpenChange={v => { setModalOpen(v); if (!v) setEditItem(null) }}
        editItem={editItem}
      />

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => { if (!v) setDeleteId(null) }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId) }}
        description="This part will be permanently removed."
      />
    </div>
  )
}
