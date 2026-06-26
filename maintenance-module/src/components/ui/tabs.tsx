'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root
export const TabsContent = RadixTabs.Content

export function TabsList({ children, className, pill }: { children: React.ReactNode; className?: string; pill?: boolean }) {
  return (
    <RadixTabs.List
      className={cn(
        pill
          ? 'flex gap-1 p-1 bg-surface-container rounded-lg'
          : 'flex border-b border-border',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  )
}

export function TabsTrigger({ value, children, className, pill }: { value: string; children: React.ReactNode; className?: string; pill?: boolean }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'text-sm font-medium transition-colors cursor-pointer',
        pill
          ? 'px-6 py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface data-[state=active]:bg-surface-container-highest data-[state=active]:text-on-surface data-[state=active]:border data-[state=active]:border-border data-[state=active]:shadow-sm'
          : 'px-4 py-2.5 border-b-2 border-transparent -mb-px text-on-surface-variant data-[state=active]:border-primary-container data-[state=active]:text-primary-container',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}
