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
    <div className={cn('border-b', className)} style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold" style={{ color: 'var(--text-1)' }}>{title}</h1>
          {subtitle && <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-3)' }}>{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {filters && (
        <div className="px-6 pb-3 flex items-center gap-3 flex-wrap">
          {filters}
        </div>
      )}
    </div>
  )
}
