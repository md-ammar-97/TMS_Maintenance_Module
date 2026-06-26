'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ClipboardList, FileText, Wrench, Receipt, Package,
  AlertCircle, ClipboardCheck, ChevronLeft, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Plan', href: '/maintenance/plan', icon: ClipboardList },
  { label: 'Logs', href: '/maintenance/logs', icon: FileText },
  { label: 'Maintenance Types', href: '/maintenance/types', icon: Wrench },
  { label: 'Maintenance Bills', href: '/maintenance/bills', icon: Receipt },
  { label: 'Parts', href: '/maintenance/parts', icon: Package },
  { label: 'Due Maintenance', href: '/maintenance/due-maintenance', icon: AlertCircle },
  { label: 'Inspection', href: '/maintenance/inspection', icon: ClipboardCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-[52px] border-b border-gray-200">
        <div>
          <div className="text-sm font-bold text-gray-900 tracking-wide">FreightNXT</div>
          <div className="text-[10px] text-gray-400">(by Axestrack)</div>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Section label */}
        <div className="px-4 mb-1">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Maintenance</span>
        </div>

        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 px-4 h-9 text-[13px] transition-colors',
                isActive
                  ? 'border-l-2 border-blue-600 bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
              )}
            >
              <Icon size={15} className={cn(isActive ? 'text-blue-600' : 'text-gray-400')} />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-3">
        <button className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-gray-700 w-full">
          <Settings size={13} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
