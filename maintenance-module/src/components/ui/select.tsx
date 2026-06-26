'use client'

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { cn } from '@/lib/utils'

interface SelectOption { value: string; label: string }

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
            'flex h-9 w-full items-center justify-between rounded border px-3 text-sm outline-none transition-colors',
            'bg-surface-container-low border-border text-on-surface',
            'focus:ring-1 focus:ring-primary focus:border-primary',
            'data-[placeholder]:text-outline',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-error',
            triggerClassName
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className="popover-content z-50 max-h-60 w-[var(--radix-select-trigger-width)] overflow-auto rounded py-1"
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.Viewport>
              {options.map((opt) => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <span className="material-symbols-outlined text-[14px] text-primary-container">check</span>
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}
