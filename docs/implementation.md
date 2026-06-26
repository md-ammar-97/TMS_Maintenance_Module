# Implementation Plan — Maintenance Module Frontend Prototype

Vercel-deployable, frontend-only. Build order is strict: foundation first, then pages in dependency order.

---

## 1. PROJECT SCAFFOLD

```bash
npx create-next-app@latest maintenance-module \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd maintenance-module
```

### 1.1 Install Dependencies

```bash
# shadcn/ui setup
npx shadcn@latest init

# shadcn components needed
npx shadcn@latest add button input label select textarea switch dialog sheet dropdown-menu tabs table badge toast separator popover calendar

# Additional
npm install lucide-react
npm install date-fns
npm install @radix-ui/react-toggle-group
```

### 1.2 next.config.ts

```ts
const nextConfig = {
  // Standard Next.js build (Vercel handles this natively — no static export needed)
}
export default nextConfig
```

---

## 2. FOLDER STRUCTURE TO CREATE

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          ← redirect to /maintenance/plan
│   └── maintenance/
│       ├── layout.tsx                    ← sidebar + top bar wrapper
│       ├── plan/page.tsx
│       ├── logs/page.tsx
│       ├── types/page.tsx
│       ├── bills/page.tsx
│       ├── parts/page.tsx
│       ├── due-maintenance/page.tsx
│       └── inspection/
│           ├── page.tsx
│           └── new/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── shared/
│   │   ├── PageHeader.tsx
│   │   ├── DataTable.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── RowActionsMenu.tsx
│   │   ├── ColumnCustomizer.tsx
│   │   ├── DateRangePicker.tsx
│   │   ├── ExportButton.tsx
│   │   └── ConfirmDeleteDialog.tsx
│   ├── plan/
│   │   ├── PlanTable.tsx
│   │   ├── PlanModal.tsx
│   │   └── TruckDetailsModal.tsx
│   ├── logs/
│   │   ├── LogsTable.tsx
│   │   ├── LogModal.tsx
│   │   └── LogsAdvancedFilters.tsx
│   ├── types/
│   │   ├── TypesTable.tsx
│   │   └── TypeModal.tsx
│   ├── bills/
│   │   ├── BillsTable.tsx
│   │   ├── BillModal.tsx
│   │   └── BillLogItemRow.tsx
│   ├── parts/
│   │   ├── PartsTable.tsx
│   │   └── PartModal.tsx
│   ├── due-maintenance/
│   │   ├── DueMaintenanceTable.tsx
│   │   └── DueMaintenanceFilters.tsx
│   ├── inspection/
│   │   ├── InspectionSidebar.tsx
│   │   ├── InspectionDetail.tsx
│   │   └── InspectionItemGrid.tsx
│   └── vendor/
│       └── VendorModal.tsx
├── context/
│   └── AppContext.tsx
├── lib/
│   ├── seed.ts
│   ├── session.ts
│   ├── export.ts
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 3. BUILD ORDER

Build in this exact order. Each phase depends on the previous.

```
Phase 0 → Types + Seed Data
Phase 1 → Context + Session Layer
Phase 2 → Layout Shell (Sidebar + TopBar + Route wrapper)
Phase 3 → Shared Components
Phase 4 → Pages (dependency order below)
Phase 5 → Cross-page linkage verification
Phase 6 → Polish + Deploy
```

---

## 4. PHASE 0 — TYPES & SEED DATA

### 4.1 `src/types/index.ts`

Define all TypeScript interfaces from `data_model.md`. Paste them directly:

```ts
export type IntervalType = 'Days' | 'Months' | 'Mileage'
export type Currency = 'USD' | 'CAD'
export type PaymentStatus = 'Pending' | 'Paid'
export type PaymentMethod = 'EFS' | 'ComCheck' | 'ACH' | 'Cash' | 'Card'
export type MaintenanceLogType = 'Service' | 'Part'
export type TirePosition = 'LFI' | 'LFO' | 'RFI' | 'RFO' | 'LRI' | 'LRO' | 'RRI' | 'RRO' | 'RS' | 'LS'
export type UnitType = 'Vehicle' | 'Trailer'
export type DueStatus = 'OK' | 'Upcoming' | 'Overdue'
export type InspectionItemResult = 'NA' | 'OK' | 'Def'
export type VehicleStatus = 'Active' | 'Inactive' | 'InShop'

export interface MaintenanceType { id: string; name: string; description: string; createdAt: string }
export interface MaintenancePlan { id: string; name: string; maintenanceTypeId: string; description: string; intervalType: IntervalType; interval: number; validateUpcomingAtDispatch: boolean; validateDueAtDispatch: boolean; status: boolean; createdAt: string }
export interface Carrier { id: string; name: string }
export interface Vehicle { id: string; vehicleNumber: string; carrierId: string; terminal: string; currentMileage: number; status: VehicleStatus }
export interface Trailer { id: string; trailerNumber: string; carrierId: string; terminal: string; status: VehicleStatus }
export interface Vendor { id: string; name: string; vendorId?: string; address?: string; address2?: string; city?: string; state?: string; zipCode?: string; phone?: string; fax?: string; email?: string; status: boolean; accountingVendorId?: string; classId?: string; taxType?: string; box1099?: string; createdAt: string }
export interface Part { id: string; name: string; description: string; createdAt: string }
export interface MaintenanceLog { id: string; unitType: UnitType; vehicleId?: string; trailerId?: string; maintenanceTypeId: string; externalMaintenanceType?: string; maintenancePlanId?: string; tirePosition?: TirePosition; vendorId?: string; mileage?: number; serviceDate: string; currency: Currency; amount: number; gst?: number; hst?: number; qst?: number; description?: string; createdBy: string; billRefNumber?: string; billId?: string; createdAt: string }
export interface MaintenanceBillLogItem { id: string; logType: MaintenanceLogType; maintenanceTypeId?: string; partId?: string; maintenancePlanId?: string; amount: number; description?: string }
export interface MaintenanceBill { id: string; billRefNumber: string; unitType: UnitType; vehicleId?: string; trailerId?: string; vendorId: string; carrierId?: string; billDate: string; currency: Currency; totalAmount: number; paymentStatus: PaymentStatus; paymentMethod?: PaymentMethod; workCompletedDate?: string; mileage?: number; location?: string; description?: string; logItems: MaintenanceBillLogItem[]; linkedLogIds: string[]; createdAt: string }
export interface DueMaintenanceRecord { id: string; maintenancePlanId: string; unitType: UnitType; vehicleId?: string; trailerId?: string; lastServiceDate?: string; lastServiceMileage?: number; currentMileage?: number; dueDate?: string; dueMileage?: number; dueStatus: DueStatus; dueIn: string }
export interface InspectionItem { itemNumber: number; description: string; result: InspectionItemResult }
export interface Inspection { id: string; unitType: UnitType; vehicleId?: string; trailerId?: string; carrierId: string; mileage?: number; inspectionDate: string; inspectionBy: string; items: InspectionItem[]; createdAt: string }
```

### 4.2 `src/lib/seed.ts`

Create all seed data arrays exactly as specified in `data_model.md`. Key entries:

