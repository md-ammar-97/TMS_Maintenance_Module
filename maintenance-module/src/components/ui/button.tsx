'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap',
          variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 text-white rounded-md',
          (variant === 'secondary' || variant === 'outline') && 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md',
          variant === 'ghost' && 'hover:bg-gray-100 text-gray-600 rounded-md',
          variant === 'destructive' && 'bg-red-600 hover:bg-red-700 text-white rounded-md',
          size === 'md' && 'h-9 px-4 text-[13px]',
          size === 'sm' && 'h-7 px-3 text-[12px]',
          size === 'icon' && 'w-9 h-9',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
