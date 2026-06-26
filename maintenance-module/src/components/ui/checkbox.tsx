'use client'

import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
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
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={checked
        ? { background: 'var(--primary)', borderColor: 'var(--primary)' }
        : { background: 'var(--surface)', borderColor: 'var(--border)' }
      }
    >
      <RadixCheckbox.Indicator>
        <Check size={11} className="text-white" strokeWidth={3} />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  )
}
