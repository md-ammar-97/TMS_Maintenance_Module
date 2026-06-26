# Design System — Maintenance Module Frontend Prototype
### Uber Base foundation · Figma-style token architecture · Light-first (dark optional)

---

## 0. WHAT CHANGED FROM THE PREVIOUS VERSION

The prior system ("AxesTrack Technical Precision", dark-first) has been **replaced** by an **Uber Base** foundation organized the way a **Figma design-system library** is organized: three token tiers (Primitives → Semantic → Component) with **Light** and **Dark** modes.

Three problems drove the rewrite:

1. **The UI read as a wall of monochrome data.** A TMS maintenance table has 10–16 columns of IDs, dates, amounts, and statuses. Without semantic color and iconography the eye has no anchors. This version introduces a **Data Encoding System** (§9): every value *type* gets a deliberate color/icon treatment so reviewers can scan, not decode.
2. **Things overlapped and buttons were mis-shaped.** Filter bars with 5–7 controls collided; the Bill modal grew taller than the viewport; row menus on the last row clipped; primary buttons had inconsistent height/radius/padding. §10–§12 specify exact sizing, spacing, responsive wrap, scroll containment, and z-index layering to remove every overlap.
3. **No single source of visual truth.** Components hardcoded colors. Now **nothing hardcodes a color** — every surface reads a semantic token, and the token resolves per mode.

> Light mode is the **default**. Dark mode is a supported parity mode (Base ships both), toggled in the top bar. This reverses the old dark-default decision.

---

## 1. DESIGN PRINCIPLES

| Principle | Meaning in this module |
|-----------|------------------------|
| **Base, not bespoke** | Spacing, type, color, elevation follow the Uber Base scales. Don't invent one-off values. |
| **Color carries meaning, never decoration** | A hue always encodes something (entity type, status, category). If a color doesn't *mean* something, it isn't used. |
| **Icon + color + text, never color alone** | Every status uses an icon *and* a label *and* a color (accessibility — §15). Color is the third reinforcement, not the only signal. |
| **One primary action per view** | Exactly one filled primary button per screen region (top-right of the page header). Everything else is secondary/tertiary. |
| **Dense by default, never cramped** | Comfortable 48px rows by default; a Compact (40px) density mode for power users. Density is a token swap, not a redesign. |
| **The container scrolls, the chrome doesn't** | Headers, footers, sidebars, filter bars stay put. Only table bodies and modal bodies scroll. |

---

## 2. TOKEN ARCHITECTURE (Figma library structure)

Tokens are modeled as **three Figma variable collections**. This maps 1:1 to Figma Variables → CSS custom properties → Tailwind theme.

```
Collection 1 — Primitives        (raw values; no mode switching except where noted)
  ├─ color/mono/*                 grayscale ladder
  ├─ color/accent/*               blue
  ├─ color/positive/*             green
  ├─ color/warning/*              amber
  ├─ color/negative/*             red
  ├─ color/category/*             8-hue categorical ramp (entity + maintenance coding)
  ├─ size/scale*                  Base sizing scale
  ├─ radius/*                     corner radii
  ├─ font/*                       families, sizes, weights, line-heights
  └─ shadow/*                     elevation

Collection 2 — Semantic / Alias  (MODE-AWARE: Light | Dark — this is the only mode collection)
  ├─ background/*                 surfaces
  ├─ content/*                    text + icon foregrounds
  ├─ border/*                     dividers + outlines
  └─ state/*                      status foreground/background pairs

Collection 3 — Component          (component-scoped aliases that point at Semantic)
  ├─ button/*  input/*  table/*  badge/*  modal/*  sheet/*  tab/*  toggle/*
```

**Figma modes:** Collection 2 has two modes, `Light` and `Dark`. Components bind only to Collection 2/3 tokens, so flipping the page mode reskins everything with zero component edits — the same guarantee the CSS gives at runtime (§16).

**Naming rule:** components never reference Collection 1 directly. A button reads `button/bg/primary`, which aliases `state/accent/bg`, which (in Light) resolves to `color/accent/500`. Three hops, one source of truth.

---

## 3. COLOR — PRIMITIVES (Collection 1)

### 3.1 Mono ladder

| Token | Hex | Typical role |
|-------|-----|--------------|
| `mono/white` | `#FFFFFF` | base surface (light) |
| `mono/100` | `#F6F6F6` | secondary surface (light) |
| `mono/200` | `#EEEEEE` | tertiary surface, table header (light) |
| `mono/300` | `#E2E2E2` | borders, dividers (light) |
| `mono/400` | `#CBCBCB` | strong border, disabled fg |
| `mono/500` | `#AFAFAF` | placeholder, muted icon |
| `mono/600` | `#6B6B6B` | tertiary text |
| `mono/700` | `#545454` | secondary text |
| `mono/800` | `#333333` | tertiary surface (dark), strong text |
| `mono/900` | `#1F1F1F` | secondary surface (dark) |
| `mono/950` | `#141414` | base surface (dark) |
| `mono/black` | `#000000` | primary text (light), inverse surface |

### 3.2 Accent (blue) — primary actions, links, selection

| Token | Hex |
|-------|-----|
| `accent/50` | `#EBF1FE` |
| `accent/100` | `#D4E2FD` |
| `accent/300` | `#5B91F5` |
| `accent/500` | `#276EF1` ← **Base accent** |
| `accent/600` | `#1E54B7` |
| `accent/700` | `#18398A` |

### 3.3 Positive (green) · Warning (amber) · Negative (red)

