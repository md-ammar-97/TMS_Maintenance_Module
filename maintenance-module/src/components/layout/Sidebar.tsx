'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Plan',              href: '/maintenance/plan',            icon: 'calendar_today' },
  { label: 'Logs',              href: '/maintenance/logs',            icon: 'assignment' },
  { label: 'Maintenance Types', href: '/maintenance/types',           icon: 'category' },
  { label: 'Bills',             href: '/maintenance/bills',           icon: 'receipt_long' },
  { label: 'Parts',             href: '/maintenance/parts',           icon: 'settings_input_component' },
  { label: 'Due Maintenance',   href: '/maintenance/due-maintenance', icon: 'priority_high' },
  { label: 'Inspection',        href: '/maintenance/inspection',      icon: 'fact_check' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex flex-col h-screen overflow-y-auto py-4 bg-surface-container-lowest border-r border-border fixed left-0 top-0 w-60 z-40">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold flex-shrink-0">
            FX
          </div>
          <div>
            <h1 className="text-base font-bold text-on-surface leading-tight">FreightNXT</h1>
            <p className="text-xs text-on-surface-variant">(by Axestrack)</p>
          </div>
        </div>
      </div>

      {/* Create Work Order */}
      <div className="px-4 mb-6">
        <button className="w-full bg-primary-container text-on-primary-container hover:bg-inverse-primary transition-all text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,112,243,0.3)]">
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          Create Work Order
        </button>
      </div>

      {/* Nav items */}
      <div className="flex-1 flex flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <motion.div key={href} whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                )}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-border pt-4 flex flex-col gap-0.5 px-2">
        {[
          { label: 'Settings', icon: 'settings' },
          { label: 'Support',  icon: 'help' },
        ].map(({ label, icon }) => (
          <button
            key={label}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}
