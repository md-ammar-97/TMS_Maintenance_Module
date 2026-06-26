'use client'

import * as React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

interface DialogContentProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'w-[400px]',
  md: 'w-[520px]',
  lg: 'w-[680px]',
  xl: 'w-[820px]',
}

export function DialogContent({ children, title, description, className, onClose, size = 'md' }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="dialog-overlay" />
      <RadixDialog.Content
        className={cn(
          'modal-content max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl',
          sizeClasses[size],
          className
        )}
      >
        {(title || onClose !== undefined) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            {title && (
              <RadixDialog.Title className="text-[15px] font-semibold text-gray-900">
                {title}
              </RadixDialog.Title>
            )}
            {description && (
              <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>
            )}
            <RadixDialog.Close
              className="ml-auto w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              <X size={15} />
            </RadixDialog.Close>
          </div>
        )}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
