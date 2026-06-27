import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Inspection, InspectionItemResult } from '@/types'

interface InspectionPdfData {
  inspection: Inspection
  unitNumber: string
  carrierName: string
}

const RESULT_COLORS: Record<InspectionItemResult, [number, number, number]> = {
  OK: [22, 163, 74],
  NA: [100, 116, 139],
  Def: [220, 38, 38],
}

function formatReportDate(value: string): string {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function safeFilename(value: string): string {
  return value.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()
}

export function downloadInspectionPdf({ inspection, unitNumber, carrierName }: InspectionPdfData): void {
  const document = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = document.internal.pageSize.getWidth()
  const pageHeight = document.internal.pageSize.getHeight()
  const margin = 42
  const okCount = inspection.items.filter(item => item.result === 'OK').length
  const naCount = inspection.items.filter(item => item.result === 'NA').length
  const defectCount = inspection.items.filter(item => item.result === 'Def').length
  const overallStatus = defectCount === 0 ? 'PASSED' : 'REQUIRES ATTENTION'

  document.setFillColor(22, 31, 43)
  document.rect(0, 0, pageWidth, 86, 'F')
  document.setTextColor(255, 255, 255)
  document.setFont('helvetica', 'bold')
  document.setFontSize(18)
  document.text('FreightNXT', margin, 34)
  document.setFontSize(8)
  document.setFont('helvetica', 'normal')
  document.text('BY AXESTRACK', margin, 49)
  document.setFontSize(15)
  document.setFont('helvetica', 'bold')
  document.text(`${inspection.unitType.toUpperCase()} INSPECTION REPORT`, margin, 72)

  const statusColor: [number, number, number] = defectCount === 0 ? [22, 163, 74] : [220, 38, 38]
  document.setFillColor(...statusColor)
  document.roundedRect(pageWidth - 174, 31, 132, 30, 4, 4, 'F')
  document.setFontSize(9)
  document.text(overallStatus, pageWidth - 108, 50, { align: 'center' })

  autoTable(document, {
    startY: 105,
    margin: { left: margin, right: margin },
    theme: 'plain',
    body: [
      ['Inspection ID', inspection.id, 'Inspection Date', formatReportDate(inspection.inspectionDate)],
      ['Unit Type', inspection.unitType, 'Unit Number', unitNumber],
      ['Carrier', carrierName, 'Inspected By', inspection.inspectionBy],
      ['Mileage', inspection.mileage == null ? 'Not recorded' : inspection.mileage.toLocaleString(), 'Total Items', String(inspection.items.length)],
    ],
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 5, textColor: [31, 41, 55] },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 82 },
      1: { cellWidth: 150 },
      2: { fontStyle: 'bold', textColor: [71, 85, 105], cellWidth: 82 },
      3: { cellWidth: 160 },
    },
  })

  const detailsBottom = (document as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
  const summaryY = detailsBottom + 18
  const summaryWidth = (pageWidth - (margin * 2) - 16) / 3
  const summaries: Array<{ label: string; value: number; color: [number, number, number] }> = [
    { label: 'OK', value: okCount, color: RESULT_COLORS.OK },
    { label: 'N/A', value: naCount, color: RESULT_COLORS.NA },
    { label: 'DEFECTS', value: defectCount, color: RESULT_COLORS.Def },
  ]

  summaries.forEach((summary, index) => {
    const x = margin + index * (summaryWidth + 8)
    document.setDrawColor(...summary.color)
    document.setFillColor(248, 250, 252)
    document.roundedRect(x, summaryY, summaryWidth, 48, 4, 4, 'FD')
    document.setTextColor(...summary.color)
    document.setFont('helvetica', 'bold')
    document.setFontSize(16)
    document.text(String(summary.value), x + summaryWidth / 2, summaryY + 21, { align: 'center' })
    document.setFontSize(8)
    document.text(summary.label, x + summaryWidth / 2, summaryY + 37, { align: 'center' })
  })

  document.setTextColor(31, 41, 55)
  document.setFont('helvetica', 'bold')
  document.setFontSize(11)
  document.text('Inspection Checklist', margin, summaryY + 75)

  autoTable(document, {
    startY: summaryY + 84,
    margin: { left: margin, right: margin, bottom: 42 },
    head: [['#', 'Inspection Item', 'Selection']],
    body: inspection.items.map(item => [String(item.itemNumber), item.description, item.result]),
    theme: 'grid',
    headStyles: {
      fillColor: [22, 31, 43],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 6,
    },
    bodyStyles: { font: 'helvetica', fontSize: 8, textColor: [31, 41, 55], cellPadding: 5 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 64, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: data => {
      if (data.section === 'body' && data.column.index === 2) {
        const result = String(data.cell.raw) as InspectionItemResult
        data.cell.styles.textColor = RESULT_COLORS[result]
      }
    },
  })

  const pageCount = document.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    document.setPage(page)
    document.setDrawColor(226, 232, 240)
    document.line(margin, pageHeight - 28, pageWidth - margin, pageHeight - 28)
    document.setTextColor(100, 116, 139)
    document.setFont('helvetica', 'normal')
    document.setFontSize(7)
    document.text(`Inspection ${inspection.id} - ${unitNumber}`, margin, pageHeight - 16)
    document.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 16, { align: 'right' })
  }

  const filename = `inspection-${safeFilename(unitNumber)}-${inspection.inspectionDate}.pdf`
  document.save(filename)
}
