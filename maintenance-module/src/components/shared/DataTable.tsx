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
          <tr style={{ background: 'var(--surface-dim)', borderBottom: '1px solid var(--border)' }}>
            {selectable && (
              <th className="w-10 px-4 py-2.5">
                <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={cn('px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide', col.width, col.className)}
                style={{ color: 'var(--text-3)' }}
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
                className="px-4 py-12 text-center text-[13px]"
                style={{ color: 'var(--text-4)' }}
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
                  className={cn('group h-12 transition-colors', onRowClick && 'cursor-pointer')}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(0,112,243,0.08)' : undefined,
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--surface-high)' }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
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