```ts
import type { MaintenanceType, MaintenancePlan, Carrier, Vehicle, Trailer, Vendor, Part, MaintenanceLog, MaintenanceBill, DueMaintenanceRecord, Inspection } from '@/types'

export const SEED_MAINTENANCE_TYPES: MaintenanceType[] = [
  { id: 'mt-1', name: 'Oil Change', description: 'Every 30,000–35,000 Miles', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-2', name: 'Truck Tires', description: 'Steers - Change Every 100,000 Miles', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-3', name: 'Engine Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-4', name: 'Trailer Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-5', name: 'Trailer Tires', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-6', name: 'Reefer Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mt-7', name: 'Truck Work', description: '', createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_PLANS: MaintenancePlan[] = [
  { id: 'mp-1', name: '30000 miles', maintenanceTypeId: 'mt-1', description: 'Oil change after every 30,000 miles', intervalType: 'Mileage', interval: 30000, validateUpcomingAtDispatch: false, validateDueAtDispatch: false, status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mp-2', name: 'Regular Maintenance', maintenanceTypeId: 'mt-7', description: 'Quarterly truck maintenance check', intervalType: 'Months', interval: 3, validateUpcomingAtDispatch: false, validateDueAtDispatch: false, status: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'mp-3', name: 'BIT INSPECTION', maintenanceTypeId: 'mt-3', description: 'Annual inspection compliance plan', intervalType: 'Months', interval: 12, validateUpcomingAtDispatch: true, validateDueAtDispatch: true, status: true, createdAt: '2026-01-01T00:00:00Z' },
]

export const SEED_CARRIERS: Carrier[] = [
  { id: 'c-1', name: 'YOLO TRANSPORT LLC' },
  { id: 'c-2', name: 'YOUNGS FREIGHTWAYS INC' },
  { id: 'c-3', name: '2G Express LLC' },
  { id: 'c-4', name: '2H Brothers Trucking Service Inc' },
  { id: 'c-5', name: '3 Tigers Transport Inc' },
  { id: 'c-6', name: '3D Carrier Inc' },
  { id: 'c-7', name: '4B States Carrier Inc' },
  { id: 'c-8', name: 'A & E Luna Tracking LLC' },
  { id: 'c-9', name: 'A & S Trucking' },
  { id: 'c-10', name: 'A&J TRUCKLINE INC' },
  { id: 'c-11', name: 'A&R Garcia Trucking, LLC.' },
  { id: 'c-12', name: 'AGAM HAULER INC' },
  { id: 'c-13', name: 'AGS Transport Inc' },
  { id: 'c-14', name: 'AIM TRANSPORT INC' },
  { id: 'c-15', name: 'AIRBOURNE LOGISTICS INC' },
  { id: 'c-16', name: 'YAJAT INC' },
  { id: 'c-17', name: 'Western Enterprises' },
  { id: 'c-18', name: 'Worldwide Express' },
  { id: 'c-19', name: 'ZEEZ TRANSPORTATION' },
  { id: 'c-20', name: 'Zee Trucking Inc' },
  { id: 'c-21', name: 'Zero 1 Transport Inc' },
]

// Vehicles, Trailers, Vendors, Parts, Logs, Bills, DueMaintenance, Inspections
// — see data_model.md for full seed values
```

Also export the inspection item constant arrays (`VEHICLE_INSPECTION_ITEMS`, `TRAILER_INSPECTION_ITEMS`) directly from this file.

### 4.3 `src/lib/session.ts`

```ts
export function getSessionData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setSessionData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(key, JSON.stringify(data))
}

export function isSeeded(): boolean {
  return sessionStorage.getItem('__seeded') === 'true'
}

export function markSeeded(): void {
  sessionStorage.setItem('__seeded', 'true')
}
```

### 4.4 `src/lib/export.ts`

```ts
export function exportToCSV(filename: string, columns: string[], rows: Record<string, unknown>[]): void {
  const header = columns.join(',')
  const body = rows.map(r =>
    columns.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

### 4.5 `src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function generateId(): string {
  return crypto.randomUUID()
}
```

---

## 5. PHASE 1 — CONTEXT

### `src/context/AppContext.tsx`

```tsx
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSessionData, setSessionData, isSeeded, markSeeded } from '@/lib/session'
import { SEED_MAINTENANCE_TYPES, SEED_PLANS, SEED_CARRIERS, SEED_VEHICLES, SEED_TRAILERS, SEED_VENDORS, SEED_PARTS, SEED_LOGS, SEED_BILLS, SEED_DUE_MAINTENANCE, SEED_INSPECTIONS } from '@/lib/seed'
import type { MaintenanceType, MaintenancePlan, Carrier, Vehicle, Trailer, Vendor, Part, MaintenanceLog, MaintenanceBill, DueMaintenanceRecord, Inspection } from '@/types'
import { generateId } from '@/lib/utils'

// Full interface and Provider implementation here.
// Pattern for each entity:
//   const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([])
//   function addMaintenanceType(item: Omit<MaintenanceType, 'id' | 'createdAt'>) { ... }
//   function updateMaintenanceType(id: string, updates: Partial<MaintenanceType>) { ... }
//   function deleteMaintenanceType(id: string) { ... }
// Each setter also calls setSessionData(KEY, newValue)

