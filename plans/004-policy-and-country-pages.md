# Plan 004: Per-policy and per-country static pages, sitemap, structured data

> **Executor instructions**: Follow this plan step by step. Run every verification
> command before moving on. On any STOP condition, stop and report. When done,
> update the status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 6dab7b4..HEAD -- src/app next.config.ts src/components/policy`
> On drift, re-verify "Current state" excerpts first.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (new routes under static export + basePath)
- **Depends on**: plans/003-catalog-first-data-model.md
- **Category**: direction / perf / seo
- **Planned at**: commit `6dab7b4`, 2026-06-11

## Why this matters

Policies currently exist only inside a modal dialog on the home page
(`src/app/page.tsx:129-133`); there is no URL for an individual policy. For a public
reference catalog this is the single biggest gap: policies cannot be cited, shared,
bookmarked, or indexed by search engines, and Google can never rank
"Bolsa Família education policy" to this site. Static export already supports
`generateStaticParams`, so per-policy pages are nearly free at build time and also
give every policy an Open Graph card and schema.org entity.

## Current state

- `next.config.ts` — `output: 'export'`, `basePath: '/ed-policies'` in prod. All 
  internal links must use Next `<Link>` (basePath is applied automatically); never
  hand-build hrefs with the basePath in them.
- Routes today: `/` (browser with modal detail), `/compare` (`?policies=a,b` query,
  client component), `/about`, `/contribute`. No dynamic routes anywhere.
- `src/components/policy/PolicyDetail.tsx` — 274-line Dialog rendering the full policy
  record (summary, objectives, mechanisms, outcomes, evaluations, references). This is
  the content source for the new page; refactor, don't duplicate.
- `src/app/page.tsx:67-70` — `handlePolicyClick` opens the dialog.
- `src/app/layout.tsx:6-32` — site-wide metadata only; no JSON-LD, no sitemap, no
  per-entity metadata.
- `src/types/policy.ts` — `COUNTRY_LABELS` (21 countries); after plan 003 there is
  also `IMPLEMENTATION_STATUS_LABELS`.

## Commands you will need

| Purpose | Command          | Expected |
|---------|------------------|----------|
| Verify  | `npm run verify` | exit 0   |
| Build   | `npm run build`  | exit 0; `out/policies/<id>.html` files exist |

## Scope

**In scope**:
- Create `src/app/policies/[id]/page.tsx` (+ a server-component policy page view)
- Create `src/app/countries/[country]/page.tsx`
- Create `src/app/sitemap.ts` (static-export compatible) or emit `out/sitemap.xml`
  via a build script if `sitemap.ts` conflicts with `output: 'export'`
- Edit `src/components/policy/PolicyDetail.tsx` — extract the record body into a
  shared `PolicyRecord` component used by both dialog and page
- Edit `PolicyResultsTable.tsx` / `CommandPalette.tsx` — policy names link to
  `/policies/[id]`; keep the quick-look dialog behavior where it aids browsing
  (e.g. row click opens dialog, name click navigates)
- Edit `src/app/layout.tsx` — add `metadataBase` and a site-level JSON-LD `Dataset` block

**Out of scope**:
- Visual redesign (plan 005).
- `/compare` mechanics.
- Country metadata beyond name + flag emoji + policy list (no education indicators).

## Steps

### Step 1: Extract `PolicyRecord`

Move the dialog's body markup from `PolicyDetail.tsx` into
`src/components/policy/PolicyRecord.tsx` (pure presentational, takes `policy`).
`PolicyDetail` becomes Dialog chrome around `<PolicyRecord>`.

**Verify**: `npm run build` → exit 0; dialog still renders in dev.

### Step 2: Per-policy pages

`src/app/policies/[id]/page.tsx` (server component):

```tsx
import policiesData from '@/data/policies.json';
export function generateStaticParams() {
  return (policiesData as Policy[]).map((p) => ({ id: p.id }));
}
export function generateMetadata({ params }) { /* title: `${p.name} — ${COUNTRY_LABELS[p.country]}`, description: p.summaryShort, openGraph */ }
```

Page renders breadcrumb (Home → Country → Policy), `<PolicyRecord>`, a JSON-LD
`<script type="application/ld+json">` block (schema.org `GovernmentService` or
`Dataset` entry with name, country, dates, description), and links: "Compare"
(`/compare?policies=<id>`) and "View country" (`/countries/<country>`).
Note `dynamicParams = false`.

**Verify**: `npm run build` → exit 0 and `ls out/policies | head` shows one HTML file
per policy id (65 files).

### Step 3: Per-country pages

`src/app/countries/[country]/page.tsx` with `generateStaticParams` over the 21
`Country` values. Server component: country heading (label + flag emoji map — create
`src/data/countries.ts` with `Record<Country, { flag: string }>`), count line, and a
simple static list of that country's policies (name → `/policies/[id]`, year span,
type labels, evidence badge). No client filtering here — it's a landing/SEO page;
"Open in browser" links to `/?countries=<country>` (the URL param shape handled by
`src/hooks/useUrlSync.ts` — verify the exact param name by reading it).

**Verify**: `npm run build` → exit 0; `ls out/countries | wc -l` ≈ 21.

### Step 4: Wire links + metadata

- `PolicyResultsTable.tsx`: policy name cell → `<Link href={`/policies/${policy.id}`}>`;
  row click can keep opening the dialog.
- `CommandPalette.tsx`: selecting a policy navigates to its page (use `useRouter`).
- `layout.tsx`: add `metadataBase: new URL('https://www.rrmaximiliano.com/ed-policies')`
  and the site JSON-LD `Dataset` block.
- Sitemap: if `src/app/sitemap.ts` is supported with `output: 'export'`
  (it is in Next 16 — it emits `out/sitemap.xml`; confirm in build output), list `/`,
  `/about`, `/compare`, `/contribute`, all `/policies/*`, all `/countries/*` using the
  production URL prefix.

**Verify**: `npm run build` → exit 0; `out/sitemap.xml` exists and contains
`/ed-policies/policies/` URLs; `grep -l "application/ld+json" out/policies/*.html | head -1` non-empty.

## Test plan

Build-output assertions above, plus manual: `npm run dev`, open
`http://localhost:3000/policies/progresa-oportunidades-prospera`, confirm content,
breadcrumb, and working compare link.

## Done criteria

- [ ] 65 static policy pages and 21 country pages in `out/`
- [ ] Each policy page has unique `<title>`, meta description, and JSON-LD
- [ ] Table and command palette link to policy pages
- [ ] `out/sitemap.xml` exists with production URLs
- [ ] `npm run verify` and `npm run build` exit 0

## STOP conditions

- `sitemap.ts` errors under `output: 'export'` — fall back to a postbuild script
  (`scripts/generate-sitemap.mjs`) writing `out/sitemap.xml`; if that also fails, report.
- The URL param shape in `useUrlSync.ts` doesn't support pre-filtering by country —
  link country pages to `/` without params and note it, don't invent params.

## Maintenance notes

- New policies get pages automatically via `generateStaticParams` — no extra step.
- Plan 005 restyles these pages; keep markup semantic (h1/h2, dl where natural).
- Future: hreflang/Spanish translations would multiply these routes; out of scope.
