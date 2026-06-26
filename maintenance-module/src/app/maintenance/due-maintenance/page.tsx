'use client'

import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { DataTable, type Column } from '@/components/shared/DataTable'
import { SearchInput } from '@/components/shared/SearchInput'
import { ExportButton } from '@/components/shared/ExportButton'
import { DueStatusBadge } from '@/components/shared/StatusBadge'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { LogModal } from '../logs/LogModal'
import type { DueMaintenanceRecord } from '@/types'
import { formatDate } from '@/lib/utils'
import { Wrench } from 'lucide-react'

export default function DueMaintenancePage() {
  const { dueMaintenance, maintenancePlans, maintenanceTypes, vehicles, trailers, carriers } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [logModalOpen, setLogModalOpen] = useState(false)
  const [prefill, setPrefill] = useState<{ vehicleId?: string; trailerId?: string; planId?: string }>({})

  const filtered = useMemo(() => {
    return dueMaintenance.filter(rec => {
      if (statusFilter !== 'all' && rec.dueStatus !== statusFilter) return false
      if (unitFilter !== 'all' && rec.unitType !== unitFilter) return false
      if (search) {
        const vehicle = rec.vehicleId ? vehicles.find(v => v.id === rec.vehicleId) : null
        const trailer = rec.trailerId ? trailers.find(t => t.id === rec.trailerId) : null
        const plan = maintenancePlans.find(p => p.id === rec.maintenancePlanId)
        const type = plan ? maintenanceTypes.find(t => t.id === plan.maintenanceTypeId) : null
        const q = search.toLowerCase()
        if (
          !vehicle?.vehicleNumber.toLowerCase().includes(q) &&
          !trailer?.trailerNumber.toLowerCase().includes(q) &&
          !plan?.name.toLowerCase().includes(q) &&
          !type?.name.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [dueMaintenance, statusFilter, unitFilter, search, vehicles, trailers, maintenancePlans, maintenanceTypes])

  function handleLogMaintenance(rec: DueMaintenanceRecord) {
    setPrefill({
      vehicleId: rec.vehicleId,
      trailerId: rec.trailerId,
      planId: rec.maintenancePlanId,
    })
    setLogModalOpen(true)
  }

  const columns: Column<DueMaintenanceRecord>[] = [
    {
      key: 'unit',
      header: 'Unit',
      render: row => {
        const vehicle = row.vehicleId ? vehicles.find(v => v.id === row.vehicleId) : null
        const trailer = row.trailerId ? trailers.find(t => t.id === row.trailerId) : null
        const unit = vehicle ?? trailer
        const carrier = unit ? carriers.find(c => c.id === unit.carrierId) : null
        return (
          <div>
            <div className="font-medium text-gray-900">{vehicle?.vehicleNumber ?? trailer?.trailerNumber ?? '—'}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-[140px]">{carrier?.name ?? ''}</div>
          </div>
        )
      },
    },
    {
      key: 'plan',
      header: 'Maintenance Plan',
      render: row => {
        const plan = maintenancePlans.find(p => p.id === row.maintenancePlanId)
        const type = plan ? maintenanceTypes.find(t => t.id === plan.maintenanceTypeId) : null
        return (
          <div>
            <div className="text-gray-900">{plan?.name ?? '—'}</div>
            <div className="text-[11px] text-gray-400">{type?.name ?? ''}</div>
          </div>
        )
      },
    },
    {
      key: 'unitType',
      header: 'Type',
      width: 'w-24',
      render: row => <span className="text-gray-600 text-[12px]">{row.unitType}</span>,
    },
    {
      key: 'lastService',
      header: 'Last Service',
      width: 'w-32',
      render: row => (
        <div>
          <div className="text-gray-600">{row.lastServiceDate ? formatDate(row.lastServiceDate) : '—'}</div>
          {row.lastServiceMileage && (
            <div className="text-[11px] text-gray-400">{row.lastServiceMileage.toLocaleString()} mi</div>
          )}
        </div>
      ),
    },
    {
      key: 'dueAt',
      header: 'Due At',
      width: 'w-32',
      render: row => (
        <div>
          {row.dueDate && <div className="text-gray-600">{formatDate(row.dueDate)}</div>}
          {row.dueMileage && <div className="text-[11px] text-gray-400">{row.dueMileage.toLocaleString()} mi</div>}
        </div>
      ),
    },
    {
      key: 'dueIn',
      header: 'Due In',
      width: 'w-28',
      render: row => (
        <span className={`text-[13px] font-medium ${row.dueStatus === 'Overdue' ? 'text-red-600' : row.dueStatus === 'Upcoming' ? 'text-yellow-600' : 'text-green-600'}`}>
          {row.dueIn}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 'w-28',
      render: row => <DueStatusBadge status={row.dueStatus} />,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-24',
      render: row => (
        <Button size="sm" variant="ghost" onClick={() => handleLogMaintenance(row)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <Wrench size={13} />
          Log
        </Button>
      ),
    },
  ]

  const exportRows = filtered.map(rec => {
    const vehicle = rec.vehicleId ? vehicles.find(v => v.id === rec.vehicleId) : null
    const trailer = rec.trailerId ? trailers.find(t => t.id === rec.trailerId) : null
    const plan = maintenancePlans.find(p => p.id === rec.maintenancePlanId)
    return {
      'Unit': vehicle?.vehicleNumber ?? trailer?.trailerNumber ?? '',
      'Unit Type': rec.unitType,
      'Plan': plan?.name ?? '',
      'Last Service': rec.lastServiceDate ?? '',
      'Last Mileage': rec.lastServiceMileage ?? '',
      'Current Mileage': rec.currentMileage ?? '',
      'Due Date': rec.dueDate ?? '',
      'Due Mileage': rec.dueMileage ?? '',
      'Due In': rec.dueIn,
      'Status': rec.dueStatus,
    }
  })

  const counts = {
    all: dueMaintenance.length,
    overdue: dueMaintenance.filter(r => r.dueStatus === 'Overdue').length,
    upcoming: dueMaintenance.filter(r => r.dueStatus === 'Upcoming').length,
    ok: dueMaintenance.filter(r => r.dueStatus === 'OK').length,
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Due Maintenance"
        actions={
          <ExportButton filename="due-maintenance" columns={Object.keys(exportRows[0] ?? {})} rows={exportRows} />
        }
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search..." />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={[
                { value: 'all', label: `All (${counts.all})` },
                { value: 'Overdue', label: `Overdue (${counts.overdue})` },
                { value: 'Upcoming', label: `Upcoming (${counts.upcoming})` },
                { value: 'OK', label: `OK (${counts.ok})` },
              ]}
              triggerClassName="h-8 text-[12px] w-44"
            />
            <Select
              value={unitFilter}
              onValueChange={setUnitFilter}
              options={[{ value: 'all', label: 'All Units' }, { value: 'Vehicle', label: 'Vehicles' }, { value: 'Trailer', label: 'Trailers' }]}
              triggerClassName="h-8 text-[12px] w-36"
            />
          </>
        }
      />

      {/* Summary chips */}
      <div className="px-6 py-3 bg-white border-b border-gray-100 flex gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-md">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[12px] font-medium text-red-700">{counts.overdue} Overdue</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-md">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-[12px] font-medium text-yellow-700">{counts.upcoming} Upcoming</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-md">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[12px] font-medium text-green-700">{counts.ok} OK</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={r => r.id}
        emptyMessage="No due maintenance records."
      />

      <LogModal
        open={logModalOpen}
        onOpenChange={v => { setLogModalOpen(v); if (!v) setPrefill({}) }}
        prefillVehicleId={prefill.vehicleId}
        prefillTrailerId={prefill.trailerId}
        prefillPlanId={prefill.planId}
      />
    </div>
  )
}
