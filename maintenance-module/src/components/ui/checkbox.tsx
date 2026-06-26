'use client'

import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

export function Checkbox({ checked, onCheckedChange, disabled, className, id }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      id={id}
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      disabled={disabled}
      className={cn(
        'w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer outline-none border',
        checked ? 'bg-primary-container border-primary-container' : 'bg-transparent border-outline-variant hover:border-primary-container',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <RadixCheckbox.Indicator>
        <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}
