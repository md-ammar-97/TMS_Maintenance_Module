'use client'

import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[16px]">search</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9 pr-3 text-sm rounded border outline-none transition-colors w-52 bg-surface-container-low border-border text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:border-primary"
      />
    </div>
  )
}
