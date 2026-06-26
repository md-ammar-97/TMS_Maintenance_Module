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
          <div className="mb-4 p-3 bg-surface-container rounded text-sm text-on-surface-variant grid grid-cols-3 gap-3">
            <div>
              <span className="text-on-surface-variant text-[11px] uppercase font-mono tracking-wider">Type</span>
              <div className="mt-1 text-on-surface">{maintenanceType?.name ?? '—'}</div>
            </div>
            <div>
              <span className="text-on-surface-variant text-[11px] uppercase font-mono tracking-wider">Interval</span>
              <div className="mt-1 text-on-surface font-mono">{plan.interval} {plan.intervalType}</div>
            </div>
            <div>
              <span className="text-on-surface-variant text-[11px] uppercase font-mono tracking-wider">Status</span>
              <div className="mt-1"><ActiveStatusBadge active={plan.status} /></div>
            </div>
          </div>

          {assignedVehicles.length === 0 ? (
            <p className="text-sm text-outline py-6 text-center">No vehicles assigned to this plan yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-border">
                  {['Vehicle #', 'Carrier', 'Terminal', 'Mileage', 'Status'].map(h => (
                    <th key={h} className="px-3 py-2 text-left text-[11px] font-semibold text-on-surface-variant uppercase font-mono">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignedVehicles.map(v => {
                  const carrier = carriers.find(c => c.id === v.carrierId)
                  return (
                    <tr key={v.id} className="border-b border-border hover:bg-surface-container-lowest/50 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-on-surface font-mono text-xs">{v.vehicleNumber}</td>
                      <td className="px-3 py-2.5 text-on-surface-variant">{carrier?.name ?? '—'}</td>
                      <td className="px-3 py-2.5 text-on-surface-variant">{v.terminal}</td>
                      <td className="px-3 py-2.5 text-on-surface-variant font-mono text-xs">{v.currentMileage.toLocaleString()}</td>
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
