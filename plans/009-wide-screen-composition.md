# Plan 009: Give wide screens composition, not stretch

> **Executor instructions**: Follow step by step; verify each step visually at the
> stated widths plus `npm run verify` after each. On any STOP condition, stop and
> report. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: written against an uncommitted working tree (HEAD
> `6dab7b4` + uncommitted changes, 2026-06-11). Verify the "Current state" excerpts
> against live files; mismatch = STOP. Plans 007 (shells) and 008 (measure) MUST be
> landed first — this plan's class names assume them.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED (visual/structural changes on the two highest-traffic surfaces)
- **Depends on**: plans/007, plans/008
- **Category**: direction (UX) / layout
- **Planned at**: commit `6dab7b4` + uncommitted tree, 2026-06-11

## Why this matters

After 007 centers everything, reading pages are done (symmetric margins around a
correct measure ARE the right wide-screen behavior — do not widen them). But three
surfaces still waste width *inside* their container: the hero strands its figures on
a full-width rule; the policy record buries its most-scanned facts inline in a
single 896px column; the cards view stops at 3 columns. This plan recomposes those
three and fixes two density defects (timeline badge distance, table column reveal).

## Current state

- `src/components/layout/Hero.tsx:30` — figures row:
  `<dl className="mt-8 flex flex-wrap gap-x-12 gap-y-4 border-t border-[#e4e4e7] pt-6">`
  — four `Figure` blocks cluster left; the `border-t` rule runs the full shell width
  (~700-900px of bare rule at lg+).
- `src/app/policies/[id]/page.tsx:~96-130` — `shell-article` (post-007) wrapping a
  breadcrumb `<nav>`, `<article className="border border-[#e4e4e7] bg-white"><PolicyRecord .../></article>`,
  action links row, Related policies grid, contribution note.
- `src/components/policy/PolicyRecord.tsx` — single column; header block (labels,
  title, country/years/coverage), then Summary/Objectives/Mechanisms, then
  Categories + Target Populations chip grids (`grid gap-6 md:grid-cols-2`), then
  Evidence & Impact, Evaluation Studies, Key References.
- `src/components/policy/PolicyCardsView.tsx:20` —
  `<div className="grid gap-px bg-[#e4e4e7] sm:grid-cols-2 xl:grid-cols-3">`.
- `src/components/policy/PolicyTimelineView.tsx:~60-75` — row button
  `grid w-full grid-cols-[3.5rem_1fr] ... sm:grid-cols-[3.5rem_1fr_auto]`; the
  EvidenceBadge sits in the trailing `auto` column, up to ~900px from the name.
- `src/components/policy/PolicyResultsTable.tsx` — Target and Key outcome columns
  both appear at `xl:` (`hidden ... xl:table-cell` on two `<th>`/`<td>` pairs); at
  1280-1400px both arrive at once and the table is at its tightest.

## Commands you will need

| Purpose | Command          | Expected |
|---------|------------------|----------|
| Verify  | `npm run verify` | exit 0   |
| Build   | `npm run build`  | exit 0   |

## Scope

**In scope**: Hero.tsx, policies/[id]/page.tsx, PolicyRecord.tsx (move chip grids
only), PolicyCardsView.tsx, PolicyTimelineView.tsx, PolicyResultsTable.tsx (column
reveal breakpoints only).
**Out of scope**: country/topic/about/contribute pages (keep narrow + centered, by
decision); the persistent-filter-rail idea for the home browser (recorded as
deferred in plans/README.md — revisit only if browsing telemetry or user feedback
asks for it); filter logic; data.

## Steps

### Step 1: Hero figures join the keel line

Distribute the figures across the rule so the band reads as deliberate:
change the `<dl>` to `flex flex-wrap gap-y-4 justify-between` (keep `border-t pt-6`),
and cap the dl at the title column's width is NOT desired — full-width justify is the
point. Keep `gap-x-12` as a minimum via `gap-x-12` + `justify-between` (flex uses the
larger spacing).

