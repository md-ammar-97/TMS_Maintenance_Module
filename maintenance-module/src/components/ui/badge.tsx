import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'
  className?: string
}

const variantStyles: Record<string, { background: string; color: string; border: string }> = {
  blue:   { background: 'rgba(0,112,243,0.15)',  color: '#60a5fa', border: 'rgba(0,112,243,0.3)' },
  green:  { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  yellow: { background: 'rgba(245,166,35,0.15)', color: '#fbbf24', border: 'rgba(245,166,35,0.3)' },
  red:    { background: 'rgba(238,0,0,0.15)',    color: '#f87171', border: 'rgba(238,0,0,0.3)'   },
  gray:   { background: 'rgba(139,144,160,0.15)',color: '#8b90a0', border: 'rgba(139,144,160,0.3)' },
  purple: { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const s = variantStyles[variant]
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border', className)}
      style={s}
    >
      {children}
    </span>
  )
}
