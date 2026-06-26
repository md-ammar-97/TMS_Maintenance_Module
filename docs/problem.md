# PROJECT PROBLEM STATEMENT
## Maintenance Module Frontend Prototype for Existing TMS

---

## 1. CONTEXT

We already have a working Transportation Management System (TMS). This task is only to build a proper clickable frontend prototype for the Maintenance Module.

The prototype does **NOT** need a functional backend, database, authentication, real APIs, or server-side persistence. It should be deployable as a Vercel frontend only.

The goal is to create a realistic maintenance module experience where all pages are connected, modals work, dropdowns are populated, tables have hardcoded seed data, and newly created items during the active browser session reflect across related pages.

> Ignore any Figma-related references from earlier prompts. The output should be a working frontend prototype, not a Figma file.

---

## 2. PRIMARY OBJECTIVE

Build a frontend-only Maintenance Module with the following pages:

1. Plan
2. Logs
3. Maintenance Types
4. Maintenance Bills
5. Parts
6. Due Maintenance
7. Inspection

The prototype should feel like a real TMS module. Users should be able to navigate between pages, open modals, create/edit/delete prototype records, filter/search tables, and see newly created data reflected in related dropdowns and tables during the same browser session.

---

## 3. DEPLOYMENT AND TECHNICAL EXPECTATIONS

### 3.1 Frontend Only

- Build as a frontend-only app suitable for Vercel deployment.
- No backend is required.
- No real database is required.
- No authentication is required.
- No real API integrations are required.
- No server-side state is required.

### 3.2 Recommended Frontend Behavior

Use React/Next.js or any Vercel-compatible frontend stack.

Use session-level state so data persists only while the browser session is open.

**Preferred approach:**

- Seed hardcoded data on first load.
- Store working session data in `sessionStorage`.
- Read from `sessionStorage` across pages.
- When the browser/tab session closes, the data can reset on the next fresh session.

**Important:**

- Every user opening the app for the first time should see hardcoded sample data.
- If a user creates a new maintenance type, plan, vendor, part, log, bill, or inspection during the same session, it should reflect across relevant pages.
- Data does not need to remain permanently after the browser session ends.

### 3.3 Routing

Create a left navigation/sidebar or top navigation menu with links to all pages:

- `/maintenance/plan`
- `/maintenance/logs`
- `/maintenance/types`
- `/maintenance/bills`
- `/maintenance/parts`
- `/maintenance/due-maintenance`
- `/maintenance/inspection`

Exact route names can vary, but all pages must be accessible and linked.

### 3.4 UI Style

> **Visual design is fully specified in `design.md`** — an **Uber Base** foundation (light-first, dark parity) organized as a Figma token library, with a Data Encoding System that color/icon-codes the dense tables. The points below are the baseline; `design.md` is authoritative.

- Keep the UI clean, enterprise SaaS-style, similar to a TMS admin dashboard.
- Use tables, filter bars, primary/secondary buttons, dropdowns, date pickers, toggles, drawers, modals, tabs, and row action menus.
- Primary buttons should be visually prominent.
- Secondary buttons should be lighter.
- Row actions should usually be under a three-dot menu.
- The prototype should prioritize functional flow and clickable behavior over pixel-perfect design.

---

## 4. GLOBAL DATA AND SESSION STATE

Create shared frontend state for the following entities:

1. Maintenance Types
2. Maintenance Plans
3. Vendors
4. Vehicles
5. Trailers
6. Carriers
7. Parts
8. Maintenance Logs
9. Maintenance Bills
10. Due Maintenance Records
11. Inspection Records

All pages should read from and update the same shared session data.

> **Dropdown rule (applies everywhere):** every Maintenance Type, Maintenance Plan, Vendor, Part, Carrier, Vehicle, and Trailer dropdown is **derived from the shared session state** — never a page-local hardcoded list. Vehicle/Trailer dropdowns therefore show the full seeded fleet (12 vehicles / 10 trailers); inactive units appear with an `(Inactive)` suffix based on their `status`, not as separate hardcoded rows. This is what keeps the pages linked (e.g. a new type created on the Types page appears in every type dropdown in the same session).

### 4.1 Required Seeded Maintenance Types

