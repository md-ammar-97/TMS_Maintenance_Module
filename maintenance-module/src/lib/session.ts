export function getSessionData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : fallback
  } catch {
    return fallback
  }
}

export function setSessionData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch {
    // quota exceeded — ignore for prototype
  }
}

export function isSeeded(): boolean {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('__seeded') === 'true'
}

export function markSeeded(): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('__seeded', 'true')
}
