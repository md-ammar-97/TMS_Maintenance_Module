# Design System — Maintenance Module Frontend Prototype
### Based on AxesTrack / FreightNXT TMS UI — Dark Theme (Technical Precision)

---

## 1. OVERVIEW

The Maintenance Module uses a "Technical Precision" dark-first design system extracted from the AxesTrack TMS reference screenshots. The UI supports both **dark mode** (default) and **light mode** via a toggle. All colors are driven by CSS custom properties — components do not hardcode colors.

**Theme switching**: A Sun/Moon button in the TopBar toggles the `.dark` class on `<html>`. Preference is stored in `localStorage` and defaults to `dark`.

---

## 2. COLOR SYSTEM (CSS Custom Properties)

### 2.1 Dual-Mode Design Tokens

| Token | Dark Value | Light Value | Usage |
|-------|-----------|-------------|-------|
| `--bg` | `#0b0e15` | `#f9fafb` | Page / body background |
| `--surface` | `#1c1f27` | `#ffffff` | Cards, modals, inputs |
| `--surface-dim` | `#181b23` | `#f3f4f6` | Table headers, dimmed areas |
| `--surface-high` | `#272a32` | `#e5e7eb` | Hover highlights |
| `--border` | `#333333` | `#e5e7eb` | Dividers, input borders |
| `--border-subtle` | `#414754` | `#f3f4f6` | Table row separators |
| `--text-1` | `#e0e2ed` | `#111827` | Primary text, headings |
| `--text-2` | `#c1c6d7` | `#374151` | Body text, table cells |
| `--text-3` | `#8b90a0` | `#6b7280` | Labels, secondary text |
| `--text-4` | `#5a5f70` | `#9ca3af` | Placeholders, icons |
| `--sidebar-bg` | `#181b23` | `#ffffff` | Sidebar background |
| `--topbar-bg` | `#111111` | `#ffffff` | Top bar background |
| `--primary` | `#0070f3` | `#2563eb` | Primary buttons, active nav |
| `--primary-hover` | `#005cc8` | `#1d4ed8` | Button hover state |

### 2.2 Status Badge Colors (Theme-Agnostic)

All badges use semi-transparent backgrounds so they work in both light and dark:

| Status | Background | Text | Usage |
|--------|-----------|------|-------|
| Active / Paid / Blue | `rgba(0,112,243,0.12)` | `#60a5fa` | Blue pill |
| OK / Success | `rgba(16,185,129,0.12)` | `#34d399` | Green pill |
| Upcoming / Warning | `rgba(245,166,35,0.12)` | `#fbbf24` | Amber pill |
| Overdue / Error | `rgba(238,68,68,0.12)` | `#f87171` | Red pill |
| Inactive / Neutral | `rgba(139,144,160,0.1)` | `#8b90a0` | Gray pill |
| InShop / Purple | `rgba(139,92,246,0.15)` | `#a78bfa` | Purple pill |
| Pending | `rgba(245,166,35,0.12)` | `#fbbf24` | Amber pill |

### 2.3 Due Maintenance "Due In" Chips

Color-coded by proximity to due date:

| Condition | Chip Color | Example |
|-----------|-----------|---------|
| Overdue (negative) | Red | `-1200 mi` |
| Warning (≤ 500 units) | Yellow | `+200 mi` |
| OK (> 500 units away) | Green | `+2900 mi` |

---

## 3. TYPOGRAPHY

- **Font stack**: `'Geist', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Anti-aliasing**: `-webkit-font-smoothing: antialiased`

| Element | Size | Weight | Token |
|---------|------|--------|-------|
| Page title | `20px` | `600` | `--text-1` |
| Table header | `11px`, uppercase | `600` | `--text-3` |
| Table cell | `13px` | `400` | `--text-2` |
| Nav item | `12px` | `400` (inactive) / `500` (active) | `--text-3` / white |
| Form label | `11px`, uppercase | `500` | `--text-3` |
| Input text | `13px` | `400` | `--text-1` |
| Badge text | `11px` | `500` | varies |
| Button text | `13px` | `500` | white / `--text-2` |
| Stat value | `24–28px` | `700` | `--text-1` |

---

## 4. LAYOUT

### 4.1 Overall Structure

```
┌──────────────────────────────────────────────────────────┐
│  TOP BAR  (52px, --topbar-bg, border-bottom --border)    │
├───────────────┬──────────────────────────────────────────┤
│               │                                          │
│   SIDEBAR     │         MAIN CONTENT                     │
│   (160px)     │         (flex-1, overflow-y auto)        │
│  --sidebar-bg │         bg: --bg                         │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘
```

### 4.2 Sidebar

**Width**: `160px`  
**Background**: `var(--sidebar-bg)` — `#181b23` dark / `#ffffff` light  
**Border-right**: `1px solid var(--border)`

