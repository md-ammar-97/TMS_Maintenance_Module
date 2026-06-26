import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  filters?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, filters, className }: PageHeaderProps) {
  return (
    <div className={cn('bg-background', className)}>
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-on-surface">{title}</h2>
          {subtitle && <p className="text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      {filters && (
        <div className="px-6 pb-4 flex items-center gap-3 flex-wrap">
          {filters}
        </div>
      )}
    </div>
  )
}
