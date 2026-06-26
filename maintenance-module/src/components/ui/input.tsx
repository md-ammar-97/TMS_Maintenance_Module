'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, style, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        style={{
          background: 'var(--surface)',
          color: 'var(--text-1)',
          borderColor: error ? '#ef4444' : 'var(--border)',
          ...style,
        }}
        className={cn(
          'h-9 w-full rounded-md border px-3 text-[13px] placeholder:opacity-40 outline-none transition-colors',
          'focus:ring-2 focus:ring-blue-500/20',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
