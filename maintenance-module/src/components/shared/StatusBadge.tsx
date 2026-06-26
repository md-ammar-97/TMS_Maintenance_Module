import type { DueStatus, VehicleStatus, PaymentStatus } from '@/types'
import { cn } from '@/lib/utils'

// Due maintenance status
export function DueStatusBadge({ status }: { status: DueStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
      status === 'OK' && 'bg-green-50 text-green-700',
      status === 'Upcoming' && 'bg-yellow-50 text-yellow-700',
      status === 'Overdue' && 'bg-red-50 text-red-700',
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'OK' && 'bg-green-500',
        status === 'Upcoming' && 'bg-yellow-500',
        status === 'Overdue' && 'bg-red-500',
      )} />
      {status}
    </span>
  )
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
      status === 'Active' && 'bg-green-50 text-green-700',
      status === 'Inactive' && 'bg-gray-50 text-gray-600',
      status === 'InShop' && 'bg-yellow-50 text-yellow-700',
    )}>
      {status}
    </span>
  )
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium',
      status === 'Paid' && 'bg-green-50 text-green-700',
      status === 'Pending' && 'bg-yellow-50 text-yellow-700',
    )}>
      {status}
    </span>
  )
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium',
      active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500',
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', active ? 'bg-green-500' : 'bg-gray-400')} />
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}
