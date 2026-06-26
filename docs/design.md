# Design System — Maintenance Module Frontend Prototype
### Based on AxesTrack / FreightNXT TMS UI

---

## 1. OVERVIEW

The Maintenance Module must match the existing AxesTrack TMS design system exactly. This document defines every visual detail extracted from the reference screenshots: colors, typography, layout, components, spacing, and interaction patterns. All implementation should follow this guide to ensure the module looks native to the existing platform.

---

## 2. COLOR PALETTE

### 2.1 Core Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `blue-primary` | `#2563EB` | Primary buttons, active nav item text, links, icon accents |
| `blue-hover` | `#1D4ED8` | Primary button hover state |
| `blue-light-bg` | `#EFF6FF` | Active sidebar nav item background, page header tint |
| `blue-border` | `#BFDBFE` | Active sidebar nav item left border accent |
| `blue-icon-bg` | `#DBEAFE` | Icon container backgrounds on stat cards (blue variant) |

### 2.2 Status Colors

| Status | Badge Background | Badge Text | Usage |
|--------|-----------------|------------|-------|
| In Transit / Active | `#DBEAFE` | `#1D4ED8` | Blue pill badge |
| Completed / Paid | `#D1FAE5` | `#065F46` | Green pill badge |
| Open / Pending | `#F3F4F6` | `#374151` | Neutral gray pill badge |
| Overdue / Error | `#FEE2E2` | `#991B1B` | Red pill badge |
| Upcoming / Warning | `#FEF3C7` | `#92400E` | Amber pill badge |
| Inactive | `#F3F4F6` | `#6B7280` | Light gray pill |

### 2.3 Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `white` | `#FFFFFF` | Page background, cards, modals, table rows |
| `gray-50` | `#F9FAFB` | Table header row background, input backgrounds |
| `gray-100` | `#F3F4F6` | Dividers, hover states on rows |
| `gray-200` | `#E5E7EB` | Borders on inputs, table borders, card borders |
| `gray-300` | `#D1D5DB` | Disabled input borders |
| `gray-400` | `#9CA3AF` | Sidebar section header labels, placeholder text |
| `gray-500` | `#6B7280` | Secondary text, inactive nav items, field labels |
| `gray-700` | `#374151` | Body text, table cell content |
| `gray-900` | `#111827` | Page titles, primary headings |

### 2.4 Stat Card Icon Colors

Each stat card uses a distinct icon color matching the category:

| Metric type | Icon Background | Icon Color |
|-------------|----------------|------------|
| Total / Primary | `#DBEAFE` | `#2563EB` (blue) |
| Available / Success | `#D1FAE5` | `#059669` (green) |
| Assigned / Purple | `#EDE9FE` | `#7C3AED` (violet) |
| In Transit / Orange | `#FEF3C7` | `#D97706` (amber) |
| Drop In Transit / Teal | `#CCFBF1` | `#0D9488` (teal) |
| Completed / Green | `#D1FAE5` | `#059669` (green) |
| Cancelled / Red | `#FEE2E2` | `#DC2626` (red) |

---

## 3. TYPOGRAPHY

### 3.1 Font

- **Primary font**: System sans-serif stack — `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- All text is left-aligned by default except numeric columns which are right-aligned.

### 3.2 Type Scale

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Page title | `22px` / `1.375rem` | `700` | `#111827` | Preceded by a square icon badge |
| Section header (sidebar) | `11px` / `0.6875rem` | `600` | `#9CA3AF` | Uppercase, letter-spacing 0.05em |
| Nav item label | `13px` / `0.8125rem` | `400` (inactive) / `500` (active) | `#6B7280` / `#2563EB` | — |
| Table column header | `12px` / `0.75rem` | `500` | `#6B7280` | Uppercase or title-case |
| Table cell content | `13px` / `0.8125rem` | `400` | `#374151` | — |
| Stat card label | `11px` / `0.6875rem` | `500` | `#6B7280` | Uppercase |
| Stat card value | `28px` / `1.75rem` | `700` | Matches icon color | Large, bold number |
| Stat card sublabel | `12px` / `0.75rem` | `400` | `#9CA3AF` | Below value |
| Modal section title | `13px` / `0.8125rem` | `600` | `#374151` | — |
| Form field label | `11px` / `0.6875rem` | `500` | `#6B7280` | Uppercase, with `*` suffix for required |
| Input text | `13px` / `0.8125rem` | `400` | `#111827` | — |
| Button text (primary) | `13px` / `0.8125rem` | `500` | `#FFFFFF` | — |
| Button text (secondary) | `13px` / `0.8125rem` | `500` | `#374151` | — |
| Badge text | `11px` / `0.6875rem` | `500` | Varies | Pill shape |

