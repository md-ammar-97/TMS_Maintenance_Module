# Architecture — Maintenance Module Frontend Prototype

---

## 1. OVERVIEW

This is a **frontend-only prototype** of a Maintenance Module for an existing Transportation Management System (TMS). There is no backend, no database, and no authentication. The entire application runs in the browser and is deployable to Vercel as a static/SSG site.

---

## 2. TECH STACK

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 (App Router) | Vercel-native, file-based routing, no server required for static export |
| Language | TypeScript | Type safety across shared data models |
| Styling | Tailwind CSS | Utility-first, fast to build enterprise UI |
| UI Components | shadcn/ui | Accessible, unstyled-by-default components (dialogs, drawers, dropdowns, tables, tabs, toasts) |
| Icons | Lucide React | Consistent icon set used by shadcn |
| State Management | React Context + `sessionStorage` | Shared cross-page state; resets on tab close |
| Date Picker | react-day-picker (via shadcn) | Lightweight, no external dependency on heavy libs |
| CSV Export | Native browser (Blob + anchor) | No server needed; acceptable for prototype |
| Deployment | Vercel (static export) | Zero config for Next.js; free tier sufficient |

---

## 3. FOLDER STRUCTURE

```
maintenance-module/
├── app/
│   ├── layout.tsx                  # Root layout with sidebar navigation
│   ├── page.tsx                    # Redirect → /maintenance/plan
│   └── maintenance/
│       ├── plan/
│       │   └── page.tsx
│       ├── logs/
│       │   └── page.tsx
│       ├── types/
│       │   └── page.tsx
│       ├── bills/
│       │   └── page.tsx
│       ├── parts/
│       │   └── page.tsx
│       ├── due-maintenance/
│       │   └── page.tsx
│       └── inspection/
│           ├── page.tsx
│           └── new/
│               └── page.tsx        # Full-page create inspection view
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Left nav with all 7 links
│   │   └── PageHeader.tsx          # Reusable page title + action buttons
│   │
│   ├── shared/
│   │   ├── DataTable.tsx           # Generic table: cols, rows, pagination, row actions
│   │   ├── FilterBar.tsx           # Generic horizontal filter strip
│   │   ├── AdvancedFilterDrawer.tsx
│   │   ├── ColumnCustomizer.tsx    # Popover/drawer with column checkboxes
│   │   ├── DateRangePicker.tsx     # With presets (Today, Last 7 Days, etc.)
│   │   ├── ConfirmDialog.tsx       # "Are you sure?" modal for deletes
│   │   └── ExportButton.tsx        # CSV export from table data
│   │
│   ├── plan/
│   │   ├── PlanTable.tsx
│   │   ├── PlanModal.tsx           # Create / Edit maintenance plan
│   │   └── TruckDetailsModal.tsx   # Truck Maintenance Details popup
│   │
│   ├── logs/
│   │   ├── LogsTable.tsx
│   │   ├── LogModal.tsx            # Create / Edit maintenance log
│   │   └── LogsAdvancedFilters.tsx
│   │
│   ├── types/
│   │   ├── MaintenanceTypesTable.tsx
│   │   └── MaintenanceTypeModal.tsx
│   │
│   ├── bills/
│   │   ├── BillsTable.tsx
│   │   ├── BillModal.tsx           # Create / Edit bill + dynamic log items
│   │   └── BillsAdvancedFilters.tsx
│   │
│   ├── parts/
│   │   ├── PartsTable.tsx
│   │   └── PartModal.tsx
│   │
│   ├── due-maintenance/
│   │   ├── DueMaintenanceTable.tsx
│   │   └── DueMaintenanceFilters.tsx
│   │
│   ├── inspection/
│   │   ├── InspectionSidebar.tsx   # Left unit-selection panel
│   │   ├── InspectionDetail.tsx    # Right panel with records table
│   │   ├── InspectionRecordsTable.tsx
│   │   └── InspectionForm.tsx      # Full-page create inspection
│   │
│   └── vendor/
│       └── VendorModal.tsx         # Shared across Logs and Bills
│
├── context/
│   └── AppContext.tsx              # Single React Context with all shared state
│
├── lib/
│   ├── seed.ts                     # All hardcoded initial data
│   ├── session.ts                  # sessionStorage read/write helpers
│   ├── export.ts                   # CSV generation utility
│   └── utils.ts                   # cn(), formatCurrency(), formatDate(), etc.
│
├── types/
│   └── index.ts                    # All TypeScript interfaces (see data_model.md)
│
└── public/
```

---

## 4. STATE MANAGEMENT

### 4.1 Single Context Pattern

All shared data lives in one `AppContext`. Every page and modal reads from and writes to this context. No prop-drilling beyond one level.

```tsx
// context/AppContext.tsx (simplified)
interface AppState {
  maintenanceTypes: MaintenanceType[]
  maintenancePlans: MaintenancePlan[]
  vendors: Vendor[]
  vehicles: Vehicle[]
  trailers: Trailer[]
  carriers: Carrier[]
  parts: Part[]
  maintenanceLogs: MaintenanceLog[]
  maintenanceBills: MaintenanceBill[]
  dueMaintenance: DueMaintenanceRecord[]
  inspections: Inspection[]
}
```

### 4.2 sessionStorage Persistence

On context initialization:
1. Check `sessionStorage` for each entity key.
2. If found → hydrate from `sessionStorage`.
3. If not found → seed from `lib/seed.ts`, write to `sessionStorage`.

