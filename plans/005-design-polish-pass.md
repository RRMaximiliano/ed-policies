# Plan 005: Visual design & UX polish pass

> **Executor instructions**: Follow this plan step by step, running each verification.
> This plan is intentionally a *bounded* design pass: it sharpens the existing
> editorial identity (warm paper, navy ink, terracotta accent, Libre Baskerville
> serif) — it does NOT replace it. On any STOP condition, stop and report. When done,
> update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- src/app/globals.css src/components`
> On drift, re-verify "Current state" excerpts first.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW–MED (visual only; no data/logic changes)
- **Depends on**: plans/004-policy-and-country-pages.md
- **Category**: dx / direction (UX)
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

The site already has a distinctive editorial direction (academic print: cream paper,
navy ink, terracotta rule, serif headings — see `src/app/globals.css:83-140`). The
gaps are execution-level: the desktop results table is a 1140px-min-width 9-column
wall with no scroll affordance; tablet widths get the worst of both layouts; empty
states are bare; the new policy/country pages (plan 004) ship unstyled-by-default;
and several interactive affordances (sort headers, compare checkboxes) are
undiscoverable. Fixing these is what makes the catalog feel authoritative.

## Current state

- `src/app/globals.css` — design tokens: `--background: #faf8f5`, `--foreground/primary:
  #1a2744`, `--accent: #c4654a`, evidence colors at lines 118-123; fonts: Libre
  Baskerville (serif) + Source Sans 3 (sans) self-hosted from gstatic at lines 7-37.
- `src/components/policy/PolicyResultsTable.tsx` — desktop table `min-w-[1140px]`
  with 9 columns; mobile card list below `lg`; truncation helper caps list cells at
  2 items.
- `src/components/layout/Hero.tsx` — stat tiles in a bordered grid; kbd hint for ⌘K.
- `src/components/layout/Header.tsx` / `Footer.tsx` — simple nav and footer.
- Empty state: `PolicyResultsTable` renders a plain "no results" block (read the file
  for exact lines) with a clear-filters button.

## Commands you will need

| Purpose | Command          | Expected |
|---------|------------------|----------|
| Verify  | `npm run verify` | exit 0   |
| Build   | `npm run build`  | exit 0   |

## Suggested executor toolkit

- If the `design-taste-frontend` skill is available in your environment, invoke it
  before starting and follow its audit-first redesign procedure with the constraint
  "sharpen, don't replace, the existing identity".
- Use the Claude Preview / browser tools if available to screenshot at 375px, 768px,
  1280px before and after.

## Scope

**In scope**:
- `src/app/globals.css` (token refinements, focus states, table affordances)
- `src/components/policy/PolicyResultsTable.tsx`
- `src/components/layout/{Hero,Header,Footer}.tsx`
- `src/app/policies/[id]/page.tsx`, `src/app/countries/[country]/page.tsx`,
  `src/components/policy/PolicyRecord.tsx` (styling of plan-004 surfaces)
- `src/components/filters/FilterToolbar.tsx` (visual hierarchy only)

**Out of scope**:
- Any change to filtering/sorting/compare logic, hooks, store, or data.
- Replacing fonts or the color system; adding animation libraries.
- `src/components/ui/**` vendored primitives (className-level styling at call sites only).

## Steps

### Step 1: Table ergonomics

- Make the policy-name column sticky-left with a right shadow when scrolled; add a
  fade + chevron scroll affordance on the right edge (CSS only).
- Demote low-value columns at narrower widths (`hidden xl:table-cell` for Target and
  Key outcome) instead of forcing 1140px at `lg`.
- Give sort-active headers a terracotta underline; ensure `aria-sort` is set.

**Verify**: `npm run build` → exit 0; manual at 1024px: no horizontal scroll trap,
sticky name column works.

### Step 2: Tablet layout

Between `md` and `lg`, render the card list in a 2-column grid rather than falling
into the cramped table.

**Verify**: manual at 768px — two-column cards.

### Step 3: Empty/zero states

Style the no-results state: serif headline ("No policies match"), one-line subtext
naming the active filter count, and the existing clear-filters action as a primary
button. Same treatment for an empty country page list (plan 004).

**Verify**: dev server, apply contradictory filters → styled empty state.

### Step 4: Policy & country page typography

Apply the editorial system to plan-004 pages: serif h1 with the terracotta rule motif
(as in Hero lines 23-28), `max-w-prose` body, definition-list facts panel
(country, years, status, evidence, coverage) in a bordered card, evidence badge from
`src/lib/evidence.ts`, references styled as a hanging-indent bibliography.

**Verify**: `npm run build` → exit 0; manual check of one policy page.

### Step 5: A11y sweep

- Contrast: check badge text/background pairs against WCAG AA (the `emerging`
  orange-on-cream pairs are the suspects); darken text colors where needed without
  changing hue family.
- Focus-visible ring (`globals.css:346-349`) verified on table rows, sort buttons,
  dialog close.
- `aria-label` on icon-only buttons (compare checkboxes, sheet close).

**Verify**: `npm run lint` → exit 0; manual keyboard tab-through of the home page.

## Test plan

Screenshot diff at 375/768/1280 before vs after (store nothing in repo); the rest is
the manual checks above plus build/lint gates.

## Done criteria

- [ ] No `min-w-[1140px]` hard floor at `lg`; sticky name column with scroll affordance
- [ ] 2-col card grid on tablet
- [ ] Styled empty states on home and country pages
- [ ] Policy pages typographically consistent with Hero's editorial language
- [ ] `npm run verify` and `npm run build` exit 0

## STOP conditions

- A change requires editing logic in hooks/store to achieve a visual goal.
- Contrast fixes would require changing the core palette (report options instead).

## Maintenance notes

- The design tokens in `globals.css:83-140` are the single source of truth; reviewers
  should reject raw hex values added in components (existing ones are grandfathered
  until consolidated).
