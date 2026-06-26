import type { DueStatus, VehicleStatus, PaymentStatus } from '@/types'

const STATUS_STYLES: Record<string, { bg: string; color: string; dot?: string }> = {
  // Due
  OK:       { bg: 'rgba(16,185,129,0.12)', color: '#34d399', dot: '#10b981' },
  Upcoming: { bg: 'rgba(245,166,35,0.12)', color: '#fbbf24', dot: '#f59e0b' },
  Overdue:  { bg: 'rgba(238,68,68,0.12)',  color: '#f87171', dot: '#ef4444' },
  // Vehicle
  Active:   { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
  Inactive: { bg: 'rgba(139,144,160,0.1)', color: '#8b90a0' },
  InShop:   { bg: 'rgba(245,166,35,0.12)', color: '#fbbf24' },
  // Payment
  Paid:     { bg: 'rgba(0,112,243,0.12)',  color: '#60a5fa' },
  Pending:  { bg: 'rgba(245,166,35,0.12)', color: '#fbbf24' },
}

function Chip({ status, dot }: { status: string; dot?: boolean }) {
  const s = STATUS_STYLES[status] ?? { bg: 'rgba(139,144,160,0.1)', color: '#8b90a0' }
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      {dot && s.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />}
      {status}
    </span>
  )
}

export function DueStatusBadge({ status }: { status: DueStatus }) {
  return <Chip status={status} dot />
}

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Chip status={status} />
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Chip status={status} />
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return <Chip status={active ? 'Active' : 'Inactive'} dot />
}
