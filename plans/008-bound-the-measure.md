# Plan 008: Bound the reading measure on the text itself, not the page

> **Executor instructions**: Follow step by step; verify each step. On any STOP
> condition, stop and report. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: written against an uncommitted working tree (HEAD
> `6dab7b4` + uncommitted changes, 2026-06-11). Do not rely on `git diff`; verify the
> "Current state" excerpts against live files; mismatch = STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/007-page-shell-and-width-tiers.md
- **Category**: layout / typography
- **Planned at**: commit `6dab7b4` + uncommitted tree, 2026-06-11

## Why this matters

Body text reads best at 45-75 characters per line (~65ch ideal). The site bounds
*pages* (896px article tier) but almost never bounds the *text*: record-page prose
runs ~98-112ch, About/Contribute paragraphs ~104ch, compare cells up to ~180ch when
comparing one policy. The rule this plan encodes: **prose gets `max-w-prose` (65ch,
font-relative) on the text element itself**, so the measure survives any future
container change; metadata, chips, tables, and grids stay full width.

## Current state

All verified by reading; class strings are exact:

- `src/components/policy/PolicyRecord.tsx` — prose with no measure cap:
  - `~:89` Summary: `<p className="leading-relaxed text-[#52525b]">{policy.summaryLong}</p>`
  - `~:92-99` Objectives `<ul className="list-disc space-y-2 pl-5 ...">`
  - `~:103` Mechanisms paragraph (same class as Summary)
  - `~:124` evidence description `<p className="mb-4 border-l-2 border-[#e4e4e7] pl-4 text-sm ...">`
  - `~:127` impactSummary paragraph
  - References list items `-indent-5 pl-5 text-sm ...` (hanging indent)
- `src/app/about/page.tsx` and `src/app/contribute/page.tsx` — section paragraphs
  `text-[#52525b] leading-relaxed` spanning the full 896px container (~104ch); lead
  paragraphs under the h1 use `max-w-2xl`.
- `src/app/compare/CompareClient.tsx:~183` CompareRow cell:
  `<td ... className="border-r border-[#e4e4e7] px-4 py-4 align-top text-[#52525b] last:border-r-0">{render(policy)}</td>`
  — `min-w-[260px]` on headers but no max anywhere: with 1 policy selected the
  Mechanism cell runs ~180ch.
- `src/components/policy/PolicyCardsView.tsx:~37` card summary
  `<p className="line-clamp-3 text-sm leading-relaxed text-[#52525b]">` — fine at
  3-col, ~100ch in the 640-767px single-column band.
- Country/topic list rows: `src/app/countries/[country]/page.tsx:~110` and
  `src/app/topics/[type]/page.tsx:~131` summary `<p className="mt-2 line-clamp-2 text-sm leading-relaxed ...">`.
- Sub-hero intros use pixel-based `max-w-2xl` (~84ch at 16px):
  `CompareClient.tsx:~38`, `countries/[country]/page.tsx:~77`, `topics/[type]/page.tsx:~80`;
  Hero subtext `src/components/layout/Hero.tsx:23` uses `max-w-2xl` at md:text-lg (~75ch, acceptable but inconsistent).

## Commands you will need

| Purpose | Command          | Expected |
|---------|------------------|----------|
| Verify  | `npm run verify` | exit 0   |
| Build   | `npm run build`  | exit 0   |

## Scope

**In scope**: the files above, measure-related classes only.
**Out of scope**: any width/shell change (007), any grid recomposition (009), font
sizes, copy.

## Steps

### Step 1: PolicyRecord prose

Add `max-w-prose` to: Summary `<p>`, Mechanisms `<p>`, impactSummary `<p>`, the
evidence-description `<p>`, the Objectives `<ul>`, and the References `<ul>`. Do NOT
cap: the header block, category/population chip rows, key-outcome cards, evaluation
study cards (those are cards/metadata, not prose).

**Verify**: `npm run dev`, open `/policies/chile-sep` at 1280px: Summary lines wrap
near 65ch; outcome cards still span the content column.

### Step 2: About + Contribute paragraphs

Add `max-w-prose` to every section body paragraph (the `text-[#52525b] leading-relaxed`
paragraphs). Leave the MethodCard/source/category grids full width. Swap the two lead
paragraphs from `max-w-2xl` to `max-w-prose`.

**Verify**: visual at 1280px; `npm run lint` → exit 0.

### Step 3: Compare cells

In `CompareClient.tsx` CompareRow, wrap cell content:
`<td ...><div className="max-w-[52ch]">{render(policy)}</div></td>`.

**Verify**: `/compare?policies=bolsa-familia` (single policy) at 1920px — Mechanism
text wraps near 52ch instead of spanning the viewport.

### Step 4: Browse-surface summaries

Add `max-w-[65ch]` to the three list/card summary paragraphs (cards view, country
rows, topic rows).

**Verify**: visual on `/` cards view at 700px width and `/countries/peru` at 1280px.

### Step 5: Sub-hero intros

Swap `max-w-2xl` → `max-w-prose` on the three sub-hero intro paragraphs
(CompareClient, country page, topic page) and on `Hero.tsx:23`.

**Verify**: `grep -rn "max-w-2xl" src/app src/components/layout` → no matches on
intro paragraphs (Hero inner `max-w-3xl` title wrapper may remain); `npm run verify`
→ exit 0.

## Done criteria

- [ ] No prose element in PolicyRecord, About, or Contribute exceeds ~65-70ch at any
      viewport (spot-check at 1920px)
- [ ] Single-policy compare cells wrap at ~52ch
- [ ] `npm run verify` and `npm run build` exit 0

## STOP conditions

- A `max-w-prose` cap makes a section look broken next to a full-width sibling
  (e.g. ragged column against a wide card) — report with a screenshot reference
  instead of inventing a different width.

## Maintenance notes

- Rule for future copy surfaces: measure caps live on text elements, width caps on
  shells. Reviewers should reject prose paragraphs without a measure inside
  containers wider than ~700px.
