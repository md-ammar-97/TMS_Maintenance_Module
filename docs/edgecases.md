# Edge Cases — Maintenance Module Frontend Prototype

Practical edge cases to handle. Since this is a **visual prototype with session-state only**, the bar is: "should not crash or look broken." Not: "production-grade error handling."

> Visual treatment (colors, chips, empty states) follows `design.md`. The "Due In" thresholds in §6.6 below are the **canonical** rule and are mirrored in `design.md §9.4` and `data_model.md`.

---

## 1. SESSION STATE & DATA INIT

### 1.1 First Load vs. Refresh
- **Case**: User refreshes mid-session.
- **Behavior**: `sessionStorage` survives a page refresh. Data should persist. The `__seeded` flag prevents re-seeding over the user's created records.
- **Handle**: On context init, check for `__seeded` in `sessionStorage`. If present, load from storage. If not, seed and set flag.

### 1.2 Multiple Tabs
- **Case**: User opens the app in two tabs simultaneously.
- **Behavior**: `sessionStorage` is per-tab. Each tab gets its own independent state. Records created in Tab A do not appear in Tab B.
- **Handle**: This is acceptable for a prototype. No cross-tab sync needed.

### 1.3 Corrupted sessionStorage
- **Case**: `sessionStorage` value is somehow malformed JSON (e.g., partial write).
- **Handle**: Wrap every `JSON.parse` in a `try/catch`. On error, fall back to seed data and re-seed.
```ts
try {
  return JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? fallback
} catch {
  return fallback
}
```

### 1.4 sessionStorage Quota
- **Case**: User creates hundreds of records and hits `sessionStorage` quota (~5MB).
- **Handle**: Ignore for prototype. Unlikely with seed-scale data.

---

## 2. FORM & MODAL EDGE CASES

### 2.1 Opening Edit Modal with Stale Data
- **Case**: User opens Edit on a row, another action deletes that record (unlikely in solo session, but defensive).
- **Handle**: On modal open, look up the item by ID. If not found, close modal and show toast "Record no longer exists."

### 2.2 Save Without Required Fields
- **Case**: User clicks Save with empty required fields.
- **Handle**: Run validation before any state mutation. Show inline red error below each missing field. Do not close modal. Scroll to first error if modal is long.

### 2.3 Numeric Fields with Non-Numeric Input
- **Case**: User types "abc" in Mileage or Amount.
- **Handle**: Use `type="number"` on inputs. Additionally strip non-numeric on blur. Show "Must be a number" if invalid on submit.

### 2.4 Negative Numbers
- **Case**: User enters `-500` for Amount or Interval.
- **Handle**: For prototype, add `min="0"` to number inputs. Show "Must be 0 or greater" on submit validation.

### 2.5 Very Long Text in Inputs
- **Case**: User pastes a 500-char string into a Name field.
- **Handle**: Add `maxLength` to inputs (e.g., `maxLength={100}` for names, `maxLength={500}` for descriptions). Table cells should truncate with `truncate` CSS class and show full text on hover via `title` attribute.

### 2.6 Duplicate Names
- **Case**: User creates a Maintenance Type named "Oil Change" (already seeded).
- **Handle**: For prototype, allow duplicates. No uniqueness validation needed — the display will just show two rows with the same name.

### 2.7 Closing Modal Without Saving
- **Case**: User fills in fields, then clicks Cancel or the X button.
- **Handle**: Discard form state. No confirmation dialog needed for prototype. Simply reset form on close.

### 2.8 Modal Opened from Two Places
- **Case**: "Create Log" can be opened from Logs page AND from Due Maintenance row action. Both use the same `LogModal` component.
- **Handle**: Pass `prefillData?: Partial<MaintenanceLog>` prop to the modal. When opened from Due Maintenance, pass `vehicleId`, `maintenancePlanId`, `maintenanceTypeId` as prefill. When opened from Logs page, prefill is empty.

### 2.9 Total Amount in Bill Modal
- **Case**: User removes all log items from a bill. Total Amount should show `$0.00`, not crash.
- **Handle**: Default to `0` when `logItems` array is empty. `totalAmount = logItems.reduce((sum, item) => sum + (item.amount || 0), 0)`.

### 2.10 Part field visibility in Bill Log Items
- **Case**: User switches Maintenance Log Type from "Service" to "Part" and back.
- **Handle**: Use conditional render (`logType === 'Part'`). Clear the hidden field's value when switching type to avoid stale selection being submitted.

### 2.11 Conditional Mileage on Vehicle vs Trailer
- **Case**: Bill and Log modals require Mileage on the Vehicle tab but hide it on the Trailer tab. A user fills Mileage on Vehicle, switches to Trailer, and saves.
- **Handle**: Mileage is **required only when the active unit type is Vehicle**. On switching to Trailer, hide the field and clear its value so a stale Vehicle mileage is never submitted on a Trailer record. Validation must check the active tab, not a fixed rule.

