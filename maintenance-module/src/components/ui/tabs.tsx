'use client'

import * as RadixTabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = RadixTabs.Root
export const TabsContent = RadixTabs.Content

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <RadixTabs.List className={cn('flex border-b border-gray-200', className)}>
      {children}
    </RadixTabs.List>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        'px-4 py-2.5 text-[13px] font-medium border-b-2 border-transparent -mb-px transition-colors cursor-pointer',
        'text-gray-500 hover:text-gray-700',
        'data-[state=active]:border-blue-600 data-[state=active]:text-blue-600',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  )
}
