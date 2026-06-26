'use client'

import * as React from 'react'
import * as RadixDialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
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
  open?: boolean
}

const sizeClasses = { sm: 'w-[400px]', md: 'w-[520px]', lg: 'w-[680px]', xl: 'w-[820px]' }

export function DialogContent({ children, title, description, className, onClose, size = 'md', open }: DialogContentProps) {
  return (
    <RadixDialog.Portal forceMount>
      <AnimatePresence>
        {open !== false && (
          <>
            <RadixDialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed left-1/2 top-1/2 z-51 bg-surface-container-lowest border border-border rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto',
                  sizeClasses[size],
                  className
                )}
                style={{ zIndex: 51 }}
                initial={{ opacity: 0, scale: 0.97, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                exit={{ opacity: 0, scale: 0.97, x: '-50%', y: '-50%' }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {(title || onClose !== undefined) && (
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    {title && (
                      <RadixDialog.Title className="text-base font-semibold text-on-surface">
                        {title}
                      </RadixDialog.Title>
                    )}
                    {description && <RadixDialog.Description className="sr-only">{description}</RadixDialog.Description>}
                    <RadixDialog.Close
                      className="ml-auto w-7 h-7 flex items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high transition-colors"
                      onClick={onClose}
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </RadixDialog.Close>
                  </div>
                )}
                {children}
              </motion.div>
            </RadixDialog.Content>
          </>
        )}
      </AnimatePresence>
    </RadixDialog.Portal>
  )
}