---

## 3. TABLE & FILTER EDGE CASES

### 3.1 Empty Table After Filtering
- **Case**: User applies filters that match no records.
- **Handle**: Show an empty state row:
  ```
  [search icon]
  No records found
  Try adjusting your filters or clear them.
  [Clear Filters button]
  ```
  Style: centered in table body, `color: var(--content-tertiary)`, `padding: 64px 0` (`design.md §11.10`).

### 3.2 Empty Table on First Load (No Seed Data)
- **Case**: Seed data fails to load (e.g., sessionStorage error on first visit).
- **Handle**: Same empty state as above but with message "No records yet. Create your first one."

### 3.3 Filter State Persisting After Tab Switch
- **Case**: User filters by "Vehicle 100" on the Vehicle tab of Logs, then switches to Trailer tab.
- **Handle**: Clear or reset the vehicle/trailer number filter when switching tabs. Other filters (date, type) can persist across tabs.

### 3.4 Pagination When Records Are Deleted
- **Case**: User is on page 3, deletes all records on that page. Page 3 no longer exists.
- **Handle**: After deletion, clamp current page to `Math.max(1, Math.min(currentPage, totalPages))`. Auto-navigate to last valid page.

### 3.5 Rows Per Page Change
- **Case**: User is on page 4 with 10 rows/page, switches to 50 rows/page.
- **Handle**: Reset to page 1 on rows-per-page change.

### 3.6 Export on Empty Table
- **Case**: User exports after filtering returns 0 rows.
- **Handle**: Export the empty CSV with headers only. File should still download (not error). Optionally show toast: "Exported 0 records."

### 3.7 Export with Special Characters
- **Case**: A description field contains commas or quotes (e.g., `Tire replacement, front axle`).
- **Handle**: Wrap all CSV cell values in double quotes and escape internal quotes: `"Tire replacement, front axle"`.

---

## 4. CROSS-PAGE LINKAGE EDGE CASES

### 4.1 Deleting a Maintenance Type That Is In Use
- **Case**: User deletes "Oil Change" type, but existing logs and plans reference it.
- **Handle**: For prototype, allow the delete. Existing records will have a stale `maintenanceTypeId`. When displaying, fall back to showing the raw ID or "Unknown Type" if the type is no longer found in the types list. Do not cascade-delete related records.

### 4.2 Deleting a Maintenance Plan Referenced by Due Maintenance
- **Case**: Due Maintenance records reference a plan that gets deleted from the Plans page.
- **Handle**: Same as above — show "Unknown Plan" in Due Maintenance. No cascade.

### 4.3 Creating a Log from Due Maintenance — Modal Prefill
- **Case**: The due maintenance record has a `maintenancePlanId` but the plan's `maintenanceTypeId` no longer exists (was deleted).
- **Handle**: Prefill what is available. If `maintenanceTypeId` resolves to a valid type, prefill it. If not, leave the Maintenance Type dropdown empty and let the user select.

### 4.4 Bill Save → Auto-creating Logs
- **Case**: Bill has 3 log items. On Save, 3 maintenance log records should be auto-created.
- **Handle**: In the `addBill` context action, after creating the bill, loop through `logItems` and call `addLog` for each. Link the `billRefNumber` on each created log. This is the most complex cross-page interaction — ensure the logs appear on the Logs page with the bill's ref number in the "Bill Ref Number" column.

### 4.5 Vendor Created in Logs Modal — Appears in Bills
- **Case**: User creates a new vendor from the Logs modal. Later opens a Bill modal.
- **Handle**: Because both read from `AppContext.vendors`, the new vendor is already available in the Bills dropdown. No special handling needed if context is correctly shared.

---

## 5. INSPECTION PAGE EDGE CASES

### 5.1 No Unit Selected on Right Panel
- **Case**: Page loads, no unit is selected yet. Right panel is empty.
- **Handle**: Show a placeholder state:
  ```
  Select a unit from the list to view inspection records.
  ```
  Style: centered in right panel, gray text, no buttons visible.

### 5.2 Switching Between Vehicle and Trailer Tab
- **Case**: User has vehicle `100` selected, switches to Trailer tab.
- **Handle**: Clear the selected unit. Right panel returns to placeholder state. Left sidebar now shows trailer numbers.

### 5.3 Mark All OK on Inspection Form
- **Case**: User clicks "Mark all OK" — all 40 (or 21) items should update simultaneously.
- **Handle**: `setItems(prev => prev.map(item => ({ ...item, result: 'OK' })))`. Visually all NA/Def buttons deselect, OK buttons activate.

### 5.4 Save Inspection Without Marking Any Items
- **Case**: User saves with all items still set to default (NA).
- **Handle**: Allow save. NA is a valid result. Only validate required header fields (Carrier, Vehicle/Trailer, Inspection Date, Inspection By).