---

## 4. LAYOUT

### 4.1 Overall Structure

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAVBAR (height: 52px, white, full-width)            │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│   SIDEBAR    │         MAIN CONTENT AREA                 │
│  (240px)     │         (flex-1, overflow-y auto)         │
│              │                                           │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

- Sidebar is fixed-height, scrollable independently.
- Main content area has a very light blue-tinted header strip directly below the top navbar.
- The sidebar can collapse; a `<` chevron button appears at the top right of the sidebar to toggle.

### 4.2 Sidebar

**Width**: `240px` (expanded), `64px` (collapsed — icons only)  
**Background**: `#FFFFFF`  
**Right border**: `1px solid #E5E7EB`

**Structure:**
```
┌─────────────────────────┐
│ FreightNXT              │  ← App name (bold) + "(by Axestrack)" (small, gray)
│ (by Axestrack)     [<]  │  ← Collapse chevron button, top-right
├─────────────────────────┤
│ ACCOUNTS            ˅   │  ← Section header (uppercase, gray-400) + collapse chevron
│   Customers             │
│   Loads                 │
│   Locations             │
├─────────────────────────┤
│ CRM                 ˅   │
├─────────────────────────┤
│ FLEET               ˅   │
│   Carriers              │
│   Drivers               │
│   Driver Teams          │
│   Terminal              │
│   Trailers              │
│   Vehicles              │
├─────────────────────────┤
│ MASTERS             ˅   │
├─────────────────────────┤
│ REPORTS             ˅   │
│   Dashboard         ●   │  ← Active item (blue left border, blue bg, blue text)
│   Driver Edging Report  │
│   Driver Score Card     │
│   Load Cluster Report   │
│   Load Performance...   │
│   POD Analysis Report   │
└─────────────────────────┘
```

**Nav item states:**

| State | Left border | Background | Text color | Icon color |
|-------|------------|------------|------------|------------|
| Default | none | transparent | `#6B7280` | `#9CA3AF` |
| Hover | none | `#F9FAFB` | `#374151` | `#6B7280` |
| Active | `3px solid #2563EB` | `#EFF6FF` | `#2563EB` | `#2563EB` |

**Nav item anatomy:**
- Height: `36px`
- Padding: `8px 16px`
- Icon: `16px`, Lucide, left-aligned, `mr-2.5`
- Label: `13px`, truncated if too long
- Section group children: `padding-left: 32px` (indented under section header)

For the Maintenance Module sidebar, the nav items under a **MAINTENANCE** section group are:
- Plan
- Logs
- Maintenance Types
- Maintenance Bills
- Parts
- Due Maintenance
- Inspection

### 4.3 Top Navbar

**Height**: `52px`  
**Background**: `#FFFFFF`  
**Bottom border**: `1px solid #E5E7EB`

**Layout (left to right):**
- Left: **AXESTRACK logo** — bold, large, dark with orange/branded accent. Tagline "Right Information, Great Decisions" in small gray text below.
- Center/right: Push right with `ml-auto`
  - Search icon button (`#6B7280`, `20px`, hover bg `#F3F4F6`)
  - Sun/theme toggle icon button
  - User avatar circle (`32px`, initials "d", primary blue background)
  - User name ("demo") in `13px` bold + "Member" in `11px` gray
  - Chevron down icon for user menu