On every state mutation (add/edit/delete):
- Update React state.
- Immediately write the updated array back to `sessionStorage`.

This ensures cross-page consistency for the lifetime of the browser tab.

```ts
// lib/session.ts
export function getSessionData<T>(key: string, fallback: T[]): T[] {
  const raw = sessionStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

export function setSessionData<T>(key: string, data: T[]): void {
  sessionStorage.setItem(key, JSON.stringify(data))
}
```

### 4.3 Context Actions

Each entity exposes four actions on the context:

| Action | Signature |
|--------|-----------|
| `addX` | `(item: X) => void` |
| `updateX` | `(id: string, updates: Partial<X>) => void` |
| `deleteX` | `(id: string) => void` |
| `getXById` | `(id: string) => X \| undefined` |

---

## 5. ROUTING

Uses Next.js App Router (file-based). All routes are under `/maintenance/`.

| Route | Page |
|-------|------|
| `/maintenance/plan` | Plan |
| `/maintenance/logs` | Logs |
| `/maintenance/types` | Maintenance Types |
| `/maintenance/bills` | Maintenance Bills |
| `/maintenance/parts` | Parts |
| `/maintenance/due-maintenance` | Due Maintenance |
| `/maintenance/inspection` | Inspection Compliance |
| `/maintenance/inspection/new` | Create New Inspection (full page) |

Root `/` redirects to `/maintenance/plan`.

---

## 6. NAVIGATION / SIDEBAR

A persistent left sidebar rendered in `app/layout.tsx` (wraps all `/maintenance/*` routes).

**Nav items:**
- Plan
- Logs
- Maintenance Types
- Maintenance Bills
- Parts
- Due Maintenance
- Inspection

Active link is highlighted. Sidebar is fixed-width (~240px); main content takes remaining width.

---

## 7. COMPONENT PATTERNS

### 7.1 Modal Pattern

All create/edit modals use `shadcn/ui Dialog`. Modal state (open/closed, prefill data) is managed locally in the parent page component. Modals call context actions on save.

### 7.2 Drawer Pattern

Advanced filter drawers use `shadcn/ui Sheet` (right-side slide-in). Filter state is local to the page; applying filters updates a local filter state that drives table display logic.

### 7.3 Table Pattern

`DataTable.tsx` is a generic wrapper accepting:
- `columns: ColumnDef[]`
- `data: T[]`
- `onRowAction: (action: string, row: T) => void`
- `visibleColumns: string[]` (for column customization)
- `rowsPerPageOptions: number[]`

Each page builds its own column definitions and passes them to `DataTable`.

### 7.4 Three-dot Row Action Menu

Uses `shadcn/ui DropdownMenu`. Each row renders a `MoreHorizontal` icon button that opens a dropdown with page-specific actions (Edit, Delete, Create Log, etc.).

### 7.5 Tab Pattern

Vehicle/Trailer tabs on Logs, Bills, and Inspection use `shadcn/ui Tabs`. The active tab controls which dataset is shown and which dropdown labels appear (Vehicle Number vs Trailer Number).

---

## 8. CROSS-PAGE DATA LINKAGE

All cross-page linkage is handled automatically through shared context:

| Trigger | Effect |
|---------|--------|
| Add/edit/delete `MaintenanceType` | All `MaintenanceType` dropdowns re-render from context |
| Add `MaintenancePlan` | Plan table + all plan dropdowns update |
| Add `Vendor` | Vendor dropdowns in Logs and Bills update |
| Add `Part` | Parts table + Bill log-item Part dropdown update |
| Add `MaintenanceLog` | Logs table updates; Due Maintenance row updates if triggered from there |
| Add `MaintenanceBill` | Bills table updates; linked log rows created with bill ref number |

Because all components consume the same context, React re-renders update all consumers automatically — no manual event bus needed.

---

## 9. EXPORT BEHAVIOR

CSV export is implemented as a client-side utility:

```ts
// lib/export.ts
export function exportToCSV(filename: string, columns: string[], rows: Record<string, unknown>[]): void {
  const header = columns.join(',')
  const body = rows.map(r => columns.map(c => `"${r[c] ?? ''}"`).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
```

Pages with export: Plan, Logs, Maintenance Bills, Parts.

---

## 10. VALIDATION

Validation is client-side only, triggered on form submit. Required fields show an inline error message below the input using a simple `useState<string>` error map.

```tsx
const [errors, setErrors] = useState<Record<string, string>>({})

function validate(): boolean {
  const errs: Record<string, string> = {}
  if (!form.name) errs.name = 'Name is required.'
  if (!form.maintenanceTypeId) errs.maintenanceTypeId = 'Maintenance Type is required.'
  // ...
  setErrors(errs)
  return Object.keys(errs).length === 0
}
```

---

## 11. DEPLOYMENT

```bash
# Install
npm install

# Dev
npm run dev

# Build + export
npm run build

# Deploy to Vercel
vercel deploy
```

**next.config.js** settings:
- `output: 'export'` for static HTML export (optional — Vercel also supports standard Next.js builds)
- No API routes needed; nothing server-side

---

## 12. KEY CONSTRAINTS

| Constraint | Decision |
|------------|----------|
| No backend | All data in `sessionStorage` only |
| No auth | No login page; app opens directly to Plan |
| No real PDF | Inspection annual report opens `window.print()` or a static mock page |
| No real Excel | CSV export only |
| Session-only data | `sessionStorage` (not `localStorage`) so data resets on tab close |
| Seed on first load | Check for `__seeded` flag in `sessionStorage`; seed once per session |