**Verify**: at 1440px the first figure starts at the left edge and the last ends at
the right edge of the shell; at 640px figures wrap to two rows cleanly.

### Step 2: Policy record sticky facts rail at xl

In `src/app/policies/[id]/page.tsx`:
1. Change the page wrapper from the article shell to `shell-wide` ONLY on this route,
   with an inner `xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8`.
2. Left cell: breadcrumb + `<article>` with `<PolicyRecord>` + Related policies.
3. Right cell (xl only): `<aside className="hidden xl:block"><div className="sticky top-20 space-y-6">`
   containing: a facts `<dl>` (Country, Years, Status, Evidence label via
   `EvidenceBadge`, Coverage, Active) in a bordered white card; the Categories and
   Target Populations chip blocks (MOVE out of PolicyRecord via a new optional prop
   `showTaxonomy={false}` rendered on the page instead — keep default `true` so the
   dialog on `/` is unchanged); the Compare + country action links.
4. Below xl nothing changes: the page renders exactly as today (facts stay in the
   record header; chips stay inside PolicyRecord because `showTaxonomy` defaults true
   — the page passes `false` only inside the xl grid... NOTE: a prop cannot be
   breakpoint-conditional. Instead: always render chips in BOTH places, with
   `xl:hidden` on the in-record block and `hidden xl:block` on the rail. Same for the
   facts dl. CSS-only responsive duplication, no JS.)

**Verify**: `/policies/bolsa-familia` at 1440px shows prose column + sticky rail
(scroll: rail pins below header); at 1024px the page is identical to pre-change
(compare screenshots); dialog quick-view on `/` unchanged. `npm run build` → exit 0.

### Step 3: Cards view fourth column

Add `2xl:grid-cols-4` to PolicyCardsView grid line 20.

**Verify**: at 1536px+ cards render 4-up; the longest policy name
("Programme of Advancement Through Health and Education") doesn't break the cell.

### Step 4: Timeline badge proximity

Move `EvidenceBadge` out of the trailing auto column: render it inline at the end of
the meta line (`{COUNTRY_LABELS[...]} · {types}` line), and delete the third grid
column (`sm:grid-cols-[3.5rem_1fr_auto]` → `sm:grid-cols-[3.5rem_1fr]`).

**Verify**: at 1920px the badge sits within ~10ch of the country text, not at the
far right edge.

### Step 5: Stagger table column reveals

In PolicyResultsTable, change the Key outcome `<th>`/`<td>` pair from
`hidden ... xl:table-cell` to `hidden ... 2xl:table-cell`; Target stays at xl.
(Post-007 the shell caps at 1280px, so "2xl" here governs viewport, not shell, width
— the column appears only when the viewport gives the shell its full 1280px plus
breathing room.)

**Verify**: at exactly 1280px viewport: no horizontal scrollbar on `/` table view;
at 1600px the Key outcome column is present.

## Done criteria

- [ ] Hero figures span the keel line at lg+
- [ ] Record pages show a sticky facts rail at xl+ and are unchanged below xl
- [ ] Cards: 4 columns at 2xl
- [ ] Timeline badge adjacent to meta text
- [ ] No horizontal scrollbar on the table at 1280px
- [ ] `npm run verify` and `npm run build` exit 0

## STOP conditions

- The rail duplication (Step 2) meaningfully bloats record-page HTML (>15% size
  increase on `out/policies/bolsa-familia.html`) — report; we may switch to moving
  (not duplicating) the facts via page-level composition.
- Sticky rail overlaps the footer on short policies — report rather than hacking
  z-index/margins.

## Maintenance notes

- The deferred filter-rail idea (persistent FilterSidebar at 2xl on `/`) is recorded
  in plans/README.md; if adopted later it must reuse the existing FilterSidebar
  component, not a copy.
- New wide-screen ideas should pass the test: "does this use width to shorten eye
  travel or add information density, or does it just fill space?"