### 4.4 Page Header Strip

Directly below the top navbar, above the page content:

- **Background**: Very light blue `#F0F7FF` or a subtle gradient from `#EFF6FF` to `#FFFFFF`
- **Height**: `56px`
- **Padding**: `0 24px`
- **Content**: Page title left-aligned (icon square + title text)
- **Bottom border**: `1px solid #E5E7EB`

**Page title anatomy:**
```
[■] Page Title
```
- Square icon badge: `28px × 28px`, background `#DBEAFE`, icon `#2563EB`, border-radius `6px`
- Title text: `22px`, `font-weight: 700`, color `#111827`, `margin-left: 10px`

---

## 5. STAT / METRIC CARDS

Used on dashboard-style pages. A horizontal row of cards below the page header.

**Card container**: `background: #FFFFFF`, `border: 1px solid #E5E7EB`, `border-radius: 8px`, `padding: 16px 20px`

**Card layout:**
```
┌────────────────────────────────┐
│  Label text (small, gray)    [■]│  ← icon badge top-right (32×32, colored bg)
│                                 │
│  VALUE (large, bold, colored)   │
│  Sublabel (small, gray)         │
└────────────────────────────────┘
```

- **Label**: `11px`, `font-weight: 500`, `color: #6B7280`, uppercase
- **Value**: `28–32px`, `font-weight: 700`, color matches the icon badge color
- **Sublabel**: `12px`, `color: #9CA3AF`
- **Icon badge**: `32×32px`, `border-radius: 8px`, background is a light tint of the icon color, icon is `18px` Lucide

The first card (Total) is visually emphasized with a slightly larger border or a left accent bar in blue.

---

## 6. FILTER BAR / TABLE TOOLBAR

Positioned between the page header and the table. White background, `padding: 12px 0`.

**Layout:**
```
[🔍 Search input ─────────────] [▼ Filter icon]   [Sort: Load # ▼] [Desc]   [+ Primary Action] [↓ Export] [⚙] [□□□]
```

### 6.1 Search Input

- Width: `~280px`
- Height: `36px`
- Border: `1px solid #E5E7EB`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Left icon: magnifying glass `#9CA3AF`, `16px`
- Placeholder: `"Search loads..."` in `#9CA3AF`
- Padding: `8px 12px 8px 36px`
- Focus: `border-color: #2563EB`, `box-shadow: 0 0 0 3px #BFDBFE`

### 6.2 Filter Icon Button (Funnel)

- Size: `36×36px`
- Border: `1px solid #E5E7EB`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Icon: funnel/filter `#6B7280`, `16px`
- Hover: background `#F3F4F6`

### 6.3 Dropdown Filter (Sort, Carrier, etc.)

- Height: `36px`
- Border: `1px solid #E5E7EB`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Text: `13px`, `#374151`
- Chevron icon right: `#9CA3AF`
- Min-width: `~140px`

### 6.4 Primary Action Button (+ Create New...)

- Height: `36px`
- Padding: `0 16px`
- Background: `#2563EB`
- Hover: `#1D4ED8`
- Border-radius: `6px`
- Text: `13px`, `font-weight: 500`, `#FFFFFF`
- Left icon: `+` or Lucide `Plus`, `16px`, white

### 6.5 Secondary Action Button (Export, PullRay Logs...)

- Height: `36px`
- Padding: `0 14px`
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Hover background: `#F9FAFB`
- Border-radius: `6px`
- Text: `13px`, `font-weight: 500`, `#374151`
- Left icon (optional): Lucide `Download`, `16px`, `#6B7280`

### 6.6 Icon-only Toolbar Buttons (Settings, Column Customizer, View Toggle)

- Size: `36×36px`
- Border: `1px solid #E5E7EB`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Icon: `18px`, `#6B7280`
- Hover: background `#F3F4F6`
- Active/selected (view toggle): background `#EFF6FF`, icon `#2563EB`, border-color `#BFDBFE`

