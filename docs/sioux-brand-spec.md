---
title: Sioux CV Brand & Layout Spec
source: "Sioux CV template.pdf" (rendered from .docx) + user screenshots p1/p2
date: 2026-04-15
status: locked
---

# Sioux CV — Brand & Layout Spec

Single source of truth for design tokens. Phase 02 `tokens.css` copies values from here. Revise HERE first if any token changes.

> **Layout reality check** (corrected from rendered PDF + user screenshots):
> - Classic **2-column** (sidebar + main), NOT 10-layer photo-collage.
> - **Main column is WHITE on ALL pages** (page 1 is NOT dark-bg — earlier plan assumption was wrong).
> - **Name block** = bold black text with thin orange **vertical accent bar** on the left (no dark hero region, no negative-margin bleed).
> - **Sidebar** = single pre-rendered `sidebar.png` (photos → orange fade → logo) topping a solid-orange fill where Details/Skills/Legend/Hobbies cards render in white.
> - **Page 2+ sidebar**: likely empty/blank or not shown (reference PDF page 2 JPG was cropped to main col only). **DECISION**: render full sidebar on every page; if page 2+ sidebar should be blank, wire a flag later.

## Page geometry

| Token | Value |
|-------|-------|
| Page size | A4 — 210 × 297 mm |
| Margins | 25 mm all sides |
| Header/footer margin | 12.5 mm (unused — no footer) |
| Content width | 160 mm (210 − 2×25) |
| Sidebar width | ~60 mm (persistent all pages) |
| Main column width | ~100 mm (160 − 60) |
| Gutter | 0 |

## Color tokens

CSS var names = Phase 02 contract. Copy verbatim into `src/styles/tokens.css`.

```css
:root {
  /* Brand */
  --color-brand-orange:       #F15D03;  /* primary — section headings, orange accent bar, sidebar fill */
  --color-brand-orange-alt:   #ED7D31;  /* secondary — table header row */

  /* Surfaces */
  --color-bg:                 #FFFFFF;  /* main column — ALL pages */
  --color-sidebar-fill:       #F15D03;  /* sidebar bg below photo strip (same as brand orange) */
  --color-table-header:       #F15D03;  /* Additional Work table header row */
  --color-table-zebra:        #F2F2F2;  /* Description band (light gray, NOT dark #3A3A3A as originally specced) */
  --color-rule:               #CCCCCC;  /* horizontal separators between projects */

  /* Text */
  --color-text:               #000000;  /* body text, name */
  --color-text-on-orange:     #FFFFFF;  /* sidebar text, table header text */
  --color-text-muted:         #666666;  /* date ranges, captions */
  --color-text-accent:        #F15D03;  /* section headings, project date ranges */
}
```

**Note**: `#F15D04` also appears in template as near-duplicate of `#F15D03` — treat as copy artifact. Use `#F15D03`.

## Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `Helvetica, Arial, "Nimbus Sans", system-ui, sans-serif` | All text |
| `--fs-8` | 8pt | Fine print, table cell small |
| `--fs-9` | 9pt | Table body, skill items |
| `--fs-10` | 10pt | Body (details, descriptions) |
| `--fs-11` | 11pt | Standard paragraph, function line |
| `--fs-16` | 16pt | Section headings (orange) |
| `--fs-18` | 18pt | Name (hero on page 1) |

Template overrides theme Calibri → Arial/Helvetica inline everywhere. Windows default = Arial; Mac default = Helvetica. Both are metric-compatible (~98%). Fallbacks handle cross-platform.

## Media inventory (USER-PROVIDED supersedes extracted)

Canonical assets live in `public/assets/sioux/` (served as `/assets/sioux/...` by Astro):

| Asset | Role |
|-------|------|
| `public/assets/sioux/sidebar.png` | Complete sidebar: photo strip (top) fading into solid orange with Sioux Technologies logo embedded |
| `public/assets/sioux/skill-level-icon.png` | White Sioux gear icon — repeated 1/2/3 times as skill-level indicator |

Extracted `image1-6.{png,jpeg}` from scout are **DISCARDED** — superseded by user-provided assets above.

## Layout per page

### Sidebar (all pages, ~60 mm wide)

