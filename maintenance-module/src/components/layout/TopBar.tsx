'use client'

import { Search, Sun, Moon, Bell, ChevronDown } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header
      className="h-[52px] flex-shrink-0 flex items-center px-6 justify-between z-10 border-b"
      style={{ background: 'var(--topbar-bg)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div>
        <div className="text-[15px] font-bold tracking-widest" style={{ color: 'var(--text-1)' }}>AXESTRACK</div>
        <div className="text-[9px] -mt-0.5" style={{ color: 'var(--text-4)' }}>Right Information, Great Decisions</div>
      </div>

      {/* Search */}
      <div className="relative mx-6 flex-1 max-w-xs">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
        <input
          placeholder="Search..."
          className="h-8 w-full pl-8 pr-3 text-[12px] rounded-md border outline-none transition-colors"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-1)',
          }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Bell */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors relative"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <button
          className="flex items-center gap-2 ml-1 pl-2 rounded-full transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
            style={{ background: 'var(--primary)' }}
          >
            D
          </div>
          <div className="text-left">
            <div className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>demo</div>
            <div className="text-[10px] leading-tight" style={{ color: 'var(--text-4)' }}>Member</div>
          </div>
          <ChevronDown size={13} style={{ color: 'var(--text-4)' }} />
        </button>
      </div>
    </header>
  )
}