// useEffect on mount: if isSeeded() → load from storage; else → seed all and markSeeded()
```

**Context keys map:**

| Entity | sessionStorage key |
|--------|--------------------|
| MaintenanceTypes | `maintenanceTypes` |
| MaintenancePlans | `maintenancePlans` |
| Carriers | `carriers` |
| Vehicles | `vehicles` |
| Trailers | `trailers` |
| Vendors | `vendors` |
| Parts | `parts` |
| MaintenanceLogs | `maintenanceLogs` |
| MaintenanceBills | `maintenanceBills` |
| DueMaintenance | `dueMaintenance` |
| Inspections | `inspections` |

---

## 6. PHASE 2 — LAYOUT SHELL

### `src/app/layout.tsx`
Root layout: imports global CSS, sets `<html lang="en">`, wraps in `<AppProvider>`.

### `src/app/maintenance/layout.tsx`
```tsx
export default function MaintenanceLayout({ children }) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### `src/components/layout/Sidebar.tsx`

Nav items array:
```ts
const NAV_ITEMS = [
  { label: 'Plan', href: '/maintenance/plan', icon: ClipboardList },
  { label: 'Logs', href: '/maintenance/logs', icon: FileText },
  { label: 'Maintenance Types', href: '/maintenance/types', icon: Wrench },
  { label: 'Maintenance Bills', href: '/maintenance/bills', icon: Receipt },
  { label: 'Parts', href: '/maintenance/parts', icon: Package },
  { label: 'Due Maintenance', href: '/maintenance/due-maintenance', icon: AlertCircle },
  { label: 'Inspection', href: '/maintenance/inspection', icon: ClipboardCheck },
]
```

Style per design.md:
- Width `w-60`, border-right `border-r border-gray-200`
- Section header: `text-[11px] font-semibold text-gray-400 uppercase tracking-wider`
- Active item: `border-l-2 border-blue-600 bg-blue-50 text-blue-600`
- Use `usePathname()` from `next/navigation` to detect active route

### `src/components/layout/TopBar.tsx`
- Height `h-[52px]`, white, border-bottom
- Left: AXESTRACK text logo + tagline
- Right: search icon, sun icon, user avatar ("D"), "demo" + "Member", chevron

---

## 7. PHASE 3 — SHARED COMPONENTS

Build these before any page — every page uses them.

### `PageHeader.tsx`
Props: `title: string`, `icon: LucideIcon`, `actions?: ReactNode`
- Renders the light-blue strip with icon badge + title + right-side actions

### `StatusBadge.tsx`
Props: `status: string`
- Maps status strings to color classes from design.md
- Returns a `<span>` pill

### `DataTable.tsx`
Lightweight wrapper. Props:
- `columns: { key: string; label: string; render?: (row) => ReactNode }[]`
- `data: T[]`
- `rowsPerPage?: number` (default 10)
- `onRowAction?: (action: string, row: T) => void`
- `visibleColumns?: string[]`
- `emptyMessage?: string`

Internally handles:
- Pagination (page state, rows-per-page dropdown)
- Column visibility filtering
- Empty state render

### `RowActionsMenu.tsx`
Props: `actions: { label: string; icon?: LucideIcon; onClick: () => void; destructive?: boolean }[]`
- Renders `MoreHorizontal` button + `DropdownMenu`

### `ColumnCustomizer.tsx`
Props: `columns: string[]`, `visible: string[]`, `onChange: (visible: string[]) => void`
- Popover with checkbox list

### `DateRangePicker.tsx`
Props: `value: { from?: Date; to?: Date }`, `onChange`
- Uses shadcn `Popover` + `Calendar`
- Preset buttons: Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range

### `ExportButton.tsx`
Props: `filename: string`, `columns: string[]`, `getData: () => Record<string, unknown>[]`
- Calls `exportToCSV` from `lib/export.ts` on click

---

## 8. PHASE 4 — PAGES (BUILD ORDER)

Build pages in this order because later pages depend on earlier ones for dropdown data.

### Page 1: Maintenance Types (`/maintenance/types`)

**Why first**: Every other page's modals need type dropdowns.

Components:
1. `TypesTable` — columns: Actions, Name (with avatar), Description
2. `TypeModal` — create/edit, 2 fields

Key logic:
- `getInitials(name)` for the avatar badge
- Avatar bg color from `utils.ts` color rotation
- Delete: call `deleteMaintenanceType(id)` from context

---

