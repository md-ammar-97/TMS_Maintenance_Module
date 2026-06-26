'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

export function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="bg-surface flex justify-between items-center h-16 px-6 w-full sticky top-0 z-50 border-b border-border">
      {/* Left: brand */}
      <div className="flex items-center gap-4">
        <button className="md:hidden text-on-surface">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-2xl font-bold text-primary hidden md:block tracking-widest">AXESTRACK</span>
      </div>

      {/* Right: search */}
      <div className="relative hidden sm:block w-72 ml-auto mr-3">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
        <input
          className="bg-surface-container-low border border-border rounded-full py-1.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant w-full outline-none focus:border-primary transition-colors"
          placeholder="Search..."
          type="text"
        />
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-2 rounded-full hover:bg-surface-container-low relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
        </button>

        <div className="w-8 h-8 rounded-full bg-primary-container border border-border flex items-center justify-center text-on-primary-container text-xs font-bold ml-1 cursor-pointer">
          D
        </div>
      </div>
    </header>
  )
}
