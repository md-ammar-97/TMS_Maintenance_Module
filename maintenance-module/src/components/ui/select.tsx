'use client'

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  triggerClassName?: string
}

export function Select({ value, onValueChange, options, placeholder = 'Select...', disabled, error, triggerClassName }: SelectProps) {
  return (
    <div className="w-full">
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border px-3 text-[13px] outline-none transition-colors',
            'focus:ring-2 focus:ring-blue-500/20',
            'data-[placeholder]:opacity-40',
            disabled && 'opacity-50 cursor-not-allowed',
            triggerClassName
          )}
          style={{
            background: 'var(--surface)',
            color: 'var(--text-1)',
            borderColor: error ? '#ef4444' : 'var(--border)',
          }}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={14} style={{ color: 'var(--text-4)' }} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="popover-content z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-auto rounded-md py-1"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport>
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none transition-colors"
                  style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <Check size={13} style={{ color: 'var(--primary)' }} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  )
}
