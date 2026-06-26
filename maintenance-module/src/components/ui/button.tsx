'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded',
        variant === 'primary'     && 'bg-primary-container text-on-primary-container hover:bg-inverse-primary',
        variant === 'destructive' && 'bg-error text-white hover:opacity-90',
        (variant === 'secondary' || variant === 'outline') && 'border border-border text-on-surface hover:bg-surface-container-low bg-transparent',
        variant === 'ghost'       && 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface bg-transparent border-0',
        size === 'md'   && 'h-9 px-4 text-sm',
        size === 'sm'   && 'h-7 px-3 text-xs',
        size === 'icon' && 'w-9 h-9',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'