| # | Name | Description |
|---|------|-------------|
| 1 | Oil Change | Every 30,000–35,000 Miles |
| 2 | Truck Tires | Steers - Change Every 100,000 Miles |
| 3 | Engine Work | — |
| 4 | Trailer Work | — |
| 5 | Trailer Tires | — |
| 6 | Reefer Work | — |
| 7 | Truck Work | — |

These types should populate maintenance type dropdowns across:
- Plan create/edit modal
- Logs create/edit modal
- Bills create/edit modal
- Due Maintenance advanced filters
- Any other maintenance type selector

If a new maintenance type is created from the Maintenance Types page, it must immediately appear in all maintenance type dropdowns across the app during the same session.

### 4.2 Required Seeded Carriers

- YOLO TRANSPORT LLC
- YOUNGS FREIGHTWAYS INC
- 2G Express LLC
- 2H Brothers Trucking Service Inc
- 3 Tigers Transport Inc
- 3D Carrier Inc
- 4B States Carrier Inc
- A & E Luna Tracking LLC
- A & S Trucking
- A&J TRUCKLINE INC
- A&R Garcia Trucking, LLC.
- AGAM HAULER INC
- AGS Transport Inc
- AIM TRANSPORT INC
- AIRBOURNE LOGISTICS INC
- YAJAT INC
- Western Enterprises
- Worldwide Express
- ZEEZ TRANSPORTATION
- Zee Trucking Inc
- Zero 1 Transport Inc

### 4.3 Required Seeded Vehicles

Vehicle numbers: `100`, `137`, `139`, `143`, `144`, `160`, `161`, `162`, `163`, `164`, `107`, `109`

Include sample carrier and terminal mappings.

**Example fields:**
- Vehicle number
- Carrier
- Terminal
- Current mileage
- Status

### 4.4 Required Seeded Trailers

Trailer numbers: `3559`, `53100`, `53101`, `53102`, `53103`, `5330`, `5331`, `5333`, `5334`, `5335`

Include sample carrier and terminal mappings.

### 4.5 Required Seeded Vendors

- BVD
- Comdata
- QuikQ
- Pre Pass
- PilotFlyingJ
- Best Pass
- FleetOne
- EFS
- Downs Energy/CFN
- TCS
- I-Pass
- Youngs Freightways INC

If a vendor is created from a vendor modal, it should appear in vendor dropdowns on Logs and Maintenance Bills during the same session.

### 4.6 Required Seeded Maintenance Plans

| # | Name | Type | Interval Type | Interval | Status | Description |
|---|------|------|---------------|----------|--------|-------------|
| 1 | 30000 miles | Oil Change | Mileage | 30000 | Active | Oil change after every 30,000 miles |
| 2 | Regular Maintenance | Truck Work | Months | 3 | Active | Quarterly truck maintenance check |
| 3 | BIT INSPECTION | Inspection | Months | 12 | Active | Annual inspection compliance plan |

New plans created anywhere in the app should appear on the Plan page and in Maintenance Plan dropdowns on Logs, Bills, and Due Maintenance during the same session.

### 4.7 Required Seeded Parts

| # | Name | Description |
|---|------|-------------|
| 1 | Oil Filter | Standard oil filter for truck maintenance |
| 2 | Air Filter | Engine air filter replacement |
| 3 | Brake Pad Set | Front axle brake pad set |
| 4 | Reefer Belt | Replacement belt for reefer unit |
| 5 | Trailer Tire | Standard trailer tire replacement item |

Parts should populate a Part dropdown in Maintenance Bills when Maintenance Log Type is selected as **Part**.

---

## 5. PAGE 1: PLAN

### 5.1 Page Title
`Plan`

### 5.2 Header Actions

- **+ Create New Maintenance Plan** — primary button, opens modal
- **Export** — exports table as CSV/XLSX

### 5.3 Create/Edit Maintenance Plan Modal

**Create title:** Create new maintenance plan  
**Edit title:** Edit maintenance plan

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Name | Text input | Yes | — |
| Maintenance Type | Dropdown | Yes | From shared Maintenance Types |
| Description | Text area | No | — |
| Interval Type | Dropdown | Yes | Days / Months / Mileage |
| Interval | Number input | Yes | Numbers only |
| Validate Upcoming Maintenance At Dispatch | Switch | No | Boolean. **Prototype: stores the value only — no dispatch logic runs (dispatch engine is out of scope).** |
| Validate Due Maintenance At Dispatch | Switch | No | Boolean. **Prototype: stores the value only — no dispatch logic runs.** |
| Status | Switch | No | Default: On/True |

