# Plan 002: Remove dead components and consolidate evidence badge styles

> **Executor instructions**: Follow this plan step by step. Run every verification
> command and confirm the expected result before moving to the next step. If anything
> in the "STOP conditions" section occurs, stop and report. When done, update the
> status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- src/components`
> On any drift, re-verify the "Current state" excerpts before proceeding.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

Two redesigns (commits `9b3e36b`, `6dab7b4`) left orphaned components and four
byte-identical copies of the evidence-quality badge color map. Dead code misleads
contributors about what renders, and the duplicated color map means any change to the
evidence color semantics must be made in four places (it already drifted: globals.css
has a fifth, unused `.evidence-*` class set with different hex values).

## Current state

- `src/components/policy/PolicyGrid.tsx` — exported, imported nowhere
  (`grep -rn "PolicyGrid" src --include='*.tsx'` shows only self-references).
- `src/components/policy/PolicyCard.tsx` — imported only by PolicyGrid. Dead.
- Evidence badge style maps duplicated (verify with
  `grep -rn "evidence" src --include='*.tsx' -l`): `PolicyResultsTable.tsx` (~line 33),
  `PolicyDetail.tsx` (~line 37), `PolicyCard.tsx` (~line 12, dies with the file),
  `src/app/compare/CompareClient.tsx` (~line 22), plus partial copies in
  `FilterToolbar.tsx` / `FilterSidebar.tsx` / `src/app/about/page.tsx`.
- `src/app/globals.css:268-297` — `.evidence-high` … `.evidence-none` CSS classes;
  check usage with `grep -rn "evidence-high" src --include='*.tsx'` and remove if unused.
- NOT dead (do not remove): `SearchBar.tsx` (used by FilterToolbar line 86),
  `FilterSidebar.tsx` (rendered in FilterToolbar's Sheet, line 157).

## Commands you will need

| Purpose   | Command            | Expected |
|-----------|--------------------|----------|
| Typecheck | `npx tsc --noEmit` | exit 0   |
| Lint      | `npm run lint`     | exit 0   |
| Build     | `npm run build`    | exit 0   |

## Scope

**In scope**:
- Delete: `src/components/policy/PolicyGrid.tsx`, `src/components/policy/PolicyCard.tsx`
- Create: `src/lib/evidence.ts` (shared style + label helpers)
- Edit: `PolicyResultsTable.tsx`, `PolicyDetail.tsx`, `CompareClient.tsx`,
  `FilterToolbar.tsx`, `FilterSidebar.tsx`, `src/app/about/page.tsx` (imports only),
  `src/app/globals.css` (remove unused `.evidence-*` classes if grep confirms unused)

**Out of scope**:
- Changing any color value — this is a pure consolidation; rendered pixels must be
  identical before/after.
- `src/components/ui/**` (vendored shadcn).

## Steps

### Step 1: Delete dead components

Delete `PolicyGrid.tsx` and `PolicyCard.tsx`.

**Verify**: `npx tsc --noEmit` → exit 0; `grep -rn "PolicyGrid\|PolicyCard" src` → no matches.

### Step 2: Create `src/lib/evidence.ts`

Export a single `EVIDENCE_BADGE_CLASSES: Record<EvidenceQuality, string>` whose values
are copied verbatim from `PolicyResultsTable.tsx`'s map (the live, rendered copy), plus
re-export convenience accessors if call sites need them. Import `EvidenceQuality` from
`@/types/policy`.

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 3: Switch all call sites to the shared map

Replace each local map with an import. Diff each component to confirm the class
strings are unchanged.

**Verify**: `grep -rn "high:" src/components src/app --include='*.tsx' | grep -i evidence` →
no remaining local evidence style maps; `npm run build` → exit 0.

### Step 4: Remove unused `.evidence-*` CSS classes

Only if Step 1's grep confirmed no `.tsx` uses them.

**Verify**: `npm run build` → exit 0.

## Test plan

No test framework exists (see plan 001). Verification is typecheck + build + the
greps above.

## Done criteria

- [ ] `PolicyGrid.tsx` and `PolicyCard.tsx` deleted; no references remain
- [ ] Exactly one evidence badge style map exists (`src/lib/evidence.ts`)
- [ ] `npm run build` exits 0
- [ ] No visual change: class strings at call sites identical to before

## STOP conditions

- Any grep reveals a live import of PolicyGrid/PolicyCard outside themselves.
- Local maps turn out NOT to be byte-identical — report the divergence (one of them
  is rendering "wrong" colors today; a human should pick the winner).

## Maintenance notes

- Plan 003 adds catalog-first UI changes that consume `src/lib/evidence.ts`; land
  this first so 003 has one place to touch.
