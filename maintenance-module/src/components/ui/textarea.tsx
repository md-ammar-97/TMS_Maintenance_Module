'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[80px] rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none resize-y transition-colors',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
