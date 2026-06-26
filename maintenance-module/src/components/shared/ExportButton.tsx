'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportToCSV } from '@/lib/export'

interface ExportButtonProps {
  filename: string
  columns: string[]
  rows: Record<string, unknown>[]
  disabled?: boolean
}

export function ExportButton({ filename, columns, rows, disabled }: ExportButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={disabled || rows.length === 0}
      onClick={() => exportToCSV(filename, columns, rows)}
    >
      <Download size={13} />
      Export
    </Button>
  )
}