### Page 2: Plan (`/maintenance/plan`)

Components:
1. `PlanTable` — 8 columns, seed 3 rows
2. `PlanModal` — 8 fields, maintenance type dropdown from context
3. `TruckDetailsModal` — hardcoded vehicle rows, rows-per-page control

Filter bar: 5 filters (general search, name, type dropdown, interval type, status) + clear button

---

### Page 3: Parts (`/maintenance/parts`)

Components:
1. `PartsTable` — 2 columns (Name, Description), seed 5 rows
2. `PartModal` — 2 fields

Filter bar: Search + Name + Description inputs

---

### Page 4: Logs (`/maintenance/logs`)

**Depends on**: Types, Plans, Carriers, Vehicles, Trailers, Vendors

Components:
1. `LogsTable` — 16 columns, Vehicle/Trailer tabs, column customizer
2. `LogModal` — Vehicle/Trailer toggle, 12+ fields, nested create plan + vendor modals
3. `LogsAdvancedFilters` — right-side drawer, 7 fields
4. `VendorModal` — shared, also used in Bills

Key logic:
- Total Amount header display: `formatCurrency(logs.filter(l => l.unitType === activeTab).reduce((sum, l) => sum + l.amount, 0))`
- PullRay button → toast placeholder

---

### Page 5: Maintenance Bills (`/maintenance/bills`)

**Depends on**: Types, Plans, Vehicles, Trailers, Carriers, Vendors, Parts, Logs

Components:
1. `BillsTable` — 10 columns, Vehicle/Trailer tabs
2. `BillModal` — complex: bill header fields + dynamic log items section
3. `BillLogItemRow` — single dynamic log item block within the bill modal

Key logic (most complex page):
```ts
// On bill save:
function handleSaveBill(formData) {
  const newBill = { ...formData, id: generateId(), totalAmount: sum(logItems), linkedLogIds: [] }
  const linkedLogIds: string[] = []
  
  // Auto-create a MaintenanceLog for each log item
  formData.logItems.forEach(item => {
    const newLog: MaintenanceLog = {
      id: generateId(),
      unitType: formData.unitType,
      vehicleId: formData.vehicleId,
      trailerId: formData.trailerId,
      maintenanceTypeId: item.maintenanceTypeId ?? '',
      maintenancePlanId: item.maintenancePlanId,
      amount: item.amount,
      description: item.description,
      serviceDate: formData.billDate,
      currency: formData.currency,
      createdBy: 'demo',
      billRefNumber: formData.billRefNumber,
      billId: newBill.id,
      createdAt: new Date().toISOString(),
    }
    addLog(newLog)
    linkedLogIds.push(newLog.id)
  })
  
  addBill({ ...newBill, linkedLogIds })
}
```

---

### Page 6: Due Maintenance (`/maintenance/due-maintenance`)

**Depends on**: Types, Plans, Vehicles, Trailers, Carriers, Logs

Components:
1. `DueMaintenanceTable` — 8 columns, color-coded "Due In" chips
2. `DueMaintenanceFilters` — advanced filters drawer
3. Reuses `LogModal` with prefill props

Key logic:
```ts
// After creating log from Due Maintenance:
function handleLogCreatedFromDue(dueRecord: DueMaintenanceRecord, newLog: MaintenanceLog) {
  addLog(newLog)
  updateDueMaintenance(dueRecord.id, {
    lastServiceDate: newLog.serviceDate,
    lastServiceMileage: newLog.mileage,
    dueStatus: 'OK',
    dueIn: '+8,000 mi', // recalculate or set a mock non-overdue value
  })
}
```

---

### Page 7: Inspection (`/maintenance/inspection`)

**Depends on**: Carriers, Vehicles, Trailers

Components:
1. `InspectionSidebar` — left panel, unit list with clickable rows
2. `InspectionDetail` — right panel, shows inspection records for selected unit
3. `InspectionItemGrid` — 3-column grid, NA/OK/Def controls (used on new inspection page)

New inspection is a **full page** at `/maintenance/inspection/new`:
- Back to list button → `router.push('/maintenance/inspection')`
- Pass selected unit via URL query: `/maintenance/inspection/new?type=vehicle&unitId=v-1`
- On save: `addInspection(newInspection)`, then `router.push('/maintenance/inspection?unit=v-1&type=vehicle')`