### 6.7 Tabs (Vehicle / Trailer)

- Tab container: no background, `border-bottom: 2px solid #E5E7EB`
- Tab item: `padding: 10px 16px`, `13px`, `font-weight: 500`
- Inactive tab: text `#6B7280`, bottom border `transparent`
- Active tab: text `#2563EB`, `bottom border: 2px solid #2563EB`
- Gap between tabs: `0` (tabs are adjacent)

---

## 7. TABLE

### 7.1 Table Container

- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border-radius: `8px`
- `overflow: hidden` (rounds corners on header row)
- Horizontal scroll enabled when columns overflow

### 7.2 Table Header Row

- Background: `#F9FAFB`
- Height: `40px`
- Bottom border: `1px solid #E5E7EB`
- Text: `12px`, `font-weight: 500`, `color: #6B7280`
- Padding per cell: `0 16px`
- Sort/search icon next to column label: magnifying glass `#9CA3AF`, `14px` — appears on hover or always visible depending on column

### 7.3 Table Data Rows

- Height: `48px`
- Background: `#FFFFFF`
- Border-bottom: `1px solid #F3F4F6`
- Hover background: `#F9FAFB`
- Cell padding: `0 16px`
- Text: `13px`, `color: #374151`
- Alternating row backgrounds: **NOT used** — clean flat rows only

