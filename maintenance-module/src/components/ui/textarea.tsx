'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, style, ...props }, ref) => (
    <textarea
      ref={ref}
      style={{ background: 'var(--surface)', color: 'var(--text-1)', borderColor: 'var(--border)', ...style }}
      className={cn(
        'w-full min-h-[80px] rounded-md border px-3 py-2 text-[13px] placeholder:opacity-40 outline-none resize-y transition-colors focus:ring-2 focus:ring-blue-500/20',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
