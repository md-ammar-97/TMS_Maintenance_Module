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
      <RadixDialog.Content
        className={cn('sheet-content bg-white shadow-xl flex flex-col', width, className)}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          {title && (
            <RadixDialog.Title className="text-[15px] font-semibold text-gray-900">
              {title}
            </RadixDialog.Title>
          )}
          <RadixDialog.Close
            className="ml-auto w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X size={15} />
          </RadixDialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
