# Plan 003: Make the catalog first-class for ALL policies, evaluated or not

> **Executor instructions**: Follow this plan step by step. Run every verification
> command and confirm the expected result before moving on. On any STOP condition,
> stop and report. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- src/types/policy.ts src/data/policies.json src/components/layout/Hero.tsx src/app/page.tsx scripts/`
> On drift, re-verify "Current state" excerpts first.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED (changes default UX and data contract)
- **Depends on**: plans/001-verification-baseline.md
- **Category**: direction
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

The maintainer's stated goal: "the best catalog of ALL education policies that have
happened in the Latin American region, regardless of whether they have had research
about it or not." Today the product is evidence-centric: the default sort ranks by
evidence quality (`src/types/policy.ts:238-241`), two of four Hero stats count
evidence tiers (`src/components/layout/Hero.tsx:62-71`), and the schema cannot say
"never evaluated" vs "evidence is weak" — `evidenceQuality: 'none'` conflates both,
and `evaluations`/`keyReferences` are required fields. Unevaluated policies — the
majority of what a complete catalog will contain — are structurally second-class.

## Current state

- `src/types/policy.ts:202-206` — `evidenceQuality`, `evaluations`, `keyReferences`
  required on `Policy`.
- `src/types/policy.ts:238-241` — `DEFAULT_POLICY_SORT = { key: 'evidence', direction: 'desc' }`.
- `src/app/page.tsx:25-31` — `evidenceRank` map (high=5 … none=1) used in sorting and
  tie-breaks (lines 160, 183).
- `src/components/layout/Hero.tsx:5-10, 52-71` — props and stat tiles:
  `totalPolicies`, `countryCount`, `highEvidenceCount`, `highOrModerateEvidenceCount`.
- `src/hooks/usePolicies.ts:83-97` — stats computation feeding the Hero.
- `src/data/policies.json` — 65 entries, all with `evaluations`/`keyReferences` arrays
  (some empty), `evidenceQuality` distribution: 20 high / 22 moderate / 15 emerging /
  5 low / 3 none.
- `scripts/validate-policies.mjs` — created by plan 001; enforces the current schema.

## Commands you will need

| Purpose  | Command          | Expected |
|----------|------------------|----------|
| Verify   | `npm run verify` | exit 0   |
| Build    | `npm run build`  | exit 0   |

## Scope

**In scope**:
- `src/types/policy.ts` — schema additions
- `src/data/policies.json` — backfill the new field on all 65 entries
- `scripts/validate-policies.mjs` — enforce new field
- `src/app/page.tsx`, `src/hooks/usePolicies.ts`, `src/components/layout/Hero.tsx` —
  defaults and stats
- `src/components/policy/PolicyDetail.tsx`, `PolicyResultsTable.tsx`,
  `src/components/filters/FilterToolbar.tsx` / `FilterSidebar.tsx` — surface the new
  field; "no evidence yet" presentation

**Out of scope**:
- Per-policy routes (plan 004).
- Visual redesign (plan 005) — keep current visual language.
- Removing the evidence system — it stays; it just stops being the gatekeeper.

## Steps

### Step 1: Extend the schema

In `src/types/policy.ts`:

1. Add an implementation-status type (how real/scaled the policy is — orthogonal to
   evidence):

```ts
export type ImplementationStatus = 'pilot' | 'regional' | 'national' | 'scaled-down' | 'ended';
export const IMPLEMENTATION_STATUS_LABELS: Record<ImplementationStatus, string> = {
  pilot: 'Pilot', regional: 'Regional', national: 'National',
  'scaled-down': 'Scaled down', ended: 'Ended',
};
```

2. On `Policy`: add `implementationStatus: ImplementationStatus`; make
   `evaluations` and `keyReferences` optional (`?: ...[]`) so a catalog entry without
   research is valid by construction.
3. Change `DEFAULT_POLICY_SORT` to `{ key: 'year', direction: 'desc' }` (recency, not
   evidence, is the neutral default for a catalog).
4. Update `EVIDENCE_QUALITY_LABELS.none` to `'Not yet evaluated'` and its description
   to `'No systematic evaluation evidence available yet — an open opportunity for researchers'`.

Then audit all consumers of `evaluations`/`keyReferences` for the new optionality:
`grep -rn "\.evaluations\|\.keyReferences" src --include='*.tsx' --include='*.ts'`
and guard with `?? []` (or optional chaining) at each site — notably
`page.tsx:165` (`b.evaluations.length`), `PolicyDetail.tsx`, `CompareClient.tsx`,
`PolicyResultsTable.tsx` (Studies column).

**Verify**: `npx tsc --noEmit` → exit 0.

### Step 2: Backfill `implementationStatus` in `policies.json`

Mechanical assignment for all 65 entries based on existing fields (`coverage` text,
`isActive`, `yearEnd`): nationwide programs → `national`; subnational/state programs →
`regional`; small pilots → `pilot`; programs replaced/phased out → `ended`. When the
entry text is ambiguous, default: `isActive && coverage mentions "national"` →
`national`; `isActive` otherwise → `regional`; `!isActive` → `ended`.

Update `scripts/validate-policies.mjs`: `implementationStatus` required, one of the
five values; `evaluations`/`keyReferences` now optional (validate shape only when
present).

**Verify**: `npm run validate` → `OK: 65 policies validated`.

### Step 3: Rebalance Hero stats

Change `Hero` props/stats from evidence-tier counts to catalog framing:
`Policies`, `Countries`, `Active today` (`stats.activeCount` — already computed at
`usePolicies.ts:85`), `Evaluated` (count with `evidenceQuality !== 'none'`, label it
"With evaluation evidence"). Update `usePolicies.ts` stats and the `Hero` call in
`page.tsx:101-106` accordingly. Update the Hero subtitle so it reads as a catalog of
policies (mention that evidence ratings exist where available) rather than a database
"for policy evaluators" only.

**Verify**: `npm run build` → exit 0; in the built `out/index.html`, the four stat
labels are Policies / Countries / Active today / With evaluation evidence.

### Step 4: De-stigmatize "Not yet evaluated" in the UI

- `PolicyResultsTable.tsx`: render the `none` badge as a neutral outline style (use
  `src/lib/evidence.ts` from plan 002) with the new label.
- `PolicyDetail.tsx`: when a policy has no evaluations, show an explicit
  "No evaluation studies yet" panel (and, if `keyReferences` empty, hide that section)
  instead of empty lists.
- Filters: ensure the evidence filter shows the new `'Not yet evaluated'` label
  (it reads `EVIDENCE_QUALITY_LABELS`, so this may be automatic — confirm).

**Verify**: `npm run verify && npm run build` → exit 0.

## Test plan

`npm run validate` is the contract test for the data migration. Manual check: run
`npm run dev`, confirm (a) default ordering is newest-first, (b) a `none` policy
(e.g. filter Evidence → Not yet evaluated) renders the neutral badge and the
"No evaluation studies yet" panel.

## Done criteria

- [ ] `Policy` has required `implementationStatus`; `evaluations`/`keyReferences` optional
- [ ] All 65 entries carry `implementationStatus`; `npm run validate` exits 0
- [ ] Default sort is year desc; evidence sort still available in the sort menu
- [ ] Hero shows catalog-framed stats
- [ ] `npm run verify` and `npm run build` exit 0

## STOP conditions

- More than ~10 entries are genuinely ambiguous for `implementationStatus` — report
  the list instead of guessing.
- Any consumer of `evaluations`/`keyReferences` cannot be safely guarded (e.g. sort
  semantics depend on it in a way that changes ranking unexpectedly).

## Maintenance notes

- CONTRIBUTING.md must document the new field and optionality (plan 006).
- Plan 004's per-policy pages should display `implementationStatus` prominently.
- Future: consider `evidenceQuality` being *derived* (e.g. `none` ⇔ no evaluations)
  rather than hand-set; deferred to keep the migration mechanical.
