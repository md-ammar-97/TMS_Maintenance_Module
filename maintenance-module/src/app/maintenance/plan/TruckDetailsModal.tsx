'use client'

import { useApp } from '@/context/AppContext'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ActiveStatusBadge } from '@/components/shared/StatusBadge'
import type { MaintenancePlan } from '@/types'

interface TruckDetailsModalProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  plan: MaintenancePlan | null
}

export function TruckDetailsModal({ open, onOpenChange, plan }: TruckDetailsModalProps) {
  const { vehicles, carriers, maintenanceTypes, dueMaintenance } = useApp()
  if (!plan) return null

  const maintenanceType = maintenanceTypes.find(t => t.id === plan.maintenanceTypeId)
  const planDue = dueMaintenance.filter(d => d.maintenancePlanId === plan.id && d.unitType === 'Vehicle')
  const vehicleIds = [...new Set(planDue.map(d => d.vehicleId).filter(Boolean))]
  const assignedVehicles = vehicles.filter(v => vehicleIds.includes(v.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={`${plan.name} — Assigned Vehicles`} size="lg">
        <div className="px-5 py-4">
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-[13px] text-gray-600 grid grid-cols-3 gap-3">
            <div><span className="text-gray-400 text-[11px] uppercase font-semibold">Type</span><div className="mt-1">{maintenanceType?.name ?? '—'}</div></div>
            <div><span className="text-gray-400 text-[11px] uppercase font-semibold">Interval</span><div className="mt-1">{plan.interval} {plan.intervalType}</div></div>
            <div><span className="text-gray-400 text-[11px] uppercase font-semibold">Status</span><div className="mt-1"><ActiveStatusBadge active={plan.status} /></div></div>
          </div>

          {assignedVehicles.length === 0 ? (
            <p className="text-[13px] text-gray-400 py-6 text-center">No vehicles assigned to this plan yet.</p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">Vehicle #</th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">Carrier</th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">Terminal</th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">Mileage</th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignedVehicles.map(v => {
                  const carrier = carriers.find(c => c.id === v.carrierId)
                  return (
                    <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-medium text-gray-900">{v.vehicleNumber}</td>
                      <td className="px-3 py-2.5 text-gray-600">{carrier?.name ?? '—'}</td>
                      <td className="px-3 py-2.5 text-gray-600">{v.terminal}</td>
                      <td className="px-3 py-2.5 text-gray-600">{v.currentMileage.toLocaleString()}</td>
                      <td className="px-3 py-2.5"><ActiveStatusBadge active={v.status === 'Active'} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