| Role | `…/50` (bg) | `…/500` (solid) | `…/700` (text-on-light) |
|------|------------|-----------------|--------------------------|
| `positive/*` | `#E6F2ED` | `#05944F` | `#03582F` |
| `warning/*` | `#FFF3E0` | `#FFC043` | `#9A6700` |
| `negative/*` | `#FFEFED` | `#E11900` | `#9A1100` |

> Warning's `500` (#FFC043) is a fill/dot color only. For **warning text on light**, use `warning/700` (#9A6700) to stay ≥ 4.5:1.

### 3.4 Categorical ramp — the engine of the encoding system

Base ships accent/positive/warning/negative. Dense TMS data needs **more distinguishable hues** to color-code entity types and maintenance categories. This 8-hue ramp is the Figma library's categorical extension. Each hue has a `…/50` background and a `…/600` foreground (label/icon) tuned for ≥ 4.5:1 on white.

| Token | 50 (bg) | 600 (fg) | Reserved for |
|-------|---------|----------|--------------|
| `category/blue` | `#EBF1FE` | `#1E54B7` | **Vehicle** + Accent overlap |
| `category/teal` | `#E0F4F3` | `#0A6E68` | **Trailer** |
| `category/indigo` | `#ECEBFB` | `#3F37C9` | **Carrier** |
| `category/purple` | `#F3EAFB` | `#6B21A8` | **Vendor** |
| `category/amber` | `#FBF0DC` | `#92580B` | **Part**, Oil Change |
| `category/cyan` | `#E0F5FB` | `#0C6178` | **Plan**, Reefer |
| `category/slate` | `#ECEEF1` | `#3D4753` | Tires, neutral entities |
| `category/rose` | `#FCE9EE` | `#9B1B43` | Engine work |

These hues are **assigned, not free**. The mapping is fixed in §9.1–§9.2 so the same entity is always the same color everywhere.

---

## 4. COLOR — SEMANTIC / ALIAS (Collection 2, mode-aware)

Components use **only** these. Light and Dark columns are the two Figma modes.

### 4.1 Background

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `background/primary` | `#FFFFFF` | `#141414` | page body, modal, input |
| `background/secondary` | `#F6F6F6` | `#1F1F1F` | app canvas behind cards |
| `background/tertiary` | `#EEEEEE` | `#333333` | table header, hover fill |
| `background/inverse` | `#141414` | `#FFFFFF` | tooltips, inverse chips |
| `background/overlay` | `rgba(0,0,0,0.48)` | `rgba(0,0,0,0.64)` | modal/sheet scrim |
| `background/sidebar` | `#FFFFFF` | `#1F1F1F` | left nav |
| `background/topbar` | `#FFFFFF` | `#141414` | top bar |

### 4.2 Content (text + icons)

| Token | Light | Dark |
|-------|-------|------|
| `content/primary` | `#141414` | `#FFFFFF` |
| `content/secondary` | `#545454` | `#CBCBCB` |
| `content/tertiary` | `#6B6B6B` | `#AFAFAF` |
| `content/disabled` | `#AFAFAF` | `#6B6B6B` |
| `content/inverse` | `#FFFFFF` | `#141414` |
| `content/accent` | `#276EF1` | `#5B91F5` |
| `content/positive` | `#03582F` | `#34D399` |
| `content/warning` | `#9A6700` | `#FBBF24` |
| `content/negative` | `#9A1100` | `#F87171` |

### 4.3 Border

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `border/opaque` | `#E2E2E2` | `#333333` | dividers, input border, table lines |
| `border/subtle` | `#EEEEEE` | `#2A2A2A` | row separators |
| `border/strong` | `#CBCBCB` | `#545454` | hover input border |
| `border/selected` | `#141414` | `#FFFFFF` | selected control outline |
| `border/accent` | `#276EF1` | `#5B91F5` | focus ring, active tab |

### 4.4 State pairs (status backgrounds + foregrounds)

Each status is a **bg + fg + icon** triple. These power every badge/chip.

| State | bg (Light) | fg (Light) | bg (Dark) | fg (Dark) | Icon (Lucide) |
|-------|-----------|-----------|-----------|-----------|---------------|
| `state/positive` | `#E6F2ED` | `#03582F` | `rgba(5,148,79,0.16)` | `#34D399` | `check-circle-2` |
| `state/warning` | `#FFF3E0` | `#9A6700` | `rgba(255,192,67,0.16)` | `#FBBF24` | `clock` / `alert-triangle` |
| `state/negative` | `#FFEFED` | `#9A1100` | `rgba(225,25,0,0.16)` | `#F87171` | `alert-octagon` |
| `state/accent` | `#EBF1FE` | `#1E54B7` | `rgba(39,110,241,0.18)` | `#5B91F5` | `circle-dot` |
| `state/neutral` | `#EEEEEE` | `#545454` | `#333333` | `#CBCBCB` | `minus-circle` |
| `state/purple` | `#F3EAFB` | `#6B21A8` | `rgba(107,33,168,0.20)` | `#C084FC` | `wrench` |

---

## 5. TYPOGRAPHY

