'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', style, children, ...props }, ref) => {
    const variantStyle: React.CSSProperties =
      variant === 'primary'
        ? { background: 'var(--primary)', color: 'white' }
        : variant === 'destructive'
        ? { background: '#dc2626', color: 'white' }
        : { background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }

    return (
      <button
        ref={ref}
        style={{ ...variantStyle, ...style }}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap rounded-md',
          size === 'md' && 'h-9 px-4 text-[13px]',
          size === 'sm' && 'h-7 px-3 text-[12px]',
          size === 'icon' && 'w-9 h-9',
          variant === 'ghost' && 'border-0',
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