**Footer:** Save / Cancel

**Save behavior:** Validate required fields → update session state → reflect in Plan table, Logs/Bills/Due Maintenance dropdowns.

### 5.4 Plan Filter Bar

| Filter | Type | Options |
|--------|------|---------|
| General search | Text | Name or Description |
| Name search | Text | Name only |
| Maintenance Type | Dropdown | `All` + the shared Maintenance Types (Oil Change, Truck Tires, Engine Work, Trailer Work, Trailer Tires, Reefer Work, Truck Work, plus any created at runtime). **Derived from shared state — not a hardcoded list.** |
| Interval Type | Dropdown | All, Days, Months, Mileage |
| Status | Dropdown | All, False, True |

Include a **Clear Filters** button.

### 5.5 Plan Table Columns

| Column |
|--------|
| Actions |
| Name |
| Maintenance Type |
| Interval Type |
| Interval |
| Status |
| Description |
| Total OverDue |

Hardcode at least 3 rows from seeded maintenance plans.

### 5.6 Row Action Menu

- **Edit** — opens edit modal prefilled
- **Truck Maintenance Details** — opens details popup

### 5.7 Truck Maintenance Details Popup

Title = selected plan name (e.g., "30000 miles")

| Column |
|--------|
| Vehicle Number |
| Terminal |
| Carrier |
| Last Service Date |
| Due Date/Mileage |

- Include hardcoded sample vehicle rows
- Allow user to select rows per page
- Include close button

---

## 6. PAGE 2: LOGS

### 6.1 Page Title
`Logs`

### 6.2 Header Actions

- **Total Amount** display (e.g., `Total Amount: $12,450`)
- **PullRay Integration Logs** — secondary button (placeholder modal/toast)
- **+ Create new maintenance log** — primary button, opens modal

### 6.3 Main Tabs

1. **Vehicle** (default)
2. **Trailer**

### 6.4 Logs Filter Bar

| Filter | Notes |
|--------|-------|
| Search | Searches across type, plan, vehicle/trailer, vendor, description, bill ref |
| Log Status | All / Mapped / UnMapped |
| Maintenance Type | Dropdown from shared types |
| Maintenance Plan | 30000 miles, Regular Maintenance, BIT INSPECTION |
| Carrier | From shared Carriers |
| Vehicle/Trailer Number | Vehicle Number on Vehicle tab; Trailer Number on Trailer tab |
| Clear Filters | Icon button |
| Advanced Filters | Funnel icon → right-side drawer |

### 6.5 Logs Advanced Filters Drawer

**Title:** Filters

| Field | Type |
|-------|------|
| Tire Position | Dropdown (LFI, LFO, RFI, RFO, LRI, LRO, RRI, RRO, RS, LS) |
| Min Mileage | Number input |
| Max Mileage | Number input |
| Service date | Date picker |
| Min Amount | Number input |
| Max Amount | Number input |
| Description | Text input |

**Footer:** Clear Filters / Apply Filters

### 6.6 Logs Table Columns

| Column |
|--------|
| Actions |
| Maintenance Type |
| External Maintenance Type |
| Plan Name |
| Tire Position |
| Vehicle/Trailer Number |
| Service Date |
| Mileage |
| Amount |
| Description |
| Created By |
| Bill Ref Number |
| Currency |
| GST |
| HST |
| QST |

- At least 3 hardcoded vehicle log rows
- At least 3 hardcoded trailer log rows
- Horizontal scroll support
- Rows per page dropdown + pagination
- Export/download icon
- Column customization icon

### 6.7 Logs Row Actions

- **Edit** — opens log modal prefilled
- **Delete** — removes row from session state

### 6.8 Column Customization Popover

All columns listed above as checkboxes (all checked by default). Unchecked = hidden.

### 6.9 Create/Edit Maintenance Log Modal

**Top-right toggle:** Vehicle / Trailer (Vehicle default)