### 5.5 Back to List After Save
- **Case**: After saving a new inspection, user is routed back to the Inspection Compliance page.
- **Handle**: The previously selected unit should still be selected on return, and the new inspection record should appear in the table. Pass the selected unit ID via router state or URL param: `/maintenance/inspection?unit=100&type=vehicle`.

### 5.6 Annual Report Download (Mock)
- **Case**: User selects year 2025, clicks Download.
- **Handle**: `window.print()` opens the browser print dialog for the current inspection records view. Alternatively, show a toast: "Generating annual report for 2025..." then open a blank printable page.

---

## 6. UI / VISUAL EDGE CASES

### 6.1 Very Long Carrier or Vendor Names
- **Case**: "A&R Garcia Trucking, LLC." in a narrow column.
- **Handle**: All table cells use `truncate` (CSS `text-overflow: ellipsis`, `overflow: hidden`, `white-space: nowrap`). Show full name on hover via native `title` attribute.

### 6.2 Sidebar Section Collapse
- **Case**: All sidebar sections are collapsed.
- **Handle**: A MAINTENANCE section header should still be visible. The section never fully disappears.

### 6.3 Long Modal with Many Fields (Bill Modal)
- **Case**: Bill modal with 5+ log items gets very tall.
- **Handle**: Modal body is `overflow-y: auto`. Modal has fixed header and footer. Only the body scrolls. Max-height should be `calc(100vh - 120px)`.

### 6.4 Amount Display Formatting
- **Case**: Amount `1234567.8` should display as `$1,234,567.80`.
- **Handle**: Use `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` for display. Store as raw number in state.

### 6.5 Date Display Formatting
- **Case**: ISO date `"2026-06-26T00:00:00.000Z"` should display as `Jun 26, 2026`.
- **Handle**: Use `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`. Keep ISO string in state; format only at display time.

### 6.6 "Due In" Value Display
- **Case**: Due In is `0 miles` (exactly due now) — is it Upcoming or Overdue?
- **Handle (canonical, = `design.md §9.4`)**: Mileage mode — `≤ 0` → Overdue (red, `arrow-down`); `1–2,000 mi` → Upcoming (amber, `clock`); `> 2,000 mi` → OK (green, `check`). Date mode — `past` → Overdue; `within 30 days` → Upcoming; `> 30 days` → OK. Exactly `0` falls in the `≤ 0` bucket → **Overdue**.

### 6.7 Dropdown with Many Options (21 Carriers)
- **Case**: Carrier dropdown has 21 entries — needs to be scrollable.
- **Handle**: Dropdown list: `max-height: 240px`, `overflow-y: auto`. Use a search input at top of dropdown for carrier and vehicle selectors with many options.

### 6.8 Toggle Switch in Table vs. Modal
- **Case**: Plan Status is shown as a badge in the table but as a toggle in the modal.
- **Handle**: In table → show as green "Active" / gray "Inactive" badge. In modal → show as toggle switch. Both read/write the same `status: boolean` field.

### 6.9 Three-dot Menu on Last Row of Table
- **Case**: Last row's three-dot menu dropdown might render off-screen below.
- **Handle**: Use `shadcn/ui DropdownMenu` with `side="top"` or auto-placement. The component handles this automatically.

### 6.10 PullRay Integration Logs Button
- **Case**: User clicks this secondary button.
- **Handle**: Show a toast or simple modal:
  > "PullRay Integration Logs are not available in this prototype. This button connects to the live PullRay integration in production."

---

## 7. NAVIGATION EDGE CASES

### 7.1 Direct URL Access
- **Case**: User navigates directly to `/maintenance/bills` without going through the home page.
- **Handle**: AppContext initializer runs on every page load. sessionStorage is checked → if `__seeded` exists, data loads normally. If not (fresh tab), seed data loads. Either way, the page has data.

### 7.2 Root URL `/`
- **Case**: User visits the root URL.
- **Handle**: Redirect to `/maintenance/plan` via `redirect()` in `app/page.tsx`.

### 7.3 Unknown Route
- **Case**: User navigates to `/maintenance/unknown`.
- **Handle**: Next.js default 404 page. For prototype, this is fine — no custom 404 needed.

### 7.4 Browser Back After Saving Inspection
- **Case**: User saves inspection and is taken back to the list. They press browser back.
- **Handle**: They land on the create inspection form with a blank form (no re-submit risk since state is not in the URL). The inspection record they saved is already persisted in sessionStorage.

---

## 8. NOT WORTH HANDLING IN PROTOTYPE

These are explicitly out of scope — do not add code for these:

- Concurrent edit conflicts (no multi-user)
- Optimistic update rollbacks (no network)
- Offline detection
- Input sanitization / XSS prevention (prototype only, no user-to-user data)
- Rate limiting
- Session expiry warnings
- Real file uploads
- Real PDF generation errors
- Accessibility (ARIA) completeness beyond what shadcn/ui provides by default
