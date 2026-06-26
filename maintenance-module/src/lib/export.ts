export function exportToCSV(
  filename: string,
  columns: string[],
  rows: Record<string, unknown>[]
): void {
  const header = columns.join(',')
  const body = rows
    .map((r) =>
      columns
        .map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')
  const blob = new Blob([`${header}\n${body}`], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