#### 6.9.1 Vehicle Tab Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Maintenance Type | Dropdown | Yes | From shared types |
| Tire Position | Dropdown | No | LRI, LRO, RRI, RRO, LFI, LFO, RFI, RFO, RS, LS |
| Maintenance Plan | Dropdown | No | From shared plans; with search |
| + Create New (Plan) | Link | — | Opens create plan modal |
| Vehicle | Dropdown | Yes | From shared vehicles |
| Vendor | Dropdown | No | From shared vendors |
| + Create New (Vendor) | Link | — | Opens create vendor modal |
| Mileage | Number | Yes | Default: 0 |
| Service date | Date picker | Yes | Default: current date |
| Currency | Dropdown | No | USD / CAD; default USD |
| Amount | Number | Yes | — |
| Description | Text area | No | — |

**Footer:** Cancel / Save

#### 6.9.2 Trailer Tab Fields

Same as Vehicle tab, except:
- Replace Vehicle dropdown with Trailer dropdown (3559, 53100, 53101, 53102, 53103)
- Mileage is hidden/optional

### 6.10 Create New Vendor Modal

**Title:** Create new vendor

**General Information:**

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Vendor ID | Text | No |
| Address | Text | No |
| Address2 | Text | No |
| City | Text | No |
| State | Text | No |
| Zip code | Text | No |
| Phone | Text | No |
| Fax | Text | No |
| Email | Text | No |
| Status | Toggle | No (default ON) |

**Accounting:**

| Field | Type | Options |
|-------|------|---------|
| Vendor Id (Accounting) | Text | — — *distinct from the General-section "Vendor ID"; this is the accounting ledger ID* |
| Class Id | Dropdown | Select |
| Tax Type | Dropdown | Select / Not A 1099 Vendor / Dividend / Interest / Miscellaneous / Nonemployee Compensation |
| 1099 Box | Dropdown | Select |

**Footer:** Cancel / Save  
**Save:** Adds vendor to shared Vendors; appears in Logs and Bills vendor dropdowns.

---

## 7. PAGE 3: MAINTENANCE TYPES

### 7.1 Page Title
`Maintenance Types`

### 7.2 Header Action

- **+ Create new maintenance type** — primary button

### 7.3 Filter Bar

| Element | Type |
|---------|------|
| Search | General text |
| Name | Filter by name |
| Description | Filter by description |
| Search button | Blue square with search icon |
| Clear button | White square with X icon |
| Filter icon | Funnel |

### 7.4 Table Columns

| Column | Notes |
|--------|-------|
| Actions | Three-dot menu |
| Name | Includes two-letter avatar (e.g., OC, TT, EW) |
| Description | — |

### 7.5 Seeded Rows

| Name | Description |
|------|-------------|
| Oil Change | Every 30,000–35,000 Miles |
| Truck Tires | Steers - Change Every 100,000 Miles |
| Engine Work | — |
| Trailer Work | — |
| Trailer Tires | — |
| Reefer Work | — |
| Truck Work | — |

### 7.6 Row Actions

- **Edit** — opens edit modal prefilled
- **Delete** — removes type from session state; hides from dropdowns

### 7.7 Create Maintenance Type Modal

**Title:** Create new maintenance type

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Description | Text | No |

**Footer:** Cancel / Save  
**Save:** Adds to shared types; immediately appears in Plan, Logs, Bills, Due Maintenance dropdowns.

### 7.8 Edit Maintenance Type Modal

**Title:** Edit maintenance type  
Fields pre-populated. Same footer and save behavior.

---

## 8. PAGE 4: MAINTENANCE BILLS

### 8.1 Page Title
`Maintenance Bills`

### 8.2 Header Actions

- **PullRay Integration Logs** — secondary button (placeholder)
- **+ Create new maintenance bill** — primary button

### 8.3 Main Tabs

1. **Vehicle** (default)
2. **Trailer**

### 8.4 Filter Bar

| Filter | Notes |
|--------|-------|
| Bill Ref Number | Text search |
| Carrier | From shared Carriers |
| Vehicle/Trailer Number | Tab-dependent |
| Bill date | Date range picker with presets (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range) |
| Clear Filters | Icon button |
| Advanced Filters | Funnel icon |

### 8.5 Bills Table Columns

