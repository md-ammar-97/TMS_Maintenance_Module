'use client'

import * as React from 'react'
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
  const someSelected = !allSelected && data.some(r => selectedIds.includes(getRowId(r)))

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
      <table className="w-full min-w-max text-[13px]">
        <thead className="sticky top-0 z-10">
          <tr className="bg-gray-50 border-b border-gray-200">
            {selectable && (
              <th className="w-10 px-4 py-2.5">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={toggleAll}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide',
                  col.width,
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center text-[13px] text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map(row => {
              const id = getRowId(row)
              const isSelected = selectedIds.includes(id)
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'group border-b border-gray-100 h-12 transition-colors',
                    isSelected && 'bg-blue-50',
                    onRowClick && !isSelected && 'hover:bg-gray-50 cursor-pointer',
                    !onRowClick && !isSelected && 'hover:bg-gray-50',
                  )}
                >
                  {selectable && (
                    <td className="w-10 px-4" onClick={e => { e.stopPropagation(); toggleRow(id) }}>
                      <Checkbox checked={isSelected} onCheckedChange={() => toggleRow(id)} />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-4 py-0', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
