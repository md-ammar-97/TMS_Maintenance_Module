# Context — Maintenance Module Frontend Prototype

> **Design:** visual language is **Uber Base**, light-first with dark parity, organized as a Figma token library — see `design.md`. Dense tables are made scannable by the Data Encoding System (color + icon per entity, category, and status), not left as monochrome grids.

---

## 1. WHAT WE ARE BUILDING

A **frontend-only clickable prototype** of the Maintenance Module for an existing Transportation Management System (TMS).

This is not a new TMS. The backend TMS already exists. The goal is to build a realistic, navigable frontend that demonstrates how the Maintenance Module would look and behave — so stakeholders, developers, or clients can explore all pages, interact with modals and tables, and understand the full user flow before real backend development begins.

---

## 2. WHY A PROTOTYPE

- The Maintenance Module UI does not yet exist in a usable form.
- Stakeholders need to validate the UX flow before committing to backend implementation.
- The prototype allows the team to identify missing fields, confusing flows, or wrong assumptions early — when changes are cheap.
- Deliverable should be deployable to Vercel so any stakeholder can open a URL and explore it without local setup.

---

## 3. WHAT THIS IS NOT

| Not needed | Reason |
|------------|--------|
| Real backend / API | Prototype only; all data is hardcoded |
| Real database | Data lives in browser `sessionStorage` |
| Authentication / login | Any user opening the URL sees the app directly |
| Real PullRay integration | Buttons exist but show a placeholder message |
| Real Excel/PDF export | CSV download is sufficient for prototype |
| Real mileage sync | All mileage values are hardcoded or manually entered |
| Pixel-perfect Figma recreation | Functional flow is the priority, not pixel accuracy |

---

## 4. TARGET USERS (Prototype Reviewers)

| Role | What they need from this prototype |
|------|------------------------------------|
| Product Manager | Validate page structure, workflows, and field completeness |
| Backend Developer | Understand the data shape and API surface they will need to build |
| QA / Business Analyst | Walk through happy paths and identify edge cases |
| Client / Stakeholder | Explore the module end-to-end and approve before development |

---

## 5. THE 7 PAGES

| Page | Route | Purpose |
|------|-------|---------|
| Plan | `/maintenance/plan` | Manage recurring maintenance plans (e.g., oil change every 30k miles) |
| Logs | `/maintenance/logs` | Record individual maintenance service events per vehicle/trailer |
| Maintenance Types | `/maintenance/types` | Master list of maintenance categories (Oil Change, Truck Tires, etc.) |
| Maintenance Bills | `/maintenance/bills` | Track invoices/bills from vendors linked to maintenance log items |
| Parts | `/maintenance/parts` | Catalog of parts used in maintenance (filters, tires, belts) |
| Due Maintenance | `/maintenance/due-maintenance` | Dashboard of vehicles/trailers with upcoming or overdue maintenance |
| Inspection | `/maintenance/inspection` | BIT/annual compliance inspections per unit with 40-item checklist |

---

## 6. HOW THE PAGES RELATE

```
Maintenance Types
    └─ used by → Plans, Logs, Bills, Due Maintenance filters

Maintenance Plans
    └─ used by → Logs, Bills, Due Maintenance filters
    └─ created from → Plan page, Logs modal, Bills modal

Vendors
    └─ used by → Logs, Bills
    └─ created from → Logs modal, Bills modal

Parts
    └─ used by → Bills (when log type = Part)
    └─ created from → Parts page

Vehicles / Trailers / Carriers
    └─ used by → Logs, Bills, Due Maintenance, Inspection (read-only dropdowns)

Maintenance Logs
    └─ created from → Logs page, Due Maintenance (Create Log action), Bills (auto-created on save)
    └─ displayed on → Logs page

Maintenance Bills
    └─ contains → one or more Maintenance Log items
    └─ displayed on → Bills page
    └─ bill ref number → appears on linked log rows

Due Maintenance Records
    └─ updated when → a log is created from the Due Maintenance row action

Inspections
    └─ created from → Inspection full-page form
    └─ displayed under → selected unit on Inspection page
```

---

## 7. KEY USER FLOWS

### 7.1 Create a Maintenance Plan
1. Navigate to **Plan**.
2. Click **+ Create New Maintenance Plan**.
3. Fill in Name, Maintenance Type, Interval Type, Interval.
4. Toggle Status ON.
5. Click **Save**.
6. New plan appears in the Plan table immediately.
7. New plan is now selectable in Logs and Bills modals and Due Maintenance filters.

### 7.2 Log a Maintenance Event (Vehicle)
1. Navigate to **Logs**.
2. Click **+ Create new maintenance log**.
3. Select Vehicle tab.
4. Choose Maintenance Type, Vehicle, Vendor, enter Mileage, Service Date, Amount.
5. Click **Save**.
6. New log row appears in the Vehicle tab of the Logs table.
7. Total Amount in the page header updates.

### 7.3 Create a Maintenance Bill with Log Items
1. Navigate to **Bills**.
2. Click **+ Create new maintenance bill**.
3. Enter Bill Ref Number, select Vendor, Vehicle, Bill Date, Payment Status.
4. In the **Maintenance Log** section, click **+** to add a log item.
5. Choose Log Type (Service or Part), select Maintenance Type or Part, enter Amount.
6. Total Amount auto-calculates.
7. Click **Save**.
8. New bill row appears in Bills table.
9. Linked log rows with the bill ref number appear in the Logs table.

