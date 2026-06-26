import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple'
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        variant === 'blue'   && 'bg-success/10 text-success border-success/20',
        variant === 'green'  && 'bg-success/10 text-success border-success/20',
        variant === 'yellow' && 'bg-warning/10 text-warning border-warning/20',
        variant === 'red'    && 'bg-error/10 text-error border-error/20',
        variant === 'purple' && 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30',
        variant === 'gray'   && 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
        className
      )}
    >
      {children}
    </span>
  )
}
