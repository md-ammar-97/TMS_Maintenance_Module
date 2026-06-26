'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { RowActionsMenu } from '@/components/shared/RowActionsMenu'
import { ConfirmDeleteDialog } from '@/components/shared/ConfirmDeleteDialog'
import { SearchInput } from '@/components/shared/SearchInput'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { InspectionDetail } from './InspectionDetail'
import type { Inspection } from '@/types'
import { formatDate } from '@/lib/utils'

export default function InspectionPage() {
  const { inspections, vehicles, trailers, carriers, deleteInspection } = useApp()
  const [tab, setTab] = useState('vehicle')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const router = useRouter()

  const vehicleInspections = useMemo(() =>
    inspections.filter(i => i.unitType === 'Vehicle').filter(i => {
      if (!search) return true
      const v = vehicles.find(x => x.id === i.vehicleId)
      return v?.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        i.inspectionBy?.toLowerCase().includes(search.toLowerCase())
    }),
    [inspections, vehicles, search]
  )

  const trailerInspections = useMemo(() =>
    inspections.filter(i => i.unitType === 'Trailer').filter(i => {
      if (!search) return true
      const t = trailers.find(x => x.id === i.trailerId)
      return t?.trailerNumber.toLowerCase().includes(search.toLowerCase()) ||
        i.inspectionBy?.toLowerCase().includes(search.toLowerCase())
    }),
    [inspections, trailers, search]
  )

  const selected = selectedId ? inspections.find(i => i.id === selectedId) ?? null : null

  function handleDelete(id: string) {
    deleteInspection(id)
    if (selectedId === id) setSelectedId(null)
    toast.success('Inspection deleted')
  }

  function getUnit(insp: Inspection) {
    if (insp.unitType === 'Vehicle') return vehicles.find(v => v.id === insp.vehicleId)
    return trailers.find(t => t.id === insp.trailerId)
  }

  const columns: Column<Inspection>[] = [
    {
      key: 'unit',
      header: 'Unit #',
      render: row => {
        const unit = getUnit(row)
        const isVehicle = row.unitType === 'Vehicle'
        return (
          <div>
            <div className="font-medium text-gray-900">
              {isVehicle ? (unit as typeof vehicles[0])?.vehicleNumber : (unit as typeof trailers[0])?.trailerNumber}
            </div>
            <div className="text-[11px] text-gray-400">{carriers.find(c => c.id === unit?.carrierId)?.name ?? ''}</div>
          </div>
        )
      },
    },
    {
      key: 'date',
      header: 'Inspection Date',
      width: 'w-36',
      render: row => <span className="text-gray-600">{formatDate(row.inspectionDate)}</span>,
    },
    {
      key: 'by',
      header: 'Inspected By',
      render: row => <span className="text-gray-600">{row.inspectionBy ?? '—'}</span>,
    },
    {
      key: 'mileage',
      header: 'Mileage',
      width: 'w-24',
      render: row => <span className="text-gray-600">{row.mileage?.toLocaleString() ?? '—'}</span>,
    },
    {
      key: 'items',
      header: 'Items',
      width: 'w-20',
      render: row => {
        const defCount = row.items.filter(i => i.result === 'Def').length
        return (
          <div className="flex gap-1.5 items-center">
            <span className="text-[12px] text-gray-600">{row.items.length}</span>
            {defCount > 0 && (
              <span className="bg-red-50 text-red-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">{defCount} Def</span>
            )}
          </div>
        )
      },
    },
    {
      key: 'view',
      header: '',
      width: 'w-24',
      render: row => (
        <button
          onClick={() => setSelectedId(row.id)}
          className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 font-medium"
        >
          View <ChevronRight size={12} />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 'w-12',
      render: row => (
        <RowActionsMenu onDelete={() => setDeleteId(row.id)} />
      ),
    },
  ]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main list */}
      <div className={`flex flex-col ${selected ? 'flex-1' : 'w-full'} overflow-hidden`}>
        <PageHeader
          title="Inspection"
          actions={
            <Button onClick={() => router.push('/maintenance/inspection/new')}>
              <Plus size={14} />
              New Inspection
            </Button>
          }
          filters={<SearchInput value={search} onChange={setSearch} placeholder="Search inspections..." />}
        />

        <Tabs value={tab} onValueChange={t => { setTab(t); setSelectedId(null) }} className="flex flex-col flex-1 overflow-hidden">
          <TabsList className="px-6 bg-white">
            <TabsTrigger value="vehicle">Vehicle ({vehicleInspections.length})</TabsTrigger>
            <TabsTrigger value="trailer">Trailer ({trailerInspections.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="vehicle" className="flex-1 flex flex-col overflow-hidden mt-0">
            <DataTable
              columns={columns}
              data={vehicleInspections}
              getRowId={r => r.id}
              emptyMessage="No vehicle inspections yet."
              onRowClick={r => setSelectedId(r.id)}
            />
          </TabsContent>
          <TabsContent value="trailer" className="flex-1 flex flex-col overflow-hidden mt-0">
            <DataTable
              columns={columns}
              data={trailerInspections}
              getRowId={r => r.id}
              emptyMessage="No trailer inspections yet."
              onRowClick={r => setSelectedId(r.id)}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail panel */}
      {selected && (
        <InspectionDetail
          inspection={selected}
          onClose={() => setSelectedId(null)}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={v => { if (!v) setDeleteId(null) }}
        onConfirm={() => { if (deleteId) handleDelete(deleteId) }}
        description="This inspection record will be permanently removed."
      />
    </div>
  )
}
