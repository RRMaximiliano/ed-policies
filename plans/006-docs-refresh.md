# Plan 006: Docs refresh — README accuracy, CONTRIBUTING validation, CLAUDE.md

> **Executor instructions**: Follow step by step; verify each step. On any STOP
> condition, stop and report. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- README.md CONTRIBUTING.md`

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/001-verification-baseline.md (references `npm run validate`)
- **Category**: docs / dx
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

The README is actively wrong: it claims 54 policies (data has 65) and "Next.js 14+"
(package.json pins 16.1.5). CONTRIBUTING tells contributors to "validate your JSON"
without naming a command. There is no CLAUDE.md, so every agent session re-derives the
architecture. For a project whose growth model is contributor PRs adding policies,
docs accuracy is part of the product.

## Current state

- `README.md:13` "catalogs 54 education policies"; line ~25 table `| Policies | 54 |`;
  line ~80 `| Framework | Next.js 14+ |`. Data: `python3 -c "import json;print(len(json.load(open('src/data/policies.json'))))"` → 65.
- `CONTRIBUTING.md:12` — "Validate your JSON using a linter" (no command).
- No `CLAUDE.md` in repo root.
- After plans 001/003/004: `npm run verify` exists; schema has `implementationStatus`;
  optional `evaluations`/`keyReferences`; routes `/policies/[id]`, `/countries/[country]`.

## Commands you will need

| Purpose | Command | Expected |
|---------|---------|----------|
| Count   | `python3 -c "import json;print(len(json.load(open('src/data/policies.json'))))"` | current count |
| Verify  | `npm run verify` | exit 0 |

## Scope

**In scope**: `README.md`, `CONTRIBUTING.md`, `CLAUDE.md` (create).
**Out of scope**: code, data, workflows.

## Steps

### Step 1: README accuracy

Replace hardcoded counts with the live count (and prefer phrasing that ages well:
"65+ policies as of June 2026"). Fix the stack table (Next.js 16, Tailwind 4). Add a
"Data model" note covering `implementationStatus` and that evidence fields are
optional — the catalog includes policies with no research yet, by design. Document
`npm run verify`.

**Verify**: `grep -n "54\|14+" README.md` → no matches.

### Step 2: CONTRIBUTING validation command

In the checklist, replace "Validate your JSON using a linter" with
"Run `npm run validate` (validates every entry against the schema)". Document the new
`implementationStatus` field values and that `evaluations`/`keyReferences` may be
omitted for policies without research.

**Verify**: `grep -n "npm run validate" CONTRIBUTING.md` → match.

### Step 3: CLAUDE.md

Create a concise (≤60 lines) CLAUDE.md: project purpose (canonical LatAm education
policy catalog, evidence optional), commands (`dev`, `verify`, `build`), architecture
map (data: `src/data/policies.json` + `src/types/policy.ts`; validation:
`scripts/validate-policies.mjs`; state: `src/store/filterStore.ts` + `src/hooks/*`;
routes incl. `/policies/[id]`), and the two hard conventions: never hand-prefix
basePath in links, and any schema change must update the validation script in the
same commit.

**Verify**: file exists; `npm run verify` still exit 0.

## Done criteria

- [ ] README has no stale counts or framework versions
- [ ] CONTRIBUTING names `npm run validate` and documents the new schema fields
- [ ] CLAUDE.md exists with commands + architecture + conventions

## STOP conditions

- Plans 001/003 not yet landed (referenced commands/fields don't exist) — report and
  do only Step 1.

## Maintenance notes

- Consider a README badge or CI check that fails when the README count drifts from
  the data (cheap: a grep in the verify script). Deferred.