---

## 9. PHASE 5 — CROSS-PAGE LINKAGE VERIFICATION

After building all pages, manually test these flows:

| Test | Expected |
|------|----------|
| Create Maintenance Type "Brake Service" on Types page | Appears in Plan modal dropdown, Logs modal dropdown, Bills modal dropdown |
| Create Plan "Yearly Inspection" on Plan page | Appears in Logs modal plan dropdown, Bills modal plan dropdown, Due Maintenance filter |
| Create Vendor "NewVendor Co" from Logs modal | Appears in Bills modal vendor dropdown |
| Create Part "Drive Belt" on Parts page | Appears in Bills modal when Log Type = Part |
| Create Log from Due Maintenance row | Log appears in Logs table, Due Maintenance row updates status |
| Save Bill with 2 log items | 2 new log rows appear in Logs table with bill ref number |
| Delete Maintenance Type | Deleted type no longer shows in dropdowns |

---

## 10. PHASE 6 — POLISH

### 10.1 Toast Notifications

Use shadcn `Sonner` or `useToast`:

```tsx
// After save:
toast.success('Maintenance plan created successfully')

// After delete:
toast.success('Maintenance type deleted')

// PullRay button:
toast.info('PullRay Integration Logs are not available in this prototype.')
```

### 10.2 Confirm Delete Dialog

Before deleting any record:
```
Are you sure?
This will remove "[record name]" from the list. This action cannot be undone.
[Cancel]  [Delete]  ← red
```

### 10.3 Empty States

Each table's empty state (when filters return 0 results):
```
🔍
No records found
Try adjusting your filters.
[Clear Filters]
```

### 10.4 Loading State

Since all data is synchronous from sessionStorage, no loading spinners are needed. The context hydrates instantly.

---

## 11. DEPLOYMENT TO VERCEL

### 11.1 Push to GitHub

```bash
git init
git add .
git commit -m "feat: maintenance module prototype"
git remote add origin https://github.com/your-user/maintenance-module.git
git push -u origin main
```

### 11.2 Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import the GitHub repo
3. Framework Preset: **Next.js** (auto-detected)
4. No environment variables needed
5. Click **Deploy**

### 11.3 Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts: select project, confirm settings
# Production deploy:
vercel --prod
```

### 11.4 Verify Deployment

After deploy, open the Vercel URL and confirm:
- [ ] All 7 nav links work
- [ ] Seed data loads on first visit
- [ ] Creating a record persists across page navigation
- [ ] Refresh preserves session data
- [ ] New tab starts fresh with seed data
- [ ] Export buttons download CSV files
- [ ] Modals, drawers, dropdowns all open/close
- [ ] No console errors

---

## 12. KEY IMPLEMENTATION DECISIONS

| Decision | Rationale |
|----------|-----------|
| shadcn/ui | Zero config, accessible, matches the AxesTrack design aesthetic, no hidden styling conflicts |
| Single AppContext (not Zustand/Jotai) | Prototype-scale; no need for external state lib. Context + sessionStorage is sufficient |
| Right-side drawer modals | Matches AxesTrack screenshots exactly |
| `sessionStorage` not `localStorage` | Data resets on tab close as specified; no stale demo data between reviewer sessions |
| No React Query / SWR | No API calls; all data is synchronous from sessionStorage |
| `date-fns` for date math | Lightweight, tree-shakeable, used for "due in" calculations |
| CSV-only export | No xlsx dependency needed; reduces bundle size; meets acceptance criteria |
| Full-page inspection form | Required by spec; avoids modal scroll issues with 40 checklist items |
| `crypto.randomUUID()` | Built-in browser API; no UUID library dependency |

---

## 13. ESTIMATED BUILD TIME

| Phase | Effort |
|-------|--------|
| Phase 0: Types + Seed | ~1h |
| Phase 1: Context | ~1.5h |
| Phase 2: Layout | ~1h |
| Phase 3: Shared components | ~2h |
| Phase 4: 7 pages | ~10h (2h Bills, 1.5h Inspection, ~1h others) |
| Phase 5: Linkage QA | ~1h |
| Phase 6: Polish + Deploy | ~1h |
| **Total** | **~18h** |