```
┌──────────────┐
│  [photo]     │  ← top portion of sidebar.png (colleagues photo)
│              │
├──────────────┤  ← fade to orange
│ [SIOUX logo] │  ← embedded in sidebar.png
│              │
│ Details      │  ← white text on orange area
│   DOB        │
│   Nationality│
│   Languages  │
│   Experience │
│   Education  │
│   Email      │
│              │
│ Skills       │
│   React     ● │  ← gear icon(s) right-aligned per row
│   Node.js  ●●│
│   Coaching ●●●│
│              │
│ Hobbies      │
│   (list)     │
│              │
│ Legend       │
│   ●    Theor │
│   ●●   Relev │
│   ●●●  Broad │
└──────────────┘
```

Implementation: `<aside class="sidebar">` with `background-image: url(sidebar.png); background-size: cover; background-position: top center`. Persistent via Paged.js `position: running(sidebar)` (fallback: per-page repetition).

### Main column — page 1 (WHITE bg)

```
┌──────────────────────────┐
│ │ Name Last Name         │ ← bold black 18pt + thin orange vertical bar on left
│ │                        │
│ │ Function               │ ← 11pt black
│                          │
│ Summary                  │ ← 16pt orange heading (bold)
│ Duis mollis, est non...  │ ← 10-11pt black body
│                          │
│ Recent Work Experience   │ ← 16pt orange heading
│                          │
│ Project: Lorem Ipsum  Feb 2021 – Apr 2023  │ ← black name left, orange date right
│ Aenean eu leo quam...    │ ← body
│ ──────────────────────   │ ← light-gray separator (#CCCCCC)
│ Project: Lorem Ipsum  Feb 2021 – Apr 2023  │
│ ...                      │
└──────────────────────────┘
```

**Name block**: `border-left: 3pt solid var(--color-brand-orange); padding-left: 8mm` — the orange bar is a simple left-border, not a bleed background.

### Main column — page 2+ (WHITE bg — SAME as page 1)

```
┌──────────────────────────┐
│ Additional Work Experience │ ← 16pt orange heading
│ ┌────────────────────┐   │
│ │ ORANGE HEADER ROW  │   │ ← Period | Project/customer | role | Technology
│ ├────────────────────┤   │
│ │ 2018-2020 | Sioux... (black on white)   │
│ │ Description (light-gray band)           │ ← #F2F2F2 band, black text
│ │ 2018-2020 | ... (black on white)        │
│ │ Description (light-gray band)           │
│ └────────────────────┘   │
│                          │
│ Further Education        │ ← 16pt orange heading
│ Courses / Seminars       │ ← 11pt orange sub-heading
│ 2017  Time Management    │ ← year in orange, name in black
│ 2018  Designing UI       │
└──────────────────────────┘
```

<!-- ## Skill level system (3-tier)

| Level | Gear count | Meaning |
|-------|-----------|---------|
| 1 | `●` | Theoretical knowledge / Beginning practical experience |
| 2 | `●●` | Relevant practical experience |
| 3 | `●●●` | Broad or very broad experience |

Rendered as `<img src=".../skill-level-icon.png">` repeated N times, right-aligned per skill row. Size ~10–12px square, inline. Legend card reproduces the 3 levels for reader reference. -->

## Section order (locked)

1. **Page 1** (white bg): Name (orange bar) → Function → Summary → Recent Work (starts)
2. **Page 2+** (white bg): Recent Work (continues) → Additional Work Experience (table) → Further Education / Courses

**Sidebar section order**: Logo region (from bg image) → **Details** → **Skills** → **Hobbies**. Flows independently — positioned via Paged.js running element on page 1 (deferred decision: repeat on page 2+ vs blank).

## Unresolved / deferred

- **Page 2+ sidebar**: reference JPG was cropped to main col only. Default = render full sidebar every page; revisit after first PDF export if user wants page 2+ sidebar blank.
- **Skill row levels**: reference shows sample skills with what looks like uniform 3-gear rows. Variable 1/2/3 repeat is still the contract per old CV legend — confirm rendering in Phase 03 visual pass.
- Bold vs regular weight per section — need visual pass in Phase 03
- Arial vs Helvetica rendering differences on Windows print — verify in Phase 06 print test
