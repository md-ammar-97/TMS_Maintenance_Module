'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[80px] rounded border px-3 py-2 text-sm text-on-surface bg-surface-container-low border-border',
        'placeholder:text-outline outline-none resize-y transition-colors',
        'focus:ring-1 focus:ring-primary focus:border-primary',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
