import type { DueStatus, VehicleStatus, PaymentStatus } from '@/types'
import { cn } from '@/lib/utils'

function StatusChip({ children, className, dot }: { children: React.ReactNode; className: string; dot?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border', className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />}
      {children}
    </span>
  )
}

export function DueStatusBadge({ status }: { status: DueStatus }) {
  if (status === 'OK')       return <StatusChip className="bg-success/10 text-success border-success/20" dot="#0070f3">{status}</StatusChip>
  if (status === 'Upcoming') return <StatusChip className="bg-warning/10 text-warning border-warning/20" dot="#f5a623">{status}</StatusChip>
  return <StatusChip className="bg-error/10 text-error border-error/20" dot="#ee0000">{status}</StatusChip>
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  if (status === 'Active')   return <StatusChip className="bg-success/10 text-success border-success/20">{status}</StatusChip>
  if (status === 'InShop')   return <StatusChip className="bg-warning/10 text-warning border-warning/20">{status}</StatusChip>
  return <StatusChip className="bg-surface-container-highest text-on-surface-variant border-outline-variant">{status}</StatusChip>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  if (status === 'Paid')     return <StatusChip className="bg-success/10 text-success border-success/20">{status}</StatusChip>
  return <StatusChip className="bg-warning/10 text-warning border-warning/20">{status}</StatusChip>
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  if (active) return <StatusChip className="bg-success/10 text-success border-success/20" dot="#0070f3">Active</StatusChip>
  return <StatusChip className="bg-surface-container-highest text-on-surface-variant border-outline-variant" dot="#8b90a0">Inactive</StatusChip>
}
