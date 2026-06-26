'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ClipboardList, FileText, Wrench, Receipt, Package,
  AlertCircle, ClipboardCheck, Settings, HelpCircle, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Plan',              href: '/maintenance/plan',             icon: ClipboardList },
  { label: 'Logs',              href: '/maintenance/logs',             icon: FileText },
  { label: 'Maintenance Types', href: '/maintenance/types',            icon: Wrench },
  { label: 'Bills',             href: '/maintenance/bills',            icon: Receipt },
  { label: 'Parts',             href: '/maintenance/parts',            icon: Package },
  { label: 'Due Maintenance',   href: '/maintenance/due-maintenance',  icon: AlertCircle },
  { label: 'Inspection',        href: '/maintenance/inspection',       icon: ClipboardCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-[160px] flex-shrink-0 flex flex-col h-full border-r"
      style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>FreightNXT</div>
        <div className="text-[9px]" style={{ color: 'var(--text-4)' }}>(by Axestrack)</div>
      </div>

      {/* Create Work Order */}
      <div className="px-3 pt-3 pb-2">
        <button
          className="w-full flex items-center justify-center gap-1.5 h-8 text-white text-[11px] font-semibold rounded-md transition-colors"
          style={{ background: 'var(--primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
        >
          <Plus size={12} />
          Create Work Order
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 px-3 h-9 text-[12px] transition-colors rounded-sm mx-1 my-0.5',
                isActive ? 'text-white font-medium' : 'hover:opacity-80'
              )}
              style={isActive
                ? { background: 'var(--primary)', color: 'white' }
                : { color: 'var(--text-3)' }
              }
            >
              <Icon size={14} style={{ color: isActive ? 'white' : 'var(--text-4)' }} />
              <span className="truncate leading-none">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="py-2 px-1" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { icon: Settings, label: 'Settings' },
          { icon: HelpCircle, label: 'Support' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-2 text-[11px] w-full px-2 h-8 rounded-sm transition-colors"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-high)'; e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
