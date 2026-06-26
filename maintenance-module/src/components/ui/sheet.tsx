'use client'

import * as React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
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
      <RadixDialog.Overlay asChild>
        <motion.div
          className="fixed inset-0 bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </RadixDialog.Overlay>
      <RadixDialog.Content asChild>
        <motion.div
          className={cn('fixed right-0 top-0 h-full flex flex-col bg-surface-container-lowest border-l border-border shadow-2xl', width, className)}
          style={{ zIndex: 51 }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 border-b border-border">
            {title && (
              <RadixDialog.Title className="text-base font-semibold text-on-surface">
                {title}
              </RadixDialog.Title>
            )}
            <RadixDialog.Close
              className="ml-auto w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high transition-colors"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </motion.div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}
