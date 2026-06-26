'use client'

import * as React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = RadixDialog.Root
export const SheetTrigger = RadixDialog.Trigger
export const SheetClose = RadixDialog.Close

interface SheetContentProps {
  children: React.ReactNode
  title?: string
  className?: string
  onClose?: () => void
  width?: string
}

export function SheetContent({ children, title, className, onClose, width = 'w-[520px]' }: SheetContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="dialog-overlay" />
      <RadixDialog.Content className={cn('sheet-content flex flex-col', width, className)}>
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          {title && (
            <RadixDialog.Title className="text-[15px] font-semibold" style={{ color: 'var(--text-1)' }}>
              {title}
            </RadixDialog.Title>
          )}
          <RadixDialog.Close
            className="ml-auto w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: 'var(--text-4)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-high)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            onClick={onClose}
          >
            <X size={15} />
          </RadixDialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
