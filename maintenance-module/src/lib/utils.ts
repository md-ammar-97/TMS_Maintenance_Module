import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function getAvatarColor(name: string): string {
  const first = name.trim()[0]?.toUpperCase() ?? 'A'
  const colors: Record<string, string> = {
    O: 'bg-blue-500', A: 'bg-blue-500', B: 'bg-blue-500',
    T: 'bg-emerald-500', C: 'bg-emerald-500', D: 'bg-emerald-500',
    E: 'bg-violet-500', F: 'bg-violet-500', G: 'bg-violet-500',
    R: 'bg-amber-500', H: 'bg-amber-500', I: 'bg-amber-500',
  }
  return colors[first] ?? 'bg-gray-500'
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}
