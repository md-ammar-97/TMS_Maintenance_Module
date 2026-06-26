'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          'h-9 w-full rounded border px-3 text-sm text-on-surface bg-surface-container-low border-border',
          'placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors',
          error && 'border-error',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