| Column |
|--------|
| Bill Ref Number |
| Payment Status |
| Vendor Name |
| Carrier |
| Vehicle/Trailer Number |
| Bill Date |
| Total Amount |
| Work Completed Date |
| Mileage |
| Location |

- At least 3 seeded vehicle bill rows
- At least 3 seeded trailer bill rows
- Export icon, column customization, rows per page, pagination

### 8.6 Column Customization Options

Bill Ref Number, Payment Status, Vendor Name, Carrier, Trailer Number, Vehicle Number, Bill Date, Total Amount, Work Completed Date, Mileage, Location

### 8.7 Create/Edit Maintenance Bill Modal

**Top-right toggle:** Vehicle / Trailer

#### 8.7.1 Vehicle Tab Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Bill Ref Number | Text | Yes | — |
| Vendor | Dropdown | Yes | From shared Vendors |
| + Create New (Vendor) | Link | — | Opens vendor modal |
| Vehicle | Dropdown | Yes | 100, 137, 139, 143, 144 |
| Bill Date | Date picker | Yes | Default: current date |
| Currency | Dropdown | No | USD / CAD; default USD |
| Total Amount | Read-only | — | Sum of log items |
| Payment Status | Dropdown | Yes | Pending / Paid |
| Work Completed Date | Date picker | No | — |
| Mileage | Number | Yes | — |
| Location | Text | No | Includes pin icon |
| Payment Method | Dropdown | No | EFS / ComCheck / ACH / Cash / Card |
| Description | Text area | No | — |

#### 8.7.2 Trailer Tab Fields

Same as Vehicle, except:
- Replace Vehicle with Trailer dropdown (3559, 53100, 53101, 53102, 53103)
- **Remove/hide Mileage field**

### 8.8 Dynamic Maintenance Log Section (inside Bill Modal)

**Section title:** Maintenance Log  
**+ button** adds a new log block.

Each block contains:

| Field | Type | Required | Condition |
|-------|------|----------|-----------|
| Maintenance Log Type | Dropdown | Yes | Service / Part |
| Maintenance Type | Dropdown | Yes (if Service) | From shared types |
| + Create New (Maintenance Type) | Link | — | Opens create type modal |
| Part | Dropdown | Yes (if Part) | From shared Parts |
| Maintenance Plan | Dropdown | No | From shared plans |
| + Create New (Maintenance Plan) | Link | — | Opens create plan modal |
| Amount | Number | Yes | Contributes to Total Amount |
| Description | Text area | No | — |
| Remove | Button | — | Removes block |

**Save behavior:**
- Save bill in session state
- Create linked log rows in Logs page (with Bill Ref Number)
- Bill appears in Maintenance Bills table immediately

---

## 9. PAGE 5: PARTS

### 9.1 Page Title
`Parts`

### 9.2 Header Actions

- **+ Create new part** — primary button
- **Three-dot menu** → Export (downloads a **CSV**; labeled "Export to Excel" in the UI but the prototype produces a `.csv`, per the CSV-only constraint)

### 9.3 Filter Bar

| Filter | Notes |
|--------|-------|
| Search | Text + blue search icon |
| Name | Text + blue search icon |
| Description | Text + blue search icon |
| Clear | Clears all filters |

### 9.4 Table Toolbar (right side)

- Show/hide columns (settings icon → right drawer)
- Export to Excel (download icon)
- Filter (funnel icon)

### 9.5 Table Columns

| Column |
|--------|
| Name |
| Description |

Seed at least 5 rows (from seeded parts list).

### 9.6 Create New Part Modal

| Field | Type | Required |
|-------|------|----------|
| Name | Text | Yes |
| Description | Text area | No |

**Footer:** Cancel / Save  
**Save:** Adds to shared Parts; appears in Parts table and Bills Part dropdown.

### 9.7 Show/Hide Columns Drawer

Checkboxes (all checked by default): Name, Description  
**Footer:** Clear Filters / Apply Filters

---

## 10. PAGE 6: DUE MAINTENANCE

### 10.1 Page Title
`Due Maintenance`

### 10.2 Filter Bar

| Filter | Notes |
|--------|-------|
| Carrier | From shared Carriers |
| Vehicle Number | 100, 137, 139, 143, 144 |
| Trailer Number | 3559, 53100, 53101, 53102, 53103 |
| Service Date | Date range picker with presets |
| Clear Filters | Icon button |
| Advanced Filters | Funnel icon → right drawer |