### 7.4 Address Due Maintenance
1. Navigate to **Due Maintenance**.
2. See vehicles/trailers with overdue or upcoming maintenance (color-coded).
3. Click three-dot menu → **Create Log**.
4. Log modal opens prefilled with vehicle number, maintenance plan, and type.
5. Confirm or adjust fields; click **Save**.
6. Log added to Logs table.
7. Due Maintenance row updates: Last Service Date and Due In recalculate.

### 7.5 Conduct an Inspection
1. Navigate to **Inspection**.
2. Click a unit number in the left sidebar (e.g., vehicle `100`).
3. Click **+ Create new truck inspection**.
4. Full-page inspection form opens.
5. Fill in Carrier, Vehicle, Mileage, Inspection Date, Inspection By.
6. Work through 40 inspection items: mark each NA / OK / Def.
7. Click **Mark all OK** to bulk-approve all items.
8. Click **Save**.
9. New inspection record appears in the right-side table under unit `100`.

### 7.6 Add a New Maintenance Type (and see it everywhere)
1. Navigate to **Maintenance Types**.
2. Click **+ Create new maintenance type**.
3. Enter Name (e.g., "Brake Service") and Description.
4. Click **Save**.
5. The new type immediately appears in:
   - Maintenance Types table
   - Plan modal Maintenance Type dropdown
   - Logs modal Maintenance Type dropdown
   - Bills modal log-item Maintenance Type dropdown
   - Due Maintenance advanced filter Maintenance Type dropdown

---

## 8. DATA LIFECYCLE

```
Browser tab opens
    → AppContext initializes
    → Checks sessionStorage for __seeded flag
    → If not seeded: writes all seed data to sessionStorage, sets flag
    → If already seeded: loads existing sessionStorage data

User creates/edits/deletes records
    → AppContext action called
    → React state updates
    → sessionStorage updated immediately
    → All consuming components re-render with new data

Browser tab closes / refreshes
    → sessionStorage cleared (tab close) or preserved (refresh)
    → On next fresh tab open: seed data is re-applied
```

---

## 9. SESSION STATE VS RESET

| Scenario | Behavior |
|----------|----------|
| User creates a new maintenance type | Persists for the rest of the session |
| User refreshes the page | Data persists (sessionStorage survives refresh) |
| User closes the tab | Data is lost; next open gets fresh seed data |
| User opens a second tab | Second tab gets its own fresh session (sessionStorage is per-tab) |

This is intentional for a prototype — no permanent state means no cleanup required between demo sessions.

---

## 10. SEED DATA SUMMARY

| Entity | Count |
|--------|-------|
| Maintenance Types | 7 |
| Maintenance Plans | 3 |
| Carriers | 21 |
| Vehicles | 12 |
| Trailers | 10 |
| Vendors | 12 |
| Parts | 5 |
| Maintenance Logs (Vehicle) | 3+ hardcoded rows |
| Maintenance Logs (Trailer) | 3+ hardcoded rows |
| Maintenance Bills (Vehicle) | 3+ hardcoded rows |
| Maintenance Bills (Trailer) | 3+ hardcoded rows |
| Due Maintenance Records | 8–10 (green/amber/red mix across vehicles + trailers) |
| Inspections (Vehicle) | 4 total (≈2 across two seeded vehicle units) |
| Inspections (Trailer) | 4 total (≈2 across two seeded trailer units) |

---

## 11. UI/UX PRINCIPLES

- **Uber Base, light-first** — clean, table-heavy, data-dense like a real TMS admin dashboard; dark mode is a parity toggle
- **Color and icons carry meaning** — every entity type, maintenance category, and status has a fixed hue + icon so a 14-column row can be scanned, not decoded (see `design.md §9`)
- **Color is never the only signal** — status = icon + label + color, for accessibility
- **No decorative elements** — no hero images, illustrations, or marketing copy; color is semantic only
- **One primary button per view** — filled blue, top-right of the page header
- **Secondary buttons are lighter** — outlined or ghost style
- **Row actions under three-dot menus** — never inline buttons that clutter the table
- **Tabs for Vehicle/Trailer context** — the same page serves both with a tab toggle
- **Drawers for advanced filters** — keeps the filter bar lean; power users access more via funnel icon
- **Validation on submit** — inline error messages directly below the invalid field
- **Toast on save/delete** (nice-to-have) — brief bottom-right confirmation

---

## 12. ACCEPTANCE SUMMARY

The prototype is complete when a user can:

1. Open the Vercel URL and immediately see all 7 pages with data.
2. Create a new maintenance type and see it appear in dropdowns across all pages.
3. Create a maintenance plan and see it in the Plan table and plan dropdowns.
4. Create a maintenance log from the Logs page, the Due Maintenance page, and via a bill save.
5. Create a maintenance bill with multiple log items and see the total auto-calculate.
6. Navigate to Due Maintenance and see color-coded urgency on all rows.
7. Open an Inspection unit, fill the full 40-item checklist, and save — then see it in the inspection records.
8. Export any table as a downloadable CSV.
9. Use filters on every page and clear them.
10. Close the tab and reopen — fresh seed data is shown again.
