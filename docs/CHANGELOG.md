# CHANGELOG — Spec Revision

This revision does two things: (A) **migrates the design system** from the dark "AxesTrack Technical Precision" theme to an **Uber Base** foundation organized as a **Figma token library**, and (B) **reconciles the logical inconsistencies** that had crept across the seven documents. Field-level conflicts were resolved against `problem.md` (the cleaned requirements) as the source of truth.

---

## A. DESIGN-SYSTEM MIGRATION

| Area | Before | After |
|------|--------|-------|
| Foundation | AxesTrack dark "Technical Precision" | **Uber Base** (color, type, spacing, elevation scales) |
| Token model | Flat CSS vars, dark-only literals | **Three Figma collections** — Primitives → Semantic (Light/Dark modes) → Component |
| Default mode | Dark | **Light** (dark is parity mode) |
| Color usage | Mostly monochrome surfaces + a few status pills | **Data Encoding System** — fixed hues + icons per entity, per maintenance category, per status; "Due In" chip; mono surfaces only as background |
| Density legibility | "wall of black-and-white" | Leading colored anchor per row, category chips, column-group hairlines, tabular numerals, sticky anchor/actions columns |
| Buttons | Inconsistent height/radius/padding | Fixed anatomy: `radius/200`, sizes 32/40/48, one primary per view, defined placement |
| Overlap | Filter bars/modals/menus collided | Responsive filter wrap, pinned modal header/footer with scrolling body, collision-aware row menus, `min-width:0` main column, z-index scale |

See `design.md` for the full system. The new design system is **library-agnostic at the token layer** but still implemented on Next.js + Tailwind + shadcn (Base Web is noted as an alternative in `architecture.md`, not required).

---

## B. LOGICAL-FLOW & FIELD FIXES

Each fix below is now reflected consistently in every doc that referenced it.

1. **Plan filter "Maintenance Type" options were wrong/merged.**
   Old `problem.md §5.4` listed `OilChange, TuneUp, Service, Brakes, TireReplacement, TireRepair, Repair, Engine, TrailerService, Towing, Wash, Inspection, Misc` — none of which match the 7 seeded types. Two different dropdown specs had been merged.
   → **Fix:** every Maintenance Type dropdown is **derived from the shared Maintenance Types list** (`All` + the 7 seeds + any runtime additions). No hardcoded option lists anywhere.

2. **Vehicle / Trailer dropdown lists differed page-to-page.**
   Logs modal, Bills modal, Inspection, and Due Maintenance each hardcoded a *different partial* list (and Inspection duplicated `143`).
   → **Fix:** all unit dropdowns derive from the shared `vehicles` / `trailers` data (12 / 10 records). "Deactivated" entries are represented via `status` and shown with an `(Inactive)` suffix — not hardcoded duplicate rows.

3. **Trailer inspection item count wobbled (20 vs 21).**
   The raw prompt said "1 through 20" in one place and listed 21 items; `design.md` once said "40 (or 21)".
   → **Fix:** **21** everywhere. `data_model.md §4` is canonical (21 items).

4. **"Due In" thresholds contradicted across docs.**
   `design.md` said warning ≤ 500 / OK > 500; `edgecases.md` said upcoming 1–2,000 / OK > 2,000 / date within 30 days.
   → **Fix:** one canonical rule (`design.md §9.4`): **Mileage** — Overdue ≤ 0, Upcoming 1–2,000 mi, OK > 2,000 mi. **Date** — Overdue if past, Upcoming ≤ 30 days, OK > 30 days. All docs now reference it.

5. **"Log Status" (Mapped / UnMapped) was undefined.**
   → **Fix:** a log is **Mapped** if it carries a `billId` (created by / linked to a bill), else **UnMapped**. Rendered as the `accent` / `neutral` badge.

6. **Plan "Total Overdue" column was undefined.**
   → **Fix:** it is the **count of units overdue against that plan**. `0` renders as `—`; `> 0` renders as a `negative` chip with `alert-triangle`.

7. **"External Maintenance Type" column was ambiguous.**
   → **Fix:** it is the free-text `externalMaintenanceType` field; renders `—` when empty (never blank, never `0`).

8. **Vendor had "Vendor ID" twice (General + Accounting).**
   The raw spec literally listed it in both sections.
   → **Fix:** these are **two distinct fields** — `vendorId` (External Vendor ID, General section) and `accountingVendorId` (Accounting section). Labels disambiguated in `data_model.md` and `problem.md`.

9. **Two different "status" semantics shared one name.**
   Plan/Vendor `status` is a **boolean** (Active/Inactive). Vehicle/Trailer `status` is an **enum** (`Active | Inactive | InShop`).
   → **Fix:** kept both but documented explicitly; the badge mapping for each is spelled out in `design.md §9.3`.

10. **Inspector field was sometimes blank, sometimes a name list.**
    → **Fix:** a **seeded inspector list** (`John Miller, Sarah Lee, David Brown, Mike Johnson`) added to `data_model.md` as a constant; the "Inspection by" dropdown reads from it.

11. **Seed counts disagreed.**
    `context.md` implied "2 inspections per unit" (huge); `data_model`/`implementation` said 2 vehicle + 2 trailer total.
    → **Fix:** explicit small seed counts in `context.md §10`, matching `data_model.md`.

12. **Bill Mileage required on Vehicle but field removed on Trailer.**
    → **Fix:** Mileage validation is **conditional** — required only when the active tab is Vehicle; the field is hidden (and its value cleared) on Trailer.

13. **Inspection "Defects" / record status were implied but unspecified.**
    → **Fix:** a record's status is **derived** — `Passed` if 0 `Def` items, else `Needs Minor Repair` (warning). Defect count column added to the records table.

14. **Parts "Export to Excel" vs the CSV-only constraint.**
    → **Fix:** export is **CSV** (labeled "Export"); the prototype produces a `.csv`, not a real `.xlsx`. Constraint noted on the Parts page.

15. **Dispatch-validation toggles implied behavior.**
    `Validate Upcoming/Due Maintenance At Dispatch` switches store booleans but **do nothing** in the prototype (the dispatch engine is out of scope). Stated explicitly so reviewers don't expect logic.

16. **`implementation.md` had encoding corruption (mojibake).**
    → **Fix:** rewritten clean; the dark-theme CSS block is replaced with the Uber Base token CSS.

17. **Sidebar width 160px was too narrow for "Maintenance Types".**
    → **Fix:** 240px (collapsible to a 64px icon rail < 1024px).

---

## C. FILES IN THIS PACKAGE

| File | State |
|------|-------|
| `design.md` | **Full rewrite** — Uber Base + Figma tokens + Data Encoding System + layout fixes |
| `problem.md` | Corrected for internal consistency (fixes #1, #8, #14, #15) |
| `data_model.md` | Reconciled fields (#3, #7, #8, #9, #10, #13) + display-semantics map |
| `context.md` | Flow + seed-count fixes (#11), de-darked |
| `architecture.md` | Re-themed, flow-fixed, Base/Figma notes |
| `implementation.md` | Clean rewrite, Base token CSS, fixes applied |
| `edgecases.md` | Thresholds aligned (#4), color refs updated, fixes #5/#12/#13 |
| `CHANGELOG.md` | This file |
