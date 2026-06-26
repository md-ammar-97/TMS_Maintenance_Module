'use client'

import * as RadixSwitch from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

interface SwitchProps {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <RadixSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'w-9 h-5 rounded-full transition-colors outline-none cursor-pointer',
        checked ? 'bg-blue-600' : 'bg-gray-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <RadixSwitch.Thumb
        className="block w-4 h-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 translate-x-0.5"
      />
    </RadixSwitch.Root>
  )
}
