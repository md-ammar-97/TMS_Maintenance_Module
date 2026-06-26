import * as React from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ className, children, required, style, ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-[11px] font-medium uppercase tracking-wide mb-1', className)}
      style={{ color: 'var(--text-3)', ...style }}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}
