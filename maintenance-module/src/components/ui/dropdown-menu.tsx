'use client'

import * as React from 'react'
import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const DropdownMenu = RadixDropdown.Root
export const DropdownMenuTrigger = RadixDropdown.Trigger
export const DropdownMenuSeparator = RadixDropdown.Separator

export function DropdownMenuContent({ children, className, ...props }: RadixDropdown.DropdownMenuContentProps) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        className={cn('dropdown-content z-50 min-w-[160px] py-1', className)}
        sideOffset={4}
        {...props}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
}

interface DropdownMenuItemProps extends RadixDropdown.DropdownMenuItemProps {
  destructive?: boolean
  icon?: string
}

export function DropdownMenuItem({ children, className, destructive, icon, ...props }: DropdownMenuItemProps) {
  return (
    <RadixDropdown.Item
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer outline-none transition-colors',
        destructive
          ? 'text-error hover:bg-error/10'
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
        className
      )}
      {...props}
    >
      {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
      {children}
    </RadixDropdown.Item>
  )
}
