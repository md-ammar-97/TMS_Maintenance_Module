'use client'

import * as React from 'react'
import * as RadixPopover from '@radix-ui/react-popover'
import { cn } from '@/lib/utils'

export const Popover = RadixPopover.Root
export const PopoverTrigger = RadixPopover.Trigger
export const PopoverClose = RadixPopover.Close

interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

export function PopoverContent({ children, className, align = 'start', sideOffset = 4 }: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        align={align}
        sideOffset={sideOffset}
        className={cn('popover-content z-50', className)}
      >
        {children}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  )
}
