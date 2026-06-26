'use client'

import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface RowActionsMenuProps {
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  editLabel?: string
  deleteLabel?: string
  viewLabel?: string
  extraItems?: { label: string; onClick: () => void; destructive?: boolean }[]
}

export function RowActionsMenu({
  onEdit, onDelete, onView,
  editLabel = 'Edit', deleteLabel = 'Delete', viewLabel = 'View',
  extraItems,
}: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 w-7 h-7">
          <MoreHorizontal size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView} icon={<Eye size={13} />}>{viewLabel}</DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} icon={<Pencil size={13} />}>{editLabel}</DropdownMenuItem>
        )}
        {extraItems?.map((item, i) => (
          <DropdownMenuItem key={i} onClick={item.onClick} destructive={item.destructive}>
            {item.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <>
            {(onView || onEdit || extraItems?.length) && <DropdownMenuSeparator className="my-1 border-gray-100" />}
            <DropdownMenuItem onClick={onDelete} icon={<Trash2 size={13} />} destructive>
              {deleteLabel}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
