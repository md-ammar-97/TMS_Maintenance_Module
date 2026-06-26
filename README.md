# TMS Maintenance Module

A fully functional frontend prototype of a Maintenance Module for a Transportation Management System (TMS), built to match the **AxesTrack / FreightNXT** visual design.

> **Prototype scope:** No backend, no database, no authentication. All state persists in `sessionStorage` for the browser session and resets on tab close. Deployable to Vercel with a single command.

---

## Live Demo

> Deploy to Vercel → see [Deployment](#deployment) section below.

---

## Features

| Page | What it does |
|------|-------------|
| **Plan** | Create and manage maintenance plans (interval by days / months / mileage). View assigned trucks per plan. |
| **Logs** | Add maintenance logs per vehicle or trailer. Filter by unit type and maintenance type. Tabbed vendor management. CSV export. |
| **Maintenance Types** | CRUD for maintenance type categories (Oil Change, Tire Work, Engine, etc.). |
| **Maintenance Bills** | Create bills with multi-line items (service or part). Auto-creates linked log entries on save. Filter by payment status. |
| **Parts** | Manage the parts catalog used in bill line items. |
| **Due Maintenance** | Traffic-light status (OK / Upcoming / Overdue) for all plan–unit assignments. One-click "Log" prefills the log modal. |
| **Inspection** | Vehicle and trailer inspection forms (40 / 21 items). Per-item OK / N/A / Def toggle. Side-panel detail view with defect summary. |

### Cross-cutting capabilities
- Right-drawer sheets for add/edit forms (Logs, Bills)
- Centered modals for lightweight dialogs (Types, Plans, Parts, Vendors)
- Row-level actions (Edit, Delete) via a `⋯` dropdown on hover
- CSV export on every list page
- Session-scoped seed data — 12 vehicles, 10 trailers, 21 carriers, 12 vendors, 6 logs, 6 bills, 10 due-maintenance records, 8 inspections

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Primitives | Radix UI (Dialog, Sheet, Select, Switch, Tabs, Checkbox, Dropdown, Popover) |
| Icons | Lucide React |
| Toasts | Sonner |
| State | React Context + `sessionStorage` |
| ID generation | `crypto.randomUUID()` |
| Date utilities | date-fns |

No backend, no database, no auth library.

---

## Project Structure

```
MaintanceModule/
├── docs/                         # Planning documents
│   ├── problem.md                # Spec / requirements
│   ├── architecture.md           # Tech decisions and folder map
│   ├── context.md                # User flows and data lifecycle
│   ├── data_model.md             # TypeScript interfaces and seed data tables
│   ├── design.md                 # Design system extracted from screenshots
│   ├── edgecases.md              # Edge case analysis
│   └── implementation.md         # Phased build guide
│
└── maintenance-module/           # Next.js application
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx        # Root layout (AppProvider + Toaster)
    │   │   ├── page.tsx          # Redirect → /maintenance/plan
    │   │   └── maintenance/
    │   │       ├── layout.tsx    # Shell with Sidebar + TopBar
    │   │       ├── plan/         # Plan page + PlanModal + TruckDetailsModal
    │   │       ├── types/        # Maintenance Types page + TypeModal
    │   │       ├── parts/        # Parts page + PartModal
    │   │       ├── logs/         # Logs page + LogModal + VendorModal
    │   │       ├── bills/        # Bills page + BillModal
    │   │       ├── due-maintenance/ # Due Maintenance page
    │   │       └── inspection/   # Inspection list + detail + new/page.tsx
    │   ├── components/
    │   │   ├── layout/           # Sidebar, TopBar
    │   │   ├── ui/               # Button, Input, Select, Dialog, Sheet, ...
    │   │   └── shared/           # DataTable, PageHeader, StatusBadge, ...
    │   ├── context/
    │   │   └── AppContext.tsx     # Global state + sessionStorage sync
    │   ├── lib/
    │   │   ├── seed.ts           # Hardcoded seed data (11 entity arrays)
    │   │   ├── session.ts        # sessionStorage helpers with SSR guard
    │   │   ├── export.ts         # CSV export via Blob + anchor click
    │   │   └── utils.ts          # cn, formatCurrency, formatDate, generateId
    │   └── types/
    │       └── index.ts          # All TypeScript interfaces + inspection item arrays
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Local Development

```bash
# Clone
git clone https://github.com/md-ammar-97/TMS_Maintenance_Module.git
cd TMS_Maintenance_Module/maintenance-module

# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it auto-redirects to `/maintenance/plan`.

---

## Deployment

### Vercel (recommended)

**Option A — Vercel CLI:**
```bash
cd maintenance-module
npm install -g vercel
vercel --prod
```
When prompted, set the **Root Directory** to `maintenance-module`.

**Option B — GitHub import:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `md-ammar-97/TMS_Maintenance_Module`
3. Set **Root Directory** → `maintenance-module`
4. Framework preset auto-detects as Next.js
5. Click Deploy

No environment variables needed.

---

## Data Model (Summary)

All data lives in `sessionStorage` under these keys:

| Key | Entity | Seed count |
|-----|--------|-----------|
| `maintenanceTypes` | MaintenanceType | 7 |
| `maintenancePlans` | MaintenancePlan | 3 |
| `carriers` | Carrier | 21 |
| `vehicles` | Vehicle | 12 |
| `trailers` | Trailer | 10 |
| `vendors` | Vendor | 12 |
| `parts` | Part | 5 |
| `maintenanceLogs` | MaintenanceLog | 6 |
| `maintenanceBills` | MaintenanceBill | 6 |
| `dueMaintenance` | DueMaintenanceRecord | 10 |
| `inspections` | Inspection | 8 |

Session resets on tab/browser close. Data does not persist across sessions by design.

---

## Design Reference

The UI matches the **AxesTrack / FreightNXT** TMS design extracted from live screenshots:

- Primary blue: `#2563EB`
- Sidebar width: 240px, white background, left-border active indicator
- TopBar height: 52px
- Table rows: 48px height, `#F9FAFB` header
- Status pills: green (OK/Active/Paid), yellow (Upcoming/Pending), red (Overdue/Defective)
- Modals: right-side Sheet for forms, centered Dialog for confirmations

See [`docs/design.md`](docs/design.md) for the full design system.
