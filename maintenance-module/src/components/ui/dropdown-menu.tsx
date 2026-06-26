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
        className={cn('dropdown-content z-50 min-w-[160px]', className)}
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
  icon?: React.ReactNode
}

export function DropdownMenuItem({ children, className, destructive, icon, ...props }: DropdownMenuItemProps) {
  return (
    <RadixDropdown.Item
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer outline-none transition-colors',
        destructive ? 'text-red-500' : '',
        className
      )}
      style={destructive ? undefined : { color: 'var(--text-2)' }}
      onMouseEnter={e => (e.currentTarget.style.background = destructive ? 'rgba(239,68,68,0.1)' : 'var(--surface-high)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      {...props}
    >
      {icon && <span style={{ color: destructive ? undefined : 'var(--text-4)' }}>{icon}</span>}
      {children}
    </RadixDropdown.Item>
  )
}