**Family:** `'Uber Move Text', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
Uber Move is proprietary; **Inter** is the prototype substitute (identical metrics class). Numbers use **tabular figures** (`font-feature-settings: 'tnum' 1`) everywhere a value is compared in a column.

| Style token | Size / Line | Weight | Case | Use |
|-------------|-------------|--------|------|-----|
| `HeadingLarge` | 28 / 36 | 600 | — | full-page form titles (Create Inspection) |
| `HeadingMedium` | 24 / 32 | 600 | — | section banners |
| `HeadingSmall` | 20 / 28 | 600 | — | **page title** |
| `HeadingXSmall` | 16 / 24 | 600 | — | modal title, card title |
| `LabelLarge` | 16 / 24 | 600 | — | stat value labels |
| `LabelMedium` | 14 / 20 | 500 | — | button text, tab text, dropdown items |
| `LabelSmall` | 12 / 16 | 500 | — | form labels, chip text |
| `LabelXSmall` | 11 / 16 | 600 | **UPPER**, +0.4 tracking | **table column headers** |
| `ParagraphMedium` | 14 / 20 | 400 | — | body text, page subtitle |
| `ParagraphSmall` | 13 / 18 | 400 | — | **table cell text** |
| `ParagraphXSmall` | 12 / 16 | 400 | — | helper/inline-error text |
| `MonoMedium` | 13 / 18 (tabular) | 500 | — | IDs, ref numbers, mileage, amounts |
| `StatValue` | 28 / 34 | 700 (tabular) | — | "Total Amount" hero number |

---

## 6. SPACING & SIZING (Base scale)

The Base sizing scale. **8px is the primary rhythm; 4px is the micro unit.** Use these tokens for padding, gap, margin, and control heights — never raw pixels.

| Token | px | Token | px |
|-------|----|-------|----|
| `scale0` | 0 | `scale700` | 20 |
| `scale100` | 4 | `scale800` | 24 |
| `scale200` | 6 | `scale850` | 28 |
| `scale300` | 8 | `scale900` | 32 |
| `scale400` | 10 | `scale950` | 36 |
| `scale500` | 12 | `scale1000` | 40 |
| `scale550` | 14 | `scale1200` | 48 |
| `scale600` | 16 | `scale1600` | 64 |

**Standing layout values (derived from the scale):**

| Surface | Value |
|---------|-------|
| Page horizontal padding | `scale800` (24) |
| Page header vertical padding | `scale600` (16) |
| Card / modal body padding | `scale800` (24) |
| Form field vertical gap | `scale600` (16) |
| Filter-bar gap between controls | `scale500` (12) |
| Table cell padding (comfortable) | `scale500` vertical · `scale600` horizontal |
| Table cell padding (compact) | `scale300` vertical · `scale600` horizontal |
| Icon-to-label gap (buttons, chips) | `scale300` (8) |

---

## 7. SHAPE · ELEVATION · LAYERING

### 7.1 Radius

| Token | px | Use |
|-------|----|-----|
| `radius/100` | 4 | inputs, small chips, avatars-square |
| `radius/200` | 8 | **buttons, selects, cards, badges** |
| `radius/300` | 12 | modals, sheets, large cards |
| `radius/full` | 9999 | status dots, pill chips, round avatars |

### 7.2 Elevation (shadows — Base "lighting")

| Token | Value | Use |
|-------|-------|-----|
| `shadow/sm` | `0 1px 2px rgba(0,0,0,0.06)` | resting cards, sticky header underline |
| `shadow/md` | `0 4px 8px rgba(0,0,0,0.12)` | dropdowns, popovers, date picker |
| `shadow/lg` | `0 8px 24px rgba(0,0,0,0.16)` | modals |
| `shadow/xl` | `0 16px 48px rgba(0,0,0,0.20)` | right-side sheets/drawers |

### 7.3 Z-index scale (kills overlap/clipping)

| Layer | z |
|-------|---|
| base content | 0 |
| sticky table header / sticky first column | 50 |
| filter-bar sticky | 60 |
| dropdown / select / popover | 1000 |
| drawer (sheet) | 1100 |
| modal overlay | 1200 |
| modal | 1300 |
| toast | 1400 |
| tooltip | 1500 |

> Row action menus (`DropdownMenu`) render in a **portal at z 1000** with collision-aware placement, so the last-row menu opens upward instead of clipping (§12.4).

---

## 8. ICONOGRAPHY

**Set:** Lucide React (Base-compatible line icons). **Size:** 16px in tables/buttons, 18px in headers, 14px inside chips. **Stroke:** 1.75. **Color:** inherits `content/*` unless the icon is encoding a status/category (then it takes the state/category fg).

**Usage rules:**
- One meaningful icon per cell, max. Two icons in a cell only if one is the entity anchor and the other is a status.
- Icons reinforce text; a cell is never icon-only unless it's a control (action menu, toggle).
- Action icons (edit/delete/more) live **only** inside the row's three-dot menu, never inline across the row — this was a source of clutter and accidental clicks.

| Concept | Icon | Concept | Icon |
|---------|------|---------|------|
| Plan | `clipboard-list` | Logs | `scroll-text` |
| Maintenance Types | `tags` | Bills | `receipt` |
| Parts | `package` | Due Maintenance | `alarm-clock` |
| Inspection | `clipboard-check` | Vehicle | `truck` |
| Trailer | `container` | Carrier | `building-2` |
| Vendor | `store` | Mileage | `gauge` |
| Amount / money | `circle-dollar-sign` | Date | `calendar` |
| Add / create | `plus` | Export | `download` |
| Columns | `sliders-horizontal` | Filters | `filter` |
| Search | `search` | Clear | `x` |
| More actions | `ellipsis-vertical` | Edit | `pencil` |
| Delete | `trash-2` | Location | `map-pin` |

---

## 9. DATA ENCODING SYSTEM — color & icons that tame the density

This is the core of the rewrite. The goal: a reviewer glancing at a 14-column table can locate the row, the entity, the status, and the money **without reading every cell**. Every value *type* has one treatment, applied identically on every page.

### 9.1 Entity color coding (fixed hues + anchor icons)

Each entity type owns a hue and an icon. Wherever the entity appears — as a leading row anchor, an avatar, a chip, or a dropdown item — it wears the same hue. The eye learns "teal = trailer" once and reuses it on all 7 pages.

| Entity | Hue token | Icon | Rendered as |
|--------|-----------|------|-------------|
| Vehicle | `category/blue` | `truck` | square avatar (number) + icon; chip in cells |
| Trailer | `category/teal` | `container` | square avatar (number) + icon; chip in cells |
| Carrier | `category/indigo` | `building-2` | text + small indigo dot; truncates with tooltip |
| Vendor | `category/purple` | `store` | text + purple dot |
| Part | `category/amber` | `package` | chip, amber |
| Plan | `category/cyan` | `clipboard-list` | chip, cyan |
| Inspector | `category/slate` | `user` | round initials avatar |

**Avatar spec (Vehicle/Trailer/Inspector):** 28×28, `radius/100` (square for units, `radius/full` for people), hue `…/50` background, `…/600` text, `LabelSmall` weight 600. Vehicle `100` → blue square reading "100"; Trailer `53100` → teal square reading "531" (first 3) with full number beside it.

### 9.2 Maintenance category color + icon

Maintenance Type is the most repeated value in the module. Each of the 7 seed categories gets a fixed color+icon. New types created at runtime are auto-assigned the next hue in the categorical ramp (deterministic hash on name → ramp index), so they're distinct but stable.

| Maintenance Type | Hue | Icon |
|------------------|-----|------|
| Oil Change | `category/amber` | `droplet` |
| Truck Tires | `category/slate` | `circle-dot` |
| Trailer Tires | `category/slate` (lighter) | `circle-dot` |
| Engine Work | `category/rose` | `cog` |
| Truck Work | `category/blue` | `wrench` |
| Trailer Work | `category/teal` | `wrench` |
| Reefer Work | `category/cyan` | `snowflake` |
| *(new type)* | next ramp hue | `tag` |

Rendered as a **chip**: `…/50` bg, `…/600` text+icon, `radius/200`, `LabelSmall`, icon 14px.

### 9.3 Status badges (the state triples from §4.4)

All statuses are pill badges: dot **or** icon + label, `radius/full`, `LabelXSmall` (11) weight 600, padding `scale100`/`scale300`.

| Field | Value → Badge |
|-------|---------------|
| Plan Status | Active → `positive` (check) · Inactive → `neutral` (minus) |
| Vehicle/Trailer status | Active → `positive` · InShop → `purple` (wrench) · Inactive → `neutral` |
| Payment Status | Paid → `positive` · Pending → `warning` (clock) · *Overdue (derived)* → `negative` |
| Log Status | Mapped → `accent` (linked to a bill) · UnMapped → `neutral` |
| Inspection result (per item) | OK → `positive` · Def → `negative` · NA → `neutral` |
| Inspection record status (derived) | Passed (0 defects) → `positive` · Needs Repair (≥1 Def) → `warning` |

### 9.4 "Due In" chip (the most important color in the module)

Single rule, used identically on Due Maintenance, Plan "Total Overdue", and any due display:

| Condition (Mileage mode) | Condition (Date mode) | Chip | Icon | Example |
|--------------------------|------------------------|------|------|---------|
| `dueIn ≤ 0` | due date in the past | `negative` | `arrow-down` | `−1,200 mi` |
| `1 … 2,000 mi` | within next 30 days | `warning` | `clock` | `+850 mi` / `14 days` |
| `> 2,000 mi` | more than 30 days out | `positive` | `check` | `+2,900 mi` / `120 days` |

> This single threshold table replaces the three conflicting versions in the old docs. It is the canonical rule; `data_model.md` and `edgecases.md` now reference it.

### 9.5 Numbers, money, dates, and the "quiet" columns

| Column type | Treatment |
|-------------|-----------|
| **Amount / Total Amount** | right-aligned, `MonoMedium` tabular, `content/primary`; currency formatted (`$1,234,567.80`); the page-header **Total** uses `StatValue` with a `circle-dollar-sign` in an `accent/50` tile |
| **Mileage / Current mileage** | right-aligned, `MonoMedium` tabular, `content/secondary`, suffix `mi` in `content/tertiary` |
| **GST / HST / QST / external type** | `content/tertiary`; **empty → em-dash `—`** in `content/disabled` (never blank, never `0` unless real) |
| **Dates** | `ParagraphSmall`, `content/secondary`, formatted `Jun 26, 2026`; "today/yesterday" rendered as a faint relative hint in `content/tertiary` |
| **Ref numbers / IDs / SKU** | `MonoMedium`, `content/primary`; copyable on click (cursor + tiny copy affordance on hover) |
| **Tire position** | small `slate` chip with the 2–3 letter code (e.g., `LFI`) + a wheel-position glyph |
| **Boolean (dispatch toggles)** | in tables → status badge; in forms → switch (§11.9) |

### 9.6 Row anatomy (so a row is one object, not 14 fragments)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [⋮] │ 🟦100 │ 🏢 YOLO… │ 🟧Oil Change │ ●Mapped │  312,400 mi │  $1,240.00 │ … │
└─────────────────────────────────────────────────────────────────────────────┘
  │      │        │            │             │           │            │
 menu  anchor   carrier     category      status      number       money
       (hue)    (dot+trunc) (chip+icon)   (badge)    (tabular,R)   (tabular,R)
```

- **Leading anchor column** is always the unit (Vehicle/Trailer avatar) or the primary entity — it gives every row a colored "handle."
- **Zebra:** even rows `background/secondary` at 40% — subtle, only to guide the eye across wide rows. Hover → `background/tertiary`. Selected → `accent/50`.
- **Column-group hairlines:** a slightly stronger `border/opaque` separates logical groups (identity | service | money | meta) so 14 columns read as 4 zones.
- **Sticky:** header row sticky (z 50); first (anchor) column sticky on horizontal scroll (z 50). Right-most **Actions** column is **also** sticky-right so the menu is always reachable.
- Row height: 48 (comfortable) / 40 (compact).

---

## 10. COMPONENT — BUTTONS (fixing "buttons not in proper shape")

### 10.1 Anatomy & invariants
- **Radius:** `radius/200` (8). Never pill-shaped for actions (pills are reserved for status chips).
- **Height (size tokens):** `compact 32` · `default 40` · `large 48`. Page-header CTA = `default` or `large`; in-table/filter buttons = `compact`.
- **Horizontal padding:** `scale600` (16) default, `scale500` (12) compact.
- **Icon gap:** `scale300` (8). Leading icon 16px.
- **Min-width:** 64. **Never wraps** — label truncates with ellipsis past `maxWidth`. Text is `LabelMedium`.
- **Focus:** 2px `border/accent` ring offset 2px (§15).

### 10.2 Variants

| Variant | bg | text | border | Use |
|---------|----|----- |--------|-----|
| **Primary** | `accent/500` → hover `accent/600` | `content/inverse` | none | the one main action |
| **Secondary** | `background/primary` | `content/primary` | `border/opaque` → hover `border/strong` | PullRay logs, Cancel, Back |
| **Tertiary / Ghost** | transparent → hover `background/tertiary` | `content/primary` | none | low-emphasis, toolbar |
| **Destructive** | `negative/500` → hover darker | `content/inverse` | none | confirm Delete |
| **Destructive-ghost** | transparent → hover `negative/50` | `content/negative` | none | Delete item in menus |
| **Icon button** | transparent → hover `background/tertiary` | `content/secondary` | none | 32×32 square, `radius/200`, for ⋮ / filter / columns / export |

### 10.3 Placement (no more collisions)
- Page header right cluster, left→right: **secondary actions … primary action**. Gap `scale300`. Primary is always last (right-most), filled.
- Modal footer: **Cancel (secondary, left) … Save (primary, right)**, gap `scale300`, right-aligned, footer pinned.
- Table toolbar (above table, right): icon buttons **Export · Columns · Filters**, gap `scale200`, each 32×32.

---

## 11. COMPONENTS — CONTROLS

### 11.1 Input / Textarea
- Height 40 (`default`), `radius/200`, `border/opaque`, bg `background/primary`, text `ParagraphMedium content/primary`, placeholder `content/disabled`.
- Focus: border `border/accent` + 2px ring. Error: border `negative/500`, helper text `content/negative` `ParagraphXSmall` with `alert-circle` 14px.
- Label above, `LabelSmall content/secondary`; required mark `*` in `content/negative`.
- Leading icon slot (e.g., search `search`, amount `circle-dollar-sign`, location `map-pin` in `positive/500`).

### 11.2 Select / Dropdown (with search)
- Trigger identical to input + trailing `chevron-down` `content/tertiary`.
- Menu: portal, `background/primary`, `border/opaque`, `radius/200`, `shadow/md`, `max-height 280`, scroll. **Search box pinned at top** for any list > 8 items (Carrier 21, Vehicle/Trailer, Vendor).
- Item: `LabelMedium`; hover `background/tertiary`; selected → `check` in `content/accent` + text `content/accent`.
- Dropdown items that represent entities carry their entity dot/avatar (§9.1) so the menu is color-coded too.
- Inactive units render with a muted `(Inactive)` suffix in `content/tertiary`, derived from status — not hardcoded.

### 11.3 Badge / Chip / Avatar — see §9.2–9.3. All `radius/full` (status) or `radius/200` (category/part/plan). Avatars per §9.1.

### 11.4 Table
- Header: `background/tertiary`, `LabelXSmall` `content/tertiary`, sticky (z 50), 40px tall, bottom `border/opaque`.
- Body row: 48/40, separator `border/subtle`, hover `background/tertiary`, selected `accent/50`.
- Min column widths prevent squashing: anchor 96 · entity-name 180 (truncate+tooltip) · category 150 · status 120 · number 120 · date 130 · amount 130 · actions 56.
- **Horizontal scroll** container with sticky first + last columns (§9.6). The container scrolls; the page does not.
- Empty state (§11.10). Footer: rows-per-page select (`25` default; 10/25/50/100) + "Showing X–Y of Z" + prev/next, pinned below the scroll area.
- **Density toggle** in the toolbar swaps comfortable/compact row + cell padding tokens.

### 11.5 Modal / Dialog (fixing the over-tall Bill modal)
- Centered, `background/primary`, `radius/300`, `shadow/lg`, scrim `background/overlay`.
- **Three-region layout:** pinned **header** (title `HeadingXSmall` + `x` icon button) · scrolling **body** (`overflow-y:auto`) · pinned **footer** (Cancel/Save).
- `max-height: calc(100vh - 96px)`; widths: standard 560, **wide (Bill/Log) 720**, full-page inspection is a route not a modal.
- Body padding `scale800`; header/footer `scale600`/`scale800`. The dynamic Bill log-items list lives in the scrolling body only, so adding 5+ items never pushes the footer off-screen.

### 11.6 Sheet / Drawer (advanced filters)
- Right slide-in, width 400, full height, `background/primary`, `shadow/xl`, `radius/300` on the left edge.
- Same pinned header/body/footer pattern. Footer: **Clear Filters (ghost) · Apply Filters (primary)**.

### 11.7 Tabs
- **Underline tabs** for page-level Vehicle/Trailer context: active = `content/primary` text + 2px `border/accent` underline; inactive = `content/tertiary`. Switching resets the unit filter (§13).
- **Segmented (pill) tabs** for sub-modes (Due Maintenance By Mileage/By Date): container `background/tertiary` `radius/full`; active segment `background/primary` + `shadow/sm` + `content/primary`.

### 11.8 Inspection 3-state segmented control
Per item, a 3-segment control: **NA · OK · DEF**.

| State | bg | fg | icon |
|-------|----|----|------|
| default / NA | `background/tertiary` | `content/tertiary` | `minus` |
| OK active | `positive/50` | `content/positive` | `check` |
| DEF active | `negative/50` | `content/negative` | `x` |

Segment 36px tall, `radius/200` on the group, internal dividers `border/subtle`. "Mark all OK" / "Mark all N/A" bulk buttons above the grid (secondary, compact).

### 11.9 Toggle / Switch
- Track 36×20, `radius/full`. Off: `mono/400` track. On: `accent/500` track, white knob. Label left, `LabelSmall`.
- In tables a boolean renders as a **badge**, not a switch (§9.3) — switches are for forms only.

### 11.10 Empty state
Centered in the table body, padding `scale1600`: muted icon (`search-x` 32px `content/disabled`), `LabelLarge` headline ("No records found"), `ParagraphSmall content/tertiary` hint, and a **Clear Filters** secondary button when filters are active.

### 11.11 Toast
Bottom-right, `background/inverse`, `content/inverse`, `radius/200`, `shadow/lg`, leading status icon. Auto-dismiss 4s. Success uses a `positive/500` icon, info `accent/500`, error `negative/500`.

### 11.12 Date range picker
Popover (`shadow/md`), left preset rail (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month, Custom Range), calendar right, **Apply (primary) · Clear (ghost)** footer. Selected range fill `accent/50`, endpoints `accent/500`.

---

## 12. LAYOUT SYSTEM (app shell + anti-overlap rules)

### 12.1 Shell

```
┌───────────────────────────────────────────────────────────────────┐
│ TOP BAR  56px · background/topbar · bottom border/opaque           │
├───────────────┬───────────────────────────────────────────────────┤
│ SIDEBAR 240px │ MAIN  (flex-1, min-width:0, overflow:hidden)        │
│ background/   │  ┌─ PAGE HEADER (sticky, z 60) ──────────────────┐  │
│ sidebar       │  │  title + subtitle            [actions cluster] │  │
│ right border  │  ├─ FILTER BAR (wraps, never overlaps) ──────────┤  │
│               │  ├─ TABLE TOOLBAR (export·columns·filters·density)│  │
│               │  └─ TABLE (own horizontal+vertical scroll) ───────┘  │
└───────────────┴───────────────────────────────────────────────────┘
```

- **Sidebar** 240px fixed (was 160 — too tight for "Maintenance Types"). Logo block, primary **+ Create Work Order** button, 7 nav items (icon 16 + `LabelMedium`), footer Settings/Support. Active item: `accent/50` fill, `content/accent` text, 2px left `border/accent`. Collapsible to 64px icon-rail at < 1024px.
- **Top bar** 56px: left wordmark + module breadcrumb; center global search (max-width 420); right theme toggle · notifications · user menu.
- **`min-width:0`** on the main column is mandatory — without it the flex child refuses to shrink and the table forces horizontal page overflow (a root cause of the old "overlap").

### 12.2 Page header
Sticky (z 60), `background/primary`, bottom `border/opaque`, padding `scale600 scale800`. Left: `HeadingSmall` title + `ParagraphSmall content/tertiary` subtitle. Right: action cluster (§10.3). Optional stat tile (Logs Total Amount) sits left of the actions.

### 12.3 Filter bar — responsive wrap (the real overlap fix)
Filters live in a **flex-wrap row**, gap `scale500`. Each control has a fixed min-width (search 220, dropdowns 180, date range 240). When the row runs out of width the controls **wrap to a second line** instead of overlapping. Below 1280px, secondary filters collapse behind a **"Filters" button** that opens the advanced drawer; only Search + the 2 primary dropdowns stay inline. `Clear` and `Filters` icon buttons always pin to the right end of the bar.

### 12.4 Overlap/clipping guarantees
- Row action menu: portal, z 1000, **collision-aware** (opens upward on the last rows).
- Long carrier/vendor names: `truncate` + native `title` tooltip; column has a fixed max-width so one long name can't shove the row.
- Tall modal: body scrolls, footer pinned (§11.5).
- Wide table: horizontal scroll is **inside** the table card, with sticky anchor + actions columns; the page itself never scrolls sideways.

### 12.5 Breakpoints
`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Two-column forms collapse to one < md. Inspection two-pane collapses to stacked (unit list → records) < lg. Sidebar rail < lg.

---

## 13. FORM LAYOUT

- **Grid:** 2 columns ≥ md (`gap scale600` row / `scale800` column), 1 column < md. Full-width fields (Description, dynamic sections) span both.
- **Label above input**, `LabelSmall content/secondary`, required `*` `content/negative`. Helper/error below, `ParagraphXSmall`.
- **Section headers** inside long forms (Vendor: "General Information" / "Accounting"; Bill: "Bill Details" / "Maintenance Log") use `LabelLarge` + a 14px section icon + a `border/subtle` rule.
- **Validation:** on submit only. Invalid fields get `negative/500` border + message + `alert-circle`; scroll to first error; never close the modal on a failed save.
- **Conditional fields:** clear a hidden field's value when its branch hides (e.g., Bill log-item `Part` ↔ `Maintenance Type` on log-type switch; Mileage hidden on Trailer tabs).

---

## 14. PAGE-BY-PAGE DESIGN (with encoding applied)

For each page: the header, the filter set, and the **per-column encoding** (this is what turns the mono tables into scannable ones). Columns map to `data_model.md`.

### 14.1 Plan
- **Header:** title "Plan" · subtitle "Recurring maintenance schedules" · actions: **Export** (secondary) · **+ Create New Maintenance Plan** (primary).
- **Filters:** Search (name/description) · Maintenance Type (**All + the 7 shared types — derived, not the old bogus list**) · Interval Type (All/Days/Months/Mileage) · Status (All/Active/Inactive) · Clear.
- **Columns & encoding:** Actions(⋮) · **Name** (primary text) · **Maintenance Type** (category chip §9.2) · Interval Type (neutral chip) · **Interval** (mono tabular + unit: "30,000 mi" / "3 mo") · **Status** (Active=positive / Inactive=neutral badge) · Description (secondary, truncate) · **Total Overdue** (count; `0`→ `—`; `>0`→ negative chip with `alert-triangle`).
- Row menu: **Edit** · **Truck Maintenance Details** (opens popup).
- **Truck Maintenance Details popup:** title = plan name; table Vehicle(blue avatar) · Terminal · Carrier(indigo dot) · Last Service Date · Due Date/Mileage (Due-In chip §9.4); rows-per-page; close.

### 14.2 Logs
- **Header:** title "Logs" · **Total Amount** stat tile (StatValue + `circle-dollar-sign` in accent tile, sums the active tab) · **PullRay Integration Logs** (secondary → placeholder toast) · **+ Create new maintenance log** (primary).
- **Tabs:** Vehicle / Trailer (underline; switching swaps the unit dropdown + clears the unit filter).
- **Filters:** Search · Log Status (All/Mapped/UnMapped) · Maintenance Type · Maintenance Plan · Carrier · Vehicle|Trailer Number (derived from shared data) · Clear · Filters(drawer).
- **Advanced drawer:** Tire Position · Min/Max Mileage · Service date · Min/Max Amount · Description.
- **Columns & encoding (16, grouped):**
  - *Identity:* Actions(⋮) · **Unit #** (blue/teal avatar) · Carrier(indigo dot)
  - *Service:* **Maintenance Type** (category chip) · External Type (`—` if empty) · **Plan** (cyan chip) · Tire Position (slate code chip) · Service Date · Mileage (mono R)
  - *Money:* **Amount** (mono R, primary) · Currency (tertiary) · GST · HST · QST (`—` when empty)
  - *Meta:* Created By (slate initials) · **Bill Ref #** (mono; presence drives the Mapped badge) · **Log Status** (Mapped=accent / UnMapped=neutral)
- Toolbar: Export · Columns · Density. Row menu: Edit · Delete.

### 14.3 Maintenance Types
- **Header:** title "Maintenance Types" · **+ Create new maintenance type** (primary).
- **Filters:** Search · Name · Description · Clear.
- **Columns:** Actions(⋮) · **Name** (category avatar = 2-letter initials in the type's category hue §9.2, e.g., `OC` amber, `TT` slate) · Description (`—` if empty).
- Row menu: Edit · Delete (deleting leaves a `state/neutral` "Unknown Type" fallback wherever referenced — no cascade; §4.1 edgecases).

### 14.4 Maintenance Bills
- **Header:** title "Maintenance Bills" · **PullRay Integration Logs** (secondary) · **+ Create new maintenance bill** (primary).
- **Tabs:** Vehicle / Trailer.
- **Filters:** Bill Ref Number (search) · Carrier · Vehicle|Trailer Number · Bill date (range picker) · Clear · Filters.
- **Columns & encoding:** **Bill Ref #** (mono, primary) · **Payment Status** (Paid=positive / Pending=warning / Overdue=negative badge) · Vendor (purple dot) · Carrier (indigo dot) · Unit # (avatar) · Bill Date · **Total Amount** (mono R, primary, emphasized) · Work Completed Date · Mileage (R; hidden value `—` on trailer rows) · Location (`map-pin` + text).
- **Bill modal (wide 720):** section "Bill Details" (Ref, Vendor, Unit, Bill Date, Currency, **Total Amount read-only** synced from items, Payment Status, Work Completed, **Mileage — Vehicle only**, Location, Payment Method, Description) + section "**Maintenance Log**" (dynamic items via `BillLogItemRow`: Log Type Service/Part → conditional Maintenance Type *or* Part, Plan, Amount, Description, Remove). Live total chip updates as items change; empty → `$0.00`. On save: bill row + auto-created linked logs carrying the Bill Ref (§ cross-page).

### 14.5 Parts
- **Header:** title "Parts" · **+ Create new part** (primary) · ⋮ → Export.
- **Filters:** Search · Name · Description · Clear.
- **Columns:** ☐ (multi-select) · **Name** (amber `package` chip-dot) · SKU/ID (mono) · Description (truncate) · Actions(⋮). Selection count chip in the toolbar.
- Modal: Name · Description.

### 14.6 Due Maintenance
- **Header:** title "Due Maintenance" · subtitle "Upcoming & overdue across the fleet".
- **Sub-tabs:** By Mileage / By Date (segmented).
- **Filters:** Carrier · Vehicle Number · Trailer Number · Service date (range) · Clear · Filters(→ Maintenance Type + Plan).
- **Columns & encoding:** Actions(⋮) · **Plan** (cyan chip) · Vehicle Type (`truck`/`container` icon) · **Number** (avatar) · Last Service Date · Last Service Mileage (R) · Current Mileage (R) · **Due In** (the §9.4 chip — the page's headline color). Sorted overdue-first.
- Row menu: **Create Log** → opens Log modal prefilled (tab, unit, plan, type); on save updates the row's Last Service + recomputes Due In + status.

### 14.7 Inspection (Inspection Compliance)
- **Tabs:** Vehicle / Trailer. **Two-pane** layout.
- **Left (unit list):** Unit # search · Carrier select (searchable, 21) · list of Unit # (avatar) + Carrier (indigo dot); selected row `accent/50` + left `border/accent`; pagination.
- **Right (detail):** header = selected unit avatar + number; **status card** (Passed=positive / Needs Minor Repair=warning, + last inspection date); Annual Report (Year select 2021–2026 + **Download** → `window.print()` mock); **+ Create new {truck|trailer} inspection** (primary, routes to full page).
- **Records table:** Actions(⋮) · Inspection Date · Inspector (slate avatar) · **Status** (Passed/Needs Repair badge) · Defects (count; `0`→`—`, `>0`→ negative chip) · Mileage.
- **Create Inspection — full page** (`/maintenance/inspection/new`): HeadingLarge title; Back to list (secondary) + Save (primary) top-right; header fields (Vehicle entity type, Carrier, Unit, **Mileage Vehicle-only**, Inspection date, **Inspection by** = seeded inspector list); legend (positive `check` = OK, negative `x` = Def, neutral = NA); **Mark all OK / Mark all N/A**; item grid (3-col ≥ lg, 1-col < md) of the **40 vehicle / 21 trailer** items each with the §11.8 control. Save validates header only (NA is valid), returns to the list with the unit still selected (`?unit=…&type=…`).

---

## 15. ACCESSIBILITY (mandatory because we lean on color)

- **Never color-only.** Every status = icon + label + color. A red "Overdue" chip still reads "−1,200 mi" with a down-arrow.
- **Contrast:** body text ≥ 4.5:1, large/UI text ≥ 3:1. The §3–4 tokens are tuned for this on their paired backgrounds (warning text uses `warning/700`, not `/500`).
- **Focus:** visible 2px `border/accent` ring, 2px offset, on every interactive element; logical tab order; modals trap focus and restore it on close.
- **Hit targets:** ≥ 32×32; icon buttons 32, primary controls 40.
- **Color-blind check:** the categorical ramp pairs differ in lightness as well as hue; status relies on shape (dot vs check vs x vs clock), not hue alone.
- shadcn/Radix provide roles, labelling, and keyboard handling for dialog/sheet/menu/tabs out of the box — keep them.

---

## 16. FIGMA LIBRARY ↔ CODE MAPPING

| Figma | Code |
|-------|------|
| Variable collections (Primitives / Semantic / Component) | CSS custom properties in `globals.css`, grouped by tier |
| Modes Light / Dark on the Semantic collection | `:root` (light) and `.dark` selectors; toggle adds/removes `.dark` on `<html>` |
| Variable alias (`button/bg/primary → state/accent/bg → accent/500`) | nested `var()` references; component CSS reads only Component-tier vars |
| Component + variants/states (Button: variant×size×state) | shadcn component + Tailwind variants; states via data-attrs |
| Text styles (Heading/Label/Paragraph/Mono) | Tailwind `text-*` utilities backed by the type tokens |
| Effect styles (shadow/sm…xl) | `--shadow-*` vars |

**CSS contract (excerpt):**
```css
:root {
  /* Semantic — Light mode */
  --background-primary:#FFFFFF; --background-secondary:#F6F6F6; --background-tertiary:#EEEEEE;
  --content-primary:#141414; --content-secondary:#545454; --content-tertiary:#6B6B6B;
  --content-accent:#276EF1; --content-positive:#03582F; --content-warning:#9A6700; --content-negative:#9A1100;
  --border-opaque:#E2E2E2; --border-subtle:#EEEEEE; --border-accent:#276EF1;
  --radius-200:8px; --shadow-md:0 4px 8px rgba(0,0,0,.12);
}
.dark {
  --background-primary:#141414; --background-secondary:#1F1F1F; --background-tertiary:#333333;
  --content-primary:#FFFFFF; --content-secondary:#CBCBCB; --content-tertiary:#AFAFAF;
  --content-accent:#5B91F5; /* …dark-mode values per §4 */
}
/* Rule: components reference ONLY semantic/component vars. No raw hex, no bg-white/text-gray-* utilities. */
```

Radix portal surfaces (`.modal`, `.sheet`, `.dropdown`, `.popover`) read the same semantic vars so portaled overlays inherit the active mode.

---

## 17. MOTION

| Animation | Duration | Easing |
|-----------|----------|--------|
| Dialog / popover open | 150ms | `ease-out` (scale 0.98→1 + fade) |
| Sheet slide-in | 200ms | `ease-out` (translateX) |
| Overlay fade | 150ms | `ease` |
| Toast in/out | 180ms | `ease-out` |
| Tab underline / segmented thumb | 150ms | `ease` |
| Hover state changes | 100ms | `ease` |

Respect `prefers-reduced-motion`: replace transforms with instant state changes.

---

## 18. SCROLLBARS
Thin (8px), track transparent, thumb `border/strong` `radius/full`, hover `mono/500`. Applied to table bodies, modal bodies, drawers, long dropdowns.