**Structure (top → bottom):**
1. **Logo area** — "FreightNXT" bold + "(by Axestrack)" tiny gray; bottom border
2. **Create Work Order button** — full-width, primary blue, `+` icon; 3px vertical padding
3. **Nav items** — icon (14px) + label (12px); active item gets full blue bg + white text
4. **Footer** — Settings + Support icon-text buttons; top border; dimmer text

**Nav item states:**

| State | Background | Text | Icon |
|-------|-----------|------|------|
| Default | transparent | `--text-3` | `--text-4` |
| Hover | `--surface-high` | `--text-1` | `--text-3` |
| Active | `--primary` (full) | white | white |

### 4.3 Top Bar

**Height**: `52px`  
**Background**: `var(--topbar-bg)` — `#111111` dark / `#ffffff` light  
**Border-bottom**: `1px solid var(--border)`

**Left**: AXESTRACK wordmark + tagline  
**Center**: Search input (flexible width)  
**Right**: Theme toggle (Sun ↔ Moon) · Bell with red dot · User avatar + name/role + chevron

---

## 5. COMPONENTS

### 5.1 Page Header

```
┌─────────────────────────────────────────────────────────┐
│  Page Title (20px bold)                   [Actions row] │
│  Subtitle (12px --text-3)                               │
├─────────────────────────────────────────────────────────┤
│  [Filter controls row: dropdowns, search, tabs]         │
└─────────────────────────────────────────────────────────┘
```

Background: `var(--surface)`, border-bottom: `var(--border)`

### 5.2 Data Table

- **Header row**: `var(--surface-dim)` bg; `--text-3` 11px uppercase; `1px solid var(--border)` bottom
- **Body rows**: height `48px`; separator `1px solid var(--border-subtle)`; hover → `var(--surface-high)`
- **Selected row**: `rgba(0,112,243,0.08)` bg
- **Empty state**: centered `--text-4` message with 48px padding

### 5.3 Modals / Dialogs

- **Overlay**: `rgba(0,0,0,0.6)` fixed inset, z-50
- **Modal**: `var(--surface)` bg; `var(--border)` border; `10px` border-radius; centered via `translate(-50%,-50%)`; max-height 90vh with scroll
- **Header**: title (`--text-1` 15px semibold) + X close button; border-bottom `var(--border)`
- **Form fields**: `h-9` inputs, `var(--surface)` bg, `var(--border)` border, `var(--text-1)` text
- **Sheet/Drawer**: slides from right; same surface colors; height 100vh

### 5.4 Select / Dropdown

- **Trigger**: same as input (h-9, surface bg, border)
- **Content portal**: `var(--surface)` bg; `var(--border)` border; 8px radius; shadow `0 8px 24px rgba(0,0,0,0.3)`
- **Items**: hover → `var(--surface-high)` bg; checkmark in `--primary`

### 5.5 Badges

Pill shape: `px-2 py-0.5`, `rounded-full`, `11px`, semi-transparent bg + matching text (see §2.2)

### 5.6 Buttons

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | `var(--primary)` | white | none |
| Secondary / Outline | `var(--surface)` | `--text-2` | `var(--border)` |
| Destructive | `#dc2626` | white | none |
| Ghost | transparent | `--text-2` | none |

### 5.7 Tab Bars (Pill / Underline)

**Pill tabs** (Due Maintenance, Logs):
- Container: `var(--surface-dim)` bg, rounded pill wrapper
- Active: `var(--primary)` bg + white text
- Inactive: transparent + `--text-3`

**Underline tabs**:
- Active: `border-b-2 border-[var(--primary)]` + `--primary` color
- Inactive: transparent border + `--text-3`

### 5.8 Inspection Toggle Buttons

Three-segment control per inspection item: **OK | DEF | NA**

| State | Background | Text |
|-------|-----------|------|
| Default | `var(--surface-dim)` | `--text-3` |
| OK active | `#065f46` | `#d1fae5` |
| DEF active | `#7f1d1d` | `#fee2e2` |
| NA active | `var(--surface-high)` | `--text-2` |

---

## 6. PAGE-BY-PAGE DESIGN

### 6.1 Maintenance Plan

**Filters**: Active/Inactive/All toggle tabs · Search input · + Add Plan button

**Table columns**: Name · Maintenance Type · Interval Type · Interval · Status · Description · Total Overdue · Actions (⋮ menu)

**Status badges**: Active = blue; Inactive = gray

**Actions menu**: Edit · Delete (destructive)

### 6.2 Maintenance Logs

