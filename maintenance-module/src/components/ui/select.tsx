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
            'flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 outline-none transition-colors',
            'hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
            'data-[placeholder]:text-gray-400',
            error && 'border-red-400',
            disabled && 'opacity-50 cursor-not-allowed',
            triggerClassName
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown size={14} className="text-gray-400" />
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
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 cursor-pointer hover:bg-gray-50 hover:text-gray-900 outline-none data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-700"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <Check size={13} />
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