**First column (#):** Row number, `12px`, `color: #9CA3AF`, width `40px`

**Actions column:** Leftmost or rightmost — contains the three-dot menu button

### 7.4 Three-Dot Row Action Menu

- Button: `28×28px`, icon `MoreHorizontal`, `#9CA3AF`
- Hover: background `#F3F4F6`, border-radius `4px`, icon `#374151`
- Dropdown card: `background: #FFFFFF`, `border: 1px solid #E5E7EB`, `border-radius: 8px`, `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07)`, `min-width: 160px`
- Menu item: `padding: 8px 14px`, `13px`, `color: #374151`, hover background `#F9FAFB`
- Destructive item (Delete): `color: #DC2626`, hover background `#FEF2F2`
- Menu item icon: `14px`, left of label, `mr-2`, `color: #6B7280` (or red for delete)

### 7.5 Status Badges / Pills

```
┌──────────────┐
│  In Transit  │
└──────────────┘
```

- Height: `22px`
- Padding: `2px 10px`
- Border-radius: `9999px` (fully rounded pill)
- Font: `11px`, `font-weight: 500`
- No border (background-only style)

| Label | Background | Text |
|-------|-----------|------|
| In Transit | `#DBEAFE` | `#1D4ED8` |
| Completed | `#D1FAE5` | `#065F46` |
| Open | `#F3F4F6` | `#374151` |
| Pending | `#FEF3C7` | `#92400E` |
| Paid | `#D1FAE5` | `#065F46` |
| Overdue | `#FEE2E2` | `#991B1B` |
| Upcoming | `#FEF3C7` | `#92400E` |
| Active / True | `#D1FAE5` | `#065F46` |
| Inactive / False | `#F3F4F6` | `#6B7280` |
| Mapped | `#D1FAE5` | `#065F46` |
| UnMapped | `#F3F4F6` | `#374151` |

### 7.6 Table Pagination Footer

- Height: `48px`
- Border-top: `1px solid #E5E7EB`
- Background: `#FFFFFF`
- Layout: left = "Rows per page: [10 ▼]" | right = "1–10 of 47 [ < ] [ > ]"
- Text: `12px`, `color: #6B7280`
- Page nav buttons: `28×28px`, border `1px solid #E5E7EB`, border-radius `4px`

### 7.7 Column Customizer Popover

Triggered by the settings/columns icon button in the toolbar. Appears anchored below-right.

- Width: `260px`
- Background: `#FFFFFF`
- Border: `1px solid #E5E7EB`
- Border-radius: `8px`
- Box-shadow: `0 10px 15px -3px rgba(0,0,0,0.08)`

**Header row:**
- Title: `"Manage Columns"`, `13px`, `font-weight: 600`, `#374151`
- Right icons: checkmark all (`#059669`), clear all (`#DC2626`), reset (`#6B7280`) — `16px` each

**Search row:**
- Input: `height: 32px`, magnifying glass icon, full-width, border `1px solid #E5E7EB`

**Column list:**
- Each row: `height: 36px`, `padding: 0 12px`
- Left: drag handle `⋮⋮` in `#D1D5DB`
- Middle: eye icon (`#2563EB` = visible, `#D1D5DB` = hidden), column name `13px #374151`
- Hover: background `#F9FAFB`

**Footer:**
- Text: `"24 of 24 columns visible • Drag to reorder"`, `11px`, `#9CA3AF`
- Border-top: `1px solid #F3F4F6`

---

## 8. MODAL (DIALOG)

### 8.1 Overlay

- Background: `rgba(0, 0, 0, 0.4)`
- Z-index: `50`

### 8.2 Modal Panel

The modal slides in from the **right side** like a drawer (not centered).

- Width: `480–560px` (standard form modal)
- Width: `600–720px` (complex bill modal with log items)
- Height: `100vh` (full height, right-side drawer style)
- Background: `#FFFFFF`
- Box-shadow: `-4px 0 24px rgba(0,0,0,0.12)`
- Animation: slide in from right (`translateX(100%)` → `translateX(0)`)

### 8.3 Modal Header

- Height: `56px`
- Border-bottom: `1px solid #E5E7EB`
- Padding: `0 24px`
- Title: `16px`, `font-weight: 600`, `#111827`
- Close button: top-right, `X` icon, `20px`, `#6B7280`, hover background `#F3F4F6`, border-radius `4px`

### 8.4 Modal Body

- Padding: `24px`
- Overflow-y: `auto`
- Form layout: **2-column grid** for most fields (`grid-cols-2 gap-x-4 gap-y-4`)
- Full-width fields: Description, text areas, section dividers

### 8.5 Modal Section Header (within body)

Used to separate groups of fields (e.g., "General Information", "Accounting", "Maintenance Log"):

- Text: `12px`, `font-weight: 600`, `#6B7280`, uppercase
- Border-bottom: `1px solid #F3F4F6`
- Margin: `16px 0 12px 0`

### 8.6 Modal Footer

- Height: `64px`
- Border-top: `1px solid #E5E7EB`
- Background: `#F9FAFB`
- Padding: `0 24px`
- Layout: `flex justify-end gap-3`
- **Cancel button**: secondary style (white bg, border, gray text)
- **Save button**: primary style (blue bg, white text)

### 8.7 Vehicle/Trailer Toggle (inside modal)

Appears top-right of the modal body, above the form.

- Two-button toggle group: "Vehicle" | "Trailer"
- Inactive: `background: #F3F4F6`, `color: #6B7280`, border `1px solid #E5E7EB`
- Active: `background: #2563EB`, `color: #FFFFFF`, no border
- Height: `32px`, padding: `0 14px`, border-radius: `6px`
- The two buttons sit side-by-side with `border-radius` only on outer edges

---

## 9. FORM FIELDS

### 9.1 Text / Number Input

```
FIELD LABEL *
┌─────────────────────────────────────┐
│  Input value or placeholder text    │
└─────────────────────────────────────┘
  Error message in red (if invalid)
```

- Label: `11px`, `font-weight: 500`, `color: #6B7280`, uppercase, `margin-bottom: 4px`
- `*` suffix for required: `color: #EF4444`
- Input height: `36px`
- Border: `1px solid #E5E7EB`
- Border-radius: `6px`
- Background: `#FFFFFF`
- Padding: `0 12px`
- Text: `13px`, `color: #111827`
- Placeholder: `color: #9CA3AF`
- Focus: `border-color: #2563EB`, `outline: none`, `box-shadow: 0 0 0 3px #BFDBFE`
- Error: `border-color: #EF4444`, error message `11px #EF4444` below input
- Disabled / read-only: `background: #F9FAFB`, `color: #9CA3AF`

### 9.2 Dropdown / Select

- Same height and border as text input
- Right: chevron-down icon `#9CA3AF`, `16px`
- Dropdown menu: `background: #FFFFFF`, `border: 1px solid #E5E7EB`, `border-radius: 6px`, `box-shadow: 0 4px 6px rgba(0,0,0,0.07)`
- Option row: `height: 36px`, `padding: 0 12px`, `13px`, hover `#F9FAFB`
- Selected option: `background: #EFF6FF`, `color: #2563EB`
- Dropdown with search: Add a search input at top of dropdown list

### 9.3 Date Picker

- Same appearance as text input
- Right: calendar icon `#9CA3AF`, `16px`
- Calendar popover: white card, `border-radius: 8px`, shadow, navigation arrows for month

### 9.4 Text Area

- Min-height: `80px`
- Border: same as text input
- Padding: `8px 12px`
- Resize: vertical only

### 9.5 Toggle Switch

```
Label text          [●─────]  ← ON (blue)
Label text          [─────●]  ← OFF (gray)
```

- Track: `width: 40px`, `height: 22px`, border-radius `9999px`
- ON state: track `#2563EB`, thumb `#FFFFFF`
- OFF state: track `#D1D5DB`, thumb `#FFFFFF`
- Label: `13px`, `color: #374151`, `margin-right: auto`
- Layout: label left, toggle right (justify-between)

### 9.6 "+ Create New" Inline Link

Appears below a dropdown field to open a nested creation modal.

- Text: `"+ Create New"`, `12px`, `color: #2563EB`, `font-weight: 500`
- No underline by default; underline on hover
- Cursor: pointer

### 9.7 Validation Error State

- Inline below the field: `11px`, `color: #EF4444`
- Icon prefix: `⚠` or `!` in `#EF4444`

---

## 10. DRAWER (ADVANCED FILTERS)

Slides in from the **right side**, but narrower than a modal.

- Width: `360px`
- Height: `100vh`
- Background: `#FFFFFF`
- Box-shadow: `-4px 0 24px rgba(0,0,0,0.10)`
- Overlay: `rgba(0,0,0,0.3)`

**Header:**
- Height: `52px`
- Title: `"Filters"`, `15px`, `font-weight: 600`, `#111827`
- Close button: `X` icon, top-right

**Body:** `padding: 20px`, form fields stacked vertically, `gap: 16px`

**Footer:**
- Height: `60px`
- Border-top: `1px solid #E5E7EB`
- Background: `#F9FAFB`
- Buttons: **Clear Filters** (secondary) left, **Apply Filters** (primary) right

---

## 11. TWO-LETTER AVATAR (MAINTENANCE TYPES TABLE)

Used in the Name column of the Maintenance Types table.

- Size: `32×32px`
- Border-radius: `6px` (rounded square, not circle)
- Background: deterministic color based on first letter (rotate through palette)
- Text: `12px`, `font-weight: 700`, `#FFFFFF`, uppercase 2-letter initials

**Color rotation by first letter:**

| Letters | Background |
|---------|-----------|
| O, A, B | `#2563EB` (blue) |
| T, C, D | `#059669` (green) |
| E, F, G | `#7C3AED` (violet) |
| R, H, I | `#D97706` (amber) |
| Default | `#6B7280` (gray) |

---

## 12. INSPECTION PAGE SPECIFIC

### 12.1 Two-Column Layout

```
┌──────────────────┬───────────────────────────────────────┐
│   LEFT SIDEBAR   │            RIGHT PANEL                │
│   (280px)        │  (flex-1)                             │
│                  │                                       │
│  Unit search     │  Selected unit heading                │
│  Carrier filter  │  + Create inspection button           │
│                  │  Annual report download               │
│  [Unit list      │  Inspection records table             │
│   table]         │                                       │
│                  │                                       │
└──────────────────┴───────────────────────────────────────┘
```

- Left sidebar: `background: #FFFFFF`, `border-right: 1px solid #E5E7EB`, `padding: 16px`
- Right panel: `background: #FFFFFF`, `padding: 24px`
- Clickable unit number in list: `color: #2563EB`, `font-weight: 500`, hover underline
- Selected unit in list: `background: #EFF6FF`, `border-left: 3px solid #2563EB`

### 12.2 Inspection Item Grid (Create Inspection Full Page)

- Grid: `3 columns` on desktop, `2 columns` on smaller screens
- Each item card: `background: #F9FAFB`, `border: 1px solid #E5E7EB`, `border-radius: 6px`, `padding: 12px`
- Item number: `11px`, `font-weight: 700`, `#9CA3AF`
- Item description: `12px`, `#374151`
- Control buttons (NA / OK / Def): segmented button group
  - `NA`: `background: #F3F4F6`, text `#6B7280`
  - `OK`: active = `background: #D1FAE5`, text `#065F46`, icon `✓`
  - `Def`: active = `background: #FEE2E2`, text `#991B1B`, icon `✗`
  - Button size: `height: 26px`, `padding: 0 10px`, `font-size: 11px`

### 12.3 Mark All OK Button

- Style: secondary button (white bg, border)
- Label: `"Mark all OK"`
- Icon: `CheckSquare`, Lucide, `#059669`

### 12.4 Legend

```
● OK     ■ Def
```
- Green filled circle + "OK" label
- Red filled square + "Def" label
- Font: `12px`, `color: #374151`

---

## 13. DUE MAINTENANCE STATUS INDICATORS

The "Due In" column uses colored chips to show urgency:

| Status | Chip background | Text color | Example value |
|--------|----------------|------------|---------------|
| OK (green) | `#D1FAE5` | `#065F46` | `+8,400 mi` |
| Upcoming (amber) | `#FEF3C7` | `#92400E` | `1,200 mi` |
| Overdue (red) | `#FEE2E2` | `#991B1B` | `-2,300 mi` |

The chip style matches the status badge pill style (rounded, `11px`, `font-weight: 500`).

---

## 14. TOAST NOTIFICATIONS (Nice-to-Have)

- Position: bottom-right, `margin: 16px`
- Width: `320px`
- Background: `#1F2937`
- Text: `13px`, `#FFFFFF`
- Border-radius: `8px`
- Box-shadow: `0 10px 15px rgba(0,0,0,0.15)`
- Auto-dismiss: `3000ms`
- Success variant: left border `4px solid #059669`
- Error variant: left border `4px solid #DC2626`
- Info variant: left border `4px solid #2563EB`

---

## 15. SPACING & SIZING TOKENS

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | `4px` | Tight gaps, icon margins |
| `space-2` | `8px` | Button inner padding (vertical), small gaps |
| `space-3` | `12px` | Input padding, small card padding |
| `space-4` | `16px` | Standard padding, nav item padding, gap between form rows |
| `space-5` | `20px` | Drawer body padding |
| `space-6` | `24px` | Page content padding, modal body padding |
| `space-8` | `32px` | Section spacing |
| `radius-sm` | `4px` | Tiny chips, small buttons |
| `radius-md` | `6px` | Inputs, buttons, cards |
| `radius-lg` | `8px` | Modals, dropdowns, table containers |
| `radius-pill` | `9999px` | Status badges |

---

## 16. ICONS

Use **Lucide React** throughout. Key icons per feature:

| Feature | Icon name |
|---------|-----------|
| Plan | `ClipboardList` |
| Logs | `FileText` |
| Maintenance Types | `Tag` or `Wrench` |
| Bills | `Receipt` |
| Parts | `Package` |
| Due Maintenance | `AlertCircle` or `Clock` |
| Inspection | `CheckSquare` or `ClipboardCheck` |
| Search | `Search` |
| Filter / Funnel | `Filter` |
| Export / Download | `Download` |
| Three-dot menu | `MoreHorizontal` |
| Add / Create | `Plus` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Close | `X` |
| Calendar | `Calendar` |
| Location pin | `MapPin` |
| Columns | `SlidersHorizontal` |
| Chevron down | `ChevronDown` |
| Chevron left | `ChevronLeft` |
| Back | `ArrowLeft` |
| OK / Check | `Check` or `CheckCircle` |
| Def / Error | `X` or `XCircle` |

---

## 17. PAGE-BY-PAGE DESIGN NOTES

### Plan Page
- Filter bar: inline horizontal strip above table, 5 filter controls + clear button
- "Total OverDue" column: numeric, show red if > 0
- "Status" column: Active/True → green badge, False → gray badge
- Export button: secondary style with download icon, top right of page

### Logs Page
- "Total Amount: $12,450" displayed as a simple stat chip top-right of page (not a full card)
  - Style: `background: #F0FDF4`, `border: 1px solid #BBF7D0`, `color: #065F46`, `padding: 6px 14px`, `border-radius: 6px`, `font-size: 13px`, `font-weight: 600`
- Vehicle/Trailer toggle tabs below page header
- Advanced filters drawer: 7 fields, full-height right-side drawer

### Maintenance Types Page
- Two-letter avatar in Name column (rounded square badge)
- Simple 2-column filter bar (Name + Description)
- Table is compact — only 3 columns

### Bills Page
- "PullRay Integration Logs" secondary button next to create button
- Date range picker in filter bar with preset options

### Parts Page
- Minimal design — only 2 table columns (Name, Description)
- Three-dot menu in header for Export option

### Due Maintenance Page
- "By Mileage" / "By Date" tabs are tab-styled (same as Vehicle/Trailer tabs)
- Color-coded "Due In" chips are the main visual feature
- No create button in header — all creation happens via row action

### Inspection Page
- Two-column layout is unique — only this page uses the left sidebar + right content split
- Full-page inspection form (not modal) — navigates to `/maintenance/inspection/new`
- 40-item vehicle checklist displayed in a 3-column grid
- "Mark all OK" action should visually update all items simultaneously

---

## 18. RESPONSIVE BEHAVIOR

The prototype is primarily designed for **desktop (1280px+)**. Minimum supported width is `1024px`.

- Below `1024px`: sidebar collapses to icon-only mode automatically
- Table horizontal scroll is enabled at all widths
- Modals/drawers remain fixed-width (do not go full-screen on desktop)

---

## 19. SUMMARY: IMPLEMENTATION QUICK REFERENCE

| Component | Tailwind classes (approximation) |
|-----------|----------------------------------|
| Primary button | `bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 h-9 rounded-md` |
| Secondary button | `bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 h-9 rounded-md` |
| Icon button | `w-9 h-9 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50` |
| Input field | `h-9 border border-gray-200 rounded-md px-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100` |
| Table header cell | `bg-gray-50 text-xs font-medium text-gray-500 px-4 h-10 border-b border-gray-200` |
| Table body row | `bg-white border-b border-gray-100 hover:bg-gray-50 h-12` |
| Status badge (active) | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800` |
| Status badge (pending) | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800` |
| Status badge (overdue) | `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800` |
| Active nav item | `border-l-2 border-blue-600 bg-blue-50 text-blue-600 font-medium` |
| Page header strip | `bg-blue-50 border-b border-gray-200 px-6 h-14 flex items-center` |
| Page title | `text-xl font-bold text-gray-900 flex items-center gap-2.5` |
| Card | `bg-white border border-gray-200 rounded-lg p-5` |
| Modal/drawer panel | `fixed right-0 top-0 h-full w-[520px] bg-white shadow-2xl` |
| Section label (in modal) | `text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-2 mb-3` |
