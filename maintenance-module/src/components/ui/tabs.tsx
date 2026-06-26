'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root
export const TabsContent = RadixTabs.Content

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.List
      className={cn('flex border-b', className)}
      style={{ borderColor: 'var(--border)' }}
    >
      {children}
    </RadixTabs.List>
  )
}

export function TabsTrigger({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'px-4 py-2.5 text-[13px] font-medium border-b-2 border-transparent -mb-px transition-colors cursor-pointer',
        'data-[state=active]:border-[var(--primary)] data-[state=active]:text-[var(--primary)]',
        className
      )}
      style={{ color: 'var(--text-3)' }}
    >
      {children}
    </RadixTabs.Trigger>
  )
}