### 10.3 Dashboard Tabs

1. **By Mileage** (default)
2. **By Date**

### 10.4 Due Maintenance Table Columns

| Column |
|--------|
| Actions |
| Plan Name |
| Vehicle Type |
| Number |
| Last Service Date |
| Last Service Mileage |
| Current Mileage |
| Due In |

**Due In visual status:**
- 🟢 Green = not urgent
- 🟡 Yellow/Orange = upcoming
- 🔴 Red = overdue

Include hardcoded rows for both vehicles and trailers.

### 10.5 Row Action Menu

- **Create Log** — opens Create new maintenance log modal, prefilled with:
  - Vehicle/Trailer tab selected automatically
  - Vehicle/Trailer number
  - Maintenance Plan
  - Maintenance Type (from plan if available)

**Save behavior:**
- Adds log to Logs table
- Updates the due maintenance record: Last Service Date, Last Service Mileage, Due In recalculated

### 10.6 Advanced Filters Drawer

**Title:** Filters

| Field | Options |
|-------|---------|
| Maintenance Type | All + shared types |
| Maintenance Plan | 30000 miles, Regular Maintenance, BIT INSPECTION |

**Footer:** Clear Filters / Apply Filters

### 10.7 Table Toolbar

Include show/hide columns icon.

---

## 11. PAGE 7: INSPECTION

### 11.1 Page Title
`Inspection Compliance`

### 11.2 Main Tabs

1. **Vehicle** (default)
2. **Trailer**

### 11.3 Layout

Two-column layout:
- **Left:** Unit selection sidebar
- **Right:** Selected unit inspection details

### 11.4 Left Sidebar

| Element | Notes |
|---------|-------|
| Unit Number | Text input with search icon |
| Select Carrier | Dropdown with search |
| Unit List Table | Unit Number + Carrier columns |
| Pagination | Rows per page + page numbers |

Carriers include all seeded carriers. Unit numbers are clickable links that update right-side content.

### 11.5 Right Content Header

- Title = selected unit number (e.g., `100`, `5333`)
- **Vehicle tab button:** + Create new truck inspection
- **Trailer tab button:** + Create new trailer inspection
- Clicking opens a **full-page** create inspection view (not a modal)

### 11.6 Annual Report Download Section

- Year dropdown: 2026, 2025, 2024, 2023, 2022, 2021
- Download button — opens mock PDF/printable page or new tab

### 11.7 Inspection Records Table

| Column |
|--------|
| Actions |
| Inspection Date |
| Inspection By |
| Mileage |

Seed at least 2 vehicle and 2 trailer inspection rows.

### 11.8 Create New Inspection Full Page

**Title:** Create new inspection  
**Top-right buttons:** Back to list / Save

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Vehicle entity type | Dropdown | No | Pre-filled from tab |
| Carrier | Dropdown | Yes | From shared Carriers |
| Vehicle or Trailer | Dropdown | Yes | Vehicle: 143, 107, 109, 162, 164 / Trailer: 5333, 5330, 5331, 5334, 5335 |
| Mileage | Number | Vehicle only | Hidden for trailers |
| Inspection date | Date picker | Yes | Default: current date |
| Inspection by | Dropdown | Yes | John Miller / Sarah Lee / David Brown / Mike Johnson |

### 11.9 Inspection Item Section

**Header:** Inspection Item

- **Mark all OK** checkbox/action
- **Legend:** 🟢 Green circle = OK | 🟥 Red square = Def
- **Grid:** Items 1–40 for vehicle; items 1–21 for trailer

Each item has:
- Item number
- Description
- Three-way control: **NA** / **OK (✓)** / **Def (✗)**

### 11.10 Vehicle Inspection Items (1–40)

