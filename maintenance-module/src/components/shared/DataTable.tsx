'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  width?: string
  className?: string
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowId: (row: T) => string
  emptyMessage?: string
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
}

export function DataTable<T>({
  columns, data, getRowId, emptyMessage = 'No records found.',
  onRowClick, selectable, selectedIds = [], onSelectionChange,
}: DataTableProps<T>) {
  const allSelected = data.length > 0 && data.every(r => selectedIds.includes(getRowId(r)))

  function toggleAll() {
    if (!onSelectionChange) return
    onSelectionChange(allSelected ? [] : data.map(getRowId))
  }
  function toggleRow(id: string) {
    if (!onSelectionChange) return
    onSelectionChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id])
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full min-w-max text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-border">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant font-mono', col.width, col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center text-sm text-outline"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const id = getRowId(row)
              const isSelected = selectedIds.includes(id)
              return (
                <motion.tr
                  key={id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'group transition-colors',
                    onRowClick && 'cursor-pointer',
                    isSelected ? 'bg-primary-container/10' : 'hover:bg-surface-container-lowest/50'
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-4 py-3" onClick={e => { e.stopPropagation(); toggleRow(id) }}>
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleRow(id)} />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-4 py-3', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </motion.tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
