---
title: Paged.js spike findings
date: 2026-04-15
status: draft (C1 deferred to Phase 05)
---

# Paged.js spike findings

Phase 02 called for three red-team spikes (C1/C2/C3). The layout correction in Phase 01 (no dark-bg hero, no absolute-positioned cover) **eliminates C2 and C3 from the design**. C1 is deferred to Phase 05 where the mitigation is already wired.

## C1 — `pagedjs-cli` asset path resolution (DEFERRED to Phase 05)

**Risk**: CLI opens HTML via `file://`; absolute paths like `/assets/sioux/sidebar.png` resolve to filesystem root, not the dist folder → images missing in PDF.

**Mitigation (locked in Phase 05 plan)**: `scripts/build-pdf.mjs` spins up a local HTTP server via `serve-handler` on port 5555, then points pagedjs-cli at `http://localhost:5555/cv/`. Absolute `/assets/...` paths resolve correctly over HTTP. No relative-path gymnastics needed.

**Validation**: will happen in Phase 05 on first `npm run pdf` run. If broken, fallback is relative paths (`./assets/...`) — requires asset path audit across all components, costly, hope not needed.

## C2 — `@page cover` named page emits empty page (MOOT)

**Original risk**: Paged.js issue #20 — named-page selectors (`@page cover`) could emit blank pages.

**Why moot**: Layout correction eliminated the dark-bg hero (user reference PDF shows page 1 main col is **white**, same as page 2+). No named page required; single default `@page` rule covers everything. Spike not needed.

## C3 — Absolute positioning + Paged.js flow fragmentation (MOOT)

**Original risk**: Cover page with `position: absolute` children invisible to Paged.js flow engine → content missing.

**Why moot**: No absolute-positioned cover. Name block = simple inline `<header>` with a left border-bar (`border-left: 3pt solid orange`), flows naturally. Sidebar = `position: running(sidebar)` via Paged.js (standard pattern, not absolute).

**Deferred sub-risk**: `position: running()` itself may be flaky across Paged.js versions. Test in Phase 03 when sidebar component lands. Fallback: per-page `<aside>` repetition via content flow.

## Phase 02 smoke tests (confirmed passing)

- [x] `npm install` installs `astro@6.1.6`, `pagedjs@0.4.3`, `pagedjs-cli@0.4.3`, `marked@16.4.0`, `js-yaml@4.1.0`, `serve-handler@6.1.6`
- [x] `npm run build` succeeds — `dist/cv/index.html` + `dist/index.html` generated
- [x] Content collection `cv` loads `*.yaml` via glob loader (sample.yaml validates)
- [x] Zod schema validates stub YAML
- [x] `npx astro dev` starts cleanly on port 4321
- [x] `paged.polyfill.js` copied to `public/` from `node_modules/pagedjs/dist/` (version-pinned)

## Open validation items (for Phase 03 / 05)

- [ ] Confirm `position: running(sidebar)` works with Paged.js 0.4.3 polyfill in dev browser
- [ ] Confirm pagedjs-cli first run (Chromium auto-download) completes on Windows
- [ ] Confirm `/assets/sioux/...` paths resolve via `serve-handler` → pagedjs-cli HTTP mode
