import * as React from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn('block text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-1', className)}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}