| # | Item |
|---|------|
| 1 | Fire extinguisher and reflective warning devices |
| 2 | Horn, defroster, gauges, odometer, and speedometer |
| 3 | Mirrors and supports |
| 4 | Windshield wipers, window cracks |
| 5 | All lights, signals, reflectors, mudflaps |
| 6 | Electrical wiring - condition and protection |
| 7 | Batteries - water level, terminals, and cables |
| 8 | Warning devices - air, oil, temperature, anti-skid, and/or vacuum |
| 9 | Radiator and water hoses - coolant level, condition, and/or leaks |
| 10 | Belts - compressor, fan, water pump, and/or alternator |
| 11 | Air hoses and tubing leaks, condition, and/or protection |
| 12 | Fuel system - tank, hoses, tubing, and/or pump; leaks |
| 13 | Exhaust system, manifolds, piping, muffler, leaks and/or condition |
| 14 | Engine - mounting, excessive grease and/or oil |
| 15 | Clutch adjustment - free play |
| 16 | Air filter, throttle linkage |
| 17 | Starting and charging system |
| 18 | Tractor protection valve - NA |
| 19 | Hydraulic brake system - adjustment, components, and/or condition |
| 20 | Hydraulic master cylinder - level, leaks, and/or condition |
| 21 | Hoses and tubing - condition and protection |
| 22 | Air brake system - adjustment, components, and/or condition |
| 23 | 1 minute air or vacuum loss test |
| 24 | Air compressor governor cut-in and cut-out pressures (85-130) |
| 25 | Primary air tank - drain and test check valve |
| 26 | Other air tank - drain and check for contamination; securement |
| 27 | Tires - tread depth, inflation, and condition |
| 28 | Housing system - studs - cracks, looseness, and/or condition |
| 29 | Parking brake - able to hold the vehicle |
| 30 | Emergency stopping system - labeled and operative |
| 31 | Brakes release after complete loss of service air |
| 32 | Steering system - adjustment, components, and/or condition |
| 33 | Steering arms, drag links, and/or tie rod ends |
| 34 | Connecting devices - fifth wheel, pin(s), hitch, drawbar, eye and/or safety devices |
| 35 | Suspension system - springs, shackles, u-bolts, and/or torque rods |
| 36 | Frame and cross members - cracks and/or condition |
| 37 | Drive shaft, universal joints, and/or guards |
| 38 | Transmission and differential - mounting, leaks, and/or condition |
| 39 | Wheel seals - leaks and/or condition |
| 40 | Under carriage - clean and secure |

### 11.11 Trailer Inspection Items (1–21)

| # | Item |
|---|------|
| 1 | All lights, signals, reflectors |
| 2 | Mudflaps |
| 3 | Air brake system |
| 4 | Air leaks - dump system |
| 5 | Frame, subframe, and body - cracks |
| 6 | Brake adjustment |
| 7 | Brake system, drums, and components - condition |
| 8 | Suspension system - springs, shackles, u-bolts, and/or torque rods |
| 9 | Connecting device - drawbar, drawbar, eye and/or safety devices |
| 10 | Fifth wheel on pull trailer |
| 11 | Air hoses and tubing - leaks, condition, and/or protection |
| 12 | Tires - tread depth, inflation, and condition |
| 13 | Wheels, lug nuts, and studs - cracks, looseness, and/or condition |
| 14 | Hoses and tubing - condition, protection |
| 15 | Hydraulic Master cylinder - level, leaks, and/or condition |
| 16 | Parking brake - able to hold the vehicle |
| 17 | Emergency breakaway brake system |
| 18 | Air relay valves and tank - mounting |
| 19 | Brakes release after complete loss of service air |
| 20 | Wheel seals - leaks and/or condition |
| 21 | Under carriage - clean and secure |

### 11.12 Save Inspection Behavior

- Validate required fields
- Create new inspection record in session state
- Return user to Inspection Compliance list
- New inspection appears under the selected unit

---

## 12. CROSS-PAGE LINKING REQUIREMENTS

The prototype should not behave like isolated pages.

### 12.1 Maintenance Types Linkage

When a maintenance type is created/edited/deleted:
- Maintenance Types table updates
- Plan page Maintenance Type dropdown updates
- Logs Maintenance Type dropdown updates
- Maintenance Bills log item Maintenance Type dropdown updates
- Due Maintenance Maintenance Type filter updates

### 12.2 Maintenance Plans Linkage

When a maintenance plan is created from Plan page, Logs modal, or Bills modal:
- Plan table updates
- Logs Maintenance Plan dropdown updates
- Bills Maintenance Plan dropdown updates
- Due Maintenance Maintenance Plan dropdown updates

