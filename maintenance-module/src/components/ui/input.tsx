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
          'h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none transition-colors',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
