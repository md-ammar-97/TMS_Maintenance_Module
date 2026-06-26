'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 pr-3 text-[12px] bg-white border border-gray-200 rounded-md outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-52 placeholder:text-gray-400"
      />
    </div>
  )
}
