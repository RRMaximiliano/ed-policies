# Plan 001: Establish a verification baseline — data validation, npm scripts, CI gates

> **Executor instructions**: Follow this plan step by step. Run every verification
> command and confirm the expected result before moving to the next step. If anything
> in the "STOP conditions" section occurs, stop and report — do not improvise. When
> done, update the status row for this plan in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- package.json .github/workflows/deploy.yml src/data/policies.json src/types/policy.ts`
> If any in-scope file changed since this plan was written, compare the "Current
> state" excerpts against the live code before proceeding; on a mismatch, treat it
> as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

The repo has no test runner, no typecheck script, and CI deploys without linting. The
single most dangerous untested artifact is `src/data/policies.json` (65 hand-edited
entries): a typo like `"evidenceQuality": "hig"` silently breaks filtering and produces
`NaN` in the evidence sort comparator (`evidenceRank[a.evidenceQuality]` at
`src/app/page.tsx:160,183`), with no build error. A validation script that checks every
entry against the TypeScript enums is the highest-leverage "test" this repo can get,
and it becomes the contract for all future contributor PRs.

## Current state

- `package.json:5-10` — scripts are only `dev`, `build`, `start`, `lint` (`"lint": "eslint"`).
- `.github/workflows/deploy.yml` — CI runs `npm ci` then `npm run build` then uploads
  to GitHub Pages. No lint or typecheck step.
- `src/app/page.tsx:22` — `const allPolicies = policiesData as Policy[];` bare cast,
  no runtime validation anywhere.
- `src/types/policy.ts` — the source of truth for enums: `Country` (21 values, lines
  2-23), `PolicyType` (13 values, lines 50-63), `AffectedPopulation` (lines 82-92),
  `EvidenceQuality = 'high' | 'moderate' | 'emerging' | 'low' | 'none'` (line 108),
  `StudyMethodology` (lines 134-144). The `Policy` interface is at lines 182-207.
- No zod or other validation library is installed. Do not add one — a plain Node
  script is enough and keeps the dependency surface flat.

## Commands you will need

| Purpose   | Command              | Expected on success |
|-----------|----------------------|---------------------|
| Install   | `npm install`        | exit 0              |
| Typecheck | `npx tsc --noEmit`   | exit 0 (note: a stale `.next/types/*. 2.ts` duplicate may error — delete `.next` first if so) |
| Lint      | `npm run lint`       | exit 0              |
| Build     | `npm run build`      | exit 0, static export in `out/` |

## Scope

**In scope** (the only files you should modify/create):
- `scripts/validate-policies.mjs` (create)
- `package.json` (add scripts only)
- `.github/workflows/deploy.yml` (add verify steps)

**Out of scope**:
- `src/**` — no app-code changes in this plan.
- Adding a test framework (Vitest/Jest) — deliberately deferred; the validation
  script is the baseline. Do not install new dependencies.

## Steps

### Step 1: Create `scripts/validate-policies.mjs`

A plain Node ESM script (no deps) that reads `src/data/policies.json` and validates
every entry. Checks, derived from `src/types/policy.ts`:

- `id`: non-empty string, unique across entries, matches `/^[a-z0-9-]+$/`.
- `name`, `summaryShort`, `summaryLong`, `mechanisms`, `impactSummary`: non-empty strings.
- `country`: one of the 21 `Country` values.
- `yearStart`: integer 1900–current year; `yearEnd` (if present) integer ≥ `yearStart`.
- `isActive`: boolean. If `isActive === true`, `yearEnd` should be absent (warn, not fail).
- `policyTypes`: non-empty array of valid `PolicyType` values.
- `affectedPopulations`: non-empty array of valid `AffectedPopulation` values.
- `evidenceQuality`: one of the 5 `EvidenceQuality` values.
- `objectives`: array of non-empty strings.
- `keyOutcomes`: array of `{ metric, effect }` objects (strings).
- `evaluations`: array; each entry has `authors`, `title`, `keyFinding` strings,
  `year` integer, `methodology` a valid `StudyMethodology`; `url`/`doi` (if present)
  must start with `https://` or `http://` (rejects `javascript:` — this also closes
  the stored-XSS vector in links rendered at `src/components/policy/PolicyDetail.tsx`).
- `keyReferences`: same URL rule.

Duplicate the enum value lists into the script as const arrays (keep a comment
pointing at `src/types/policy.ts` as the source). Exit 1 with a per-entry error list
on failure; print `OK: <n> policies validated` on success.

**Verify**: `node scripts/validate-policies.mjs` → `OK: 65 policies validated` (or
real data errors, which you should report, not "fix" by loosening the script).

### Step 2: Add npm scripts

In `package.json`, change scripts to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "validate": "node scripts/validate-policies.mjs",
  "verify": "npm run validate && npm run typecheck && npm run lint"
}
```

**Verify**: `npm run verify` → exit 0.

### Step 3: Gate CI on verify

In `.github/workflows/deploy.yml`, after the `npm ci` step and before the build step,
add:

```yaml
      - name: Verify (data + types + lint)
        run: npm run verify
```

**Verify**: `npx yaml-lint .github/workflows/deploy.yml` if available, else visually
confirm indentation matches sibling steps; then `npm run verify` still exits 0.

## Test plan

The validation script is the test. Negative check: temporarily corrupt one entry's
`evidenceQuality` in a scratch copy and confirm the script exits 1 naming the entry;
restore the file (`git checkout -- src/data/policies.json` if needed).

## Done criteria

- [ ] `node scripts/validate-policies.mjs` exits 0 and prints the validated count
- [ ] `npm run verify` exits 0
- [ ] `deploy.yml` contains a verify step before build
- [ ] `git status` shows only the three in-scope files changed

## STOP conditions

- `policies.json` contains real validation errors you cannot attribute to a typo'd
  enum (e.g. a country not in the union) — report; the fix may belong in
  `src/types/policy.ts`, which is out of scope here.
- `npm run lint` fails on pre-existing code — report instead of fixing app code.

## Maintenance notes

- Plan 003 adds an `implementationStatus` field — the validation script must be
  updated in the same commit as the schema change.
- When a test framework is eventually added, fold `validate` into it but keep the
  standalone script for contributor use (`CONTRIBUTING.md` references it in plan 006).