### 12.3 Vendors Linkage

When a vendor is created from Logs or Bills:
- Vendor dropdown in Logs updates
- Vendor dropdown in Bills updates

### 12.4 Parts Linkage

When a part is created from Parts page:
- Parts table updates
- Maintenance Bills dynamic log item section shows that part when Maintenance Log Type = Part

### 12.5 Maintenance Logs Linkage

When a maintenance log is created from:
- Logs page create button
- Due Maintenance row action
- Maintenance Bill save flow

It should appear in the Logs table.

- If created from Due Maintenance → update the relevant due maintenance row
- If created from a Bill → include Bill Ref Number in the log row

### 12.6 Maintenance Bills Linkage

When a bill is created:
- Appears in Maintenance Bills table
- Total amount is calculated from its maintenance log items
- Bill Ref Number appears in linked log rows

---

## 13. VALIDATION REQUIREMENTS

### 13.1 Required Fields

Show a simple validation message when missing:
- Name is required.
- Maintenance Type is required.
- Interval is required.
- Vehicle is required.
- Amount is required.

### 13.2 Numeric Fields

Accept numeric values only:
- Plan Interval
- Mileage
- Amount
- Min/Max Amount
- Min/Max Mileage
- Total Amount (read-only / calculated)

### 13.3 Dates

Use simple date inputs or date picker components. Default date: `2026-06-26` or the actual current browser date.

---

## 14. EXPORT REQUIREMENTS

Minimum acceptable behavior: generate CSV download from current table data.

**Pages requiring export:**
- Plan
- Logs
- Maintenance Bills
- Parts

---

## 15. TABLE REQUIREMENTS

Every table must have:
- Hardcoded initial rows
- Search/filter behavior where specified
- Rows per page dropdown
- Pagination footer
- Row actions where specified
- Clear visual column/row separation

---

## 16. ACCEPTANCE CRITERIA

The prototype is acceptable if **all** of the following are true:

- [ ] App deploys as a Vercel frontend
- [ ] No backend is required
- [ ] All 7 pages are present and linked through navigation
- [ ] Every page loads with hardcoded seed data
- [ ] Create/edit/delete actions work at session-state level
- [ ] Data persists while browser session is open
- [ ] Data resets after browser/tab is closed
- [ ] New maintenance type appears in related dropdowns across pages
- [ ] New maintenance plan appears in related dropdowns and Plan table
- [ ] New vendor appears in Logs and Bills vendor dropdowns
- [ ] New part appears in Maintenance Bills part dropdown
- [ ] Creating a maintenance log adds a visible row to Logs
- [ ] Creating a maintenance bill adds a visible row to Maintenance Bills
- [ ] Creating a log from Due Maintenance opens the log modal prefilled and updates Logs after saving
- [ ] Creating an inspection adds it to the selected unit inspection table
- [ ] Filters/search bars work at basic frontend level
- [ ] Export buttons download table data as CSV or Excel-compatible file
- [ ] Modals, drawers, toggles, dropdowns, tabs, and row action menus are clickable
- [ ] UI looks like a clean enterprise TMS admin module
- [ ] No effort spent on backend APIs, real integrations, or pixel-perfect Figma replication

---

## 17. OUT OF SCOPE

Do not build:
- Real backend or database
- Real login/authentication
- Real PullRay integration
- Real vendor/carrier/vehicle API integration
- Real Excel backend export service
- Real PDF generation service
- Real dispatch validation engine
- Real mileage sync
- Pixel-perfect Figma recreation

---

## 18. NICE-TO-HAVE (Optional)

- Toast messages after save/delete
- Confirmation modal before delete
- Responsive layout for tablet/mobile
- Mock PDF/printable view for inspection annual report
- Color-coded due maintenance status
- Empty state designs when filters return no data
- Simple dashboard counts on each page

---

## 19. FINAL DELIVERABLE

Deliver a working frontend prototype of the Maintenance Module with all listed pages, seeded data, session-level state, linked dropdowns, modals, filters, tables, row actions, and basic exports.

The end result should allow a user to open the Vercel URL, explore the full maintenance module, create/edit prototype records, and see those records reflected across pages until the browser session is closed.