**Tabs**: Vehicle | Trailer (pill style, top-left)

**Stat card** (top-right): Total Amount in dollar format with colored icon

**Filters**: Date range · Type · Search · Advanced Filters panel (slides from right) — includes Date Range, Tire Position, Amount Range sliders

**Table columns**: Date · Vehicle/Trailer · Carrier · Maintenance Type · Log Type badge (Preventive=blue, Repair=amber) · Amount · Notes · Actions

**Log type badges**: semi-transparent, pill shape

### 6.3 Maintenance Types

**Two-letter avatar**: colored circle with initials (orange, purple, violet variants)  
**Inline actions**: pencil (edit) + trash (delete) buttons visible on row hover  
**Table columns**: Actions · Name · Description

### 6.4 Bills

**Filters**: Date range picker · All Vendors dropdown · All Statuses dropdown · Search

**Table columns**: Bill Ref · Status badge · Vendor · Carrier · Unit Number · Bill Date · Total Amount (right-aligned)

**Status**: Paid=blue · Pending=amber · Overdue=red

**Multi-line-item form**: Add/remove service or part line items; auto-creates log entries on save

### 6.5 Parts Catalog

**Selection**: Checkbox column (multi-select); item count chip  
**Filters**: Filter by Category button  
**Inline edit**: pencil icon in row  
**Table columns**: ☐ · Part Name · SKU/ID · Description · Edit

### 6.6 Due Maintenance

**Tabs**: By Mileage | By Date (pill, switches interval type)

**"Due In" chip**: color-coded distance/date remaining (red/yellow/green)

**Table columns**: Unit · Carrier · Plan Name · Maintenance Type · Interval · Last Done · Due At · Due In chip · Status badge

**Pagination**: bottom controls with page count

### 6.7 Inspection / Inspection Compliance

**Left panel** (unit list): UNIT-XXXX entries; selected item highlighted in primary blue

**Right panel**:
- Current status card: "Passed" blue badge / "Needs Minor Repair" amber badge + last inspection date
- Inspection Records table: Date · Inspector · Status badge · Defects · Actions
- "+ New Inspection" button routes to `/maintenance/inspection/new` (full-page form)

**New Inspection form**: vehicle/trailer toggle · carrier + unit selects · 40-item (vehicle) or 21-item (trailer) checklist · "All OK" / "All N/A" bulk buttons

---

## 7. INTERACTION PATTERNS

- **Row hover**: `var(--surface-high)` background; actions menu appears (opacity 0 → 1)
- **Row click**: opens detail sheet (logs, bills) or navigates to detail page (inspection)
- **Delete flow**: ⋮ menu → Delete → ConfirmDeleteDialog → confirmed → toast "Deleted successfully"
- **Form save**: validates required fields inline → saves to Context + sessionStorage → closes modal → toast "Saved"
- **CSV Export**: client-side Blob download, no backend
- **Pagination**: client-side slice; 25 rows per page default

---

## 8. DARK / LIGHT MODE IMPLEMENTATION

### 8.1 Toggle Mechanism
1. `ThemeProvider.tsx` reads `localStorage.getItem('theme')` on mount (defaults to `'dark'`)
2. Sets/removes `.dark` class on `document.documentElement`
3. `useTheme()` hook exposes `{ theme, toggle }` — TopBar uses it for the Sun/Moon button

### 8.2 CSS Architecture
```css
/* globals.css */
@custom-variant dark (&:where(.dark, .dark *));

:root { /* light token values */ }
.dark { /* dark token values */ }

/* All components use var(--token) — no direct color literals */
```

### 8.3 Component Rules
- Never use `bg-white`, `bg-gray-*`, `text-gray-*`, `border-gray-*` hardcoded Tailwind classes
- Always use `style={{ background: 'var(--surface)' }}` or the CSS variable equivalents
- Overlay portals (Radix dialogs, dropdowns) use `.modal-content`, `.sheet-content`, `.dropdown-content`, `.popover-content` global classes that read CSS variables
- Status badges use semi-transparent RGBA backgrounds that look correct in both themes

---

## 9. ANIMATIONS

| Animation | Duration | Easing | Trigger |
|-----------|---------|--------|---------|
| Dialog open | `150ms` | ease | `scaleIn` keyframe |
| Sheet slide-in | `200ms` | ease | `slideInRight` |
| Overlay fade | `150ms` | ease | `fadeIn` |
| Dropdown appear | `120ms` | ease | `slideInFromBottom` |

---

## 10. SCROLLBARS

Custom thin scrollbars throughout:
- Width/height: `5px`
- Track: transparent
- Thumb: `var(--border)` with `3px` border-radius
- Thumb hover: `var(--border-subtle)`
