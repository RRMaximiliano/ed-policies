# Plan 007: One page shell — center every page, define width tiers, fix the alignment contract

> **Executor instructions**: Follow this plan step by step. Run every verification
> command and confirm the expected result before moving on. On any STOP condition,
> stop and report. When done, update the status row in `plans/README.md`.
>
> **Drift check (run first)**: this plan was written against an uncommitted working
> tree (HEAD `6dab7b4` + extensive uncommitted changes dated 2026-06-11), so do NOT
> rely on `git diff`. Instead verify the "Current state" excerpts below against the
> live files before starting; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW (mechanical, but visual on every page)
- **Depends on**: none
- **Category**: tech-debt / layout
- **Planned at**: commit `6dab7b4` + uncommitted tree, 2026-06-11

## Why this matters

At any viewport wider than a page's max-width, all content pins to the LEFT edge and
the right side is dead space (confirmed via computed styles: every page container has
`max-width: 1536px` or `896px` but `margin-left/right: 0`). The cause: Tailwind v4's
`container` utility does not center, and none of the 15 page-shell call sites adds
`mx-auto`. Worse, the paired `max-w-*` utility overrides `container`'s own
breakpoint-stepped max-widths in the compiled CSS (later rule, equal specificity), so
`container` contributes nothing at all — it is dead weight that *reads* like a
centered shell. There is also no single place where "how wide is a page" is defined:
every route hand-assembles `container max-w-* px-4 md:px-8 py-*` with drifting
values. This plan replaces all of it with one shell definition.

## Current state

Two width tiers exist, hand-rolled at 15 sites plus one floating tray:

- Wide tier `container max-w-screen-2xl` (1536px): `src/app/page.tsx:116`,
  `src/components/layout/Header.tsx:14`, `src/components/layout/Hero.tsx:18`,
  `src/components/layout/Footer.tsx:7`, `src/app/compare/CompareClient.tsx:34` and `:53`.
- Article tier `container max-w-4xl` (896px): `src/app/about/page.tsx:26` and `:38`,
  `src/app/contribute/page.tsx:14` and `:25`, `src/app/policies/[id]/page.tsx:96`,
  `src/app/countries/[country]/page.tsx:65` and `:84`, `src/app/topics/[type]/page.tsx:69`
  and `:91`.
- `src/components/policy/CompareTray.tsx:24` — `mx-auto flex max-w-screen-2xl ...` —
  the ONLY centered surface in the app; today it misaligns with the left-pinned page
  above 1536px viewports.
- `src/components/layout/Header.tsx:14-16` — padding convention drift: the container
  div has no `px-*`; a child div carries `px-4 md:px-8`. Everywhere else padding sits
  on the container itself.
- `src/app/layout.tsx` — `<main className="flex-1">{children}</main>`: no shared shell.

Typical excerpt (page.tsx:116):

```tsx
<div className="container max-w-screen-2xl px-4 md:px-8 py-6 md:py-8">
```

Repo conventions: Tailwind v4 (`@theme inline` tokens in `src/app/globals.css`),
inline utility classes, square corners, design tokens documented in `CLAUDE.md`.

## The width-tier rule (the design decision this plan encodes)

1. **Every shell centers** (`mx-auto`). Symmetric margins are correct; asymmetric
   emptiness is the bug.
2. **Two tiers, defined once**:
   - `shell-wide`: working surfaces (browser, compare, chrome) — cap at
     **`max-w-7xl` (1280px)**, not 1536px. The audit found nothing inside the wide
     tier that needs more than ~1240px (the 9-column table's intrinsic minimum is
     ~1140px; the 4-column compare matrix ~1232px); 1536px just stretches rows into
     full-bleed scan strips. This also shrinks the chrome/body width gap (WIDTH-02).
   - `shell-article`: reading surfaces — keep **`max-w-4xl` (896px)**.
3. **Chrome (header/footer) uses `shell-wide`**, so its content edge aligns with the
   widest content tier by construction.

## Commands you will need

| Purpose | Command          | Expected |
|---------|------------------|----------|
| Verify  | `npm run verify` | exit 0   |
| Build   | `npm run build`  | exit 0, 143 static pages |

## Scope

**In scope**: `src/app/globals.css` (two utility definitions), the 15 call sites
listed above, `CompareTray.tsx:24`, `Header.tsx:14-16` (move padding onto the shell),
`CLAUDE.md` (document the tiers).

**Out of scope**: `src/components/ui/**`; any text/measure changes (plan 008); any
grid recomposition (plan 009); vertical padding values (leave each page's `py-*` as
is — normalizing vertical rhythm is a separate decision).

## Steps

### Step 1: Define the shells in `src/app/globals.css`

Add custom utilities (Tailwind v4 syntax), near the font utilities:

```css
/* Page shells - the only two content widths in the app. */
@utility shell-wide {
  margin-inline: auto;
  width: 100%;
  max-width: 80rem; /* 1280px */
  padding-inline: 1rem;
  @media (min-width: 768px) { padding-inline: 2rem; }
}
@utility shell-article {
  margin-inline: auto;
  width: 100%;
  max-width: 56rem; /* 896px */
  padding-inline: 1rem;
  @media (min-width: 768px) { padding-inline: 2rem; }
}
```

If `@utility` with nested `@media` fails to compile in this Tailwind version, STOP
and use plain classes in `@layer utilities` with the same declarations instead.

**Verify**: `npm run build` → exit 0.

### Step 2: Replace the wide-tier call sites

At each of: `page.tsx:116`, `Header.tsx:14`, `Hero.tsx:18`, `Footer.tsx:7`,
`CompareClient.tsx:34`, `CompareClient.tsx:53` — replace
`container max-w-screen-2xl px-4 md:px-8` (or the padding-less Header variant) with
`shell-wide`, keeping the existing `py-*` classes. In `Header.tsx`, move the child's
`px-4 md:px-8` onto the shell div (delete from the child at line ~16).
In `CompareTray.tsx:24` replace `mx-auto flex max-w-screen-2xl` with
`shell-wide flex` and remove the now-duplicated `px-4 ... md:px-8` from the parent
fixed bar if doubling up (check rendering; the tray's outer div currently carries the
padding — keep padding in exactly one place).

**Verify**: `grep -rn "max-w-screen-2xl" src --include='*.tsx'` → no matches;
`npm run build` → exit 0.

### Step 3: Replace the article-tier call sites

At the 9 sites listed in Current state, replace `container max-w-4xl px-4 md:px-8`
(some use `px-4 py-8 md:px-8`) with `shell-article` + their existing `py-*`.

**Verify**: `grep -rn '"container ' src --include='*.tsx'` → no matches (the word
`container` must no longer appear in page shells; `@container` queries in
`src/components/ui/card.tsx` are unrelated and stay).

### Step 4: Visual verification at three widths

Run `npm run dev` and check at 1280px, 1920px, and 2560px (browser devtools
responsive mode): on `/`, `/policies/chile-sep`, `/about`, `/compare?policies=bolsa-familia,jamaica-path`:

- content is horizontally centered (equal left/right margins),
- header wordmark, page content left edge, and footer columns share an edge on `/`,
- the compare tray (select 2 policies on `/`) aligns with the table column edges.

**Verify**: manual; then `npm run verify` → exit 0.

### Step 5: Document the rule

In `CLAUDE.md` under Hard conventions add: "Page width is defined ONLY by
`shell-wide` (1280px, working surfaces + chrome) and `shell-article` (896px, reading
surfaces) in globals.css. Never hand-roll `container`/`max-w-*` page shells."

## Done criteria

- [ ] `grep -rn "container max-w" src` → 0 matches
- [ ] Computed style check: on `/` at a 1920px viewport, the shell div has equal
      non-zero `margin-left` and `margin-right`
- [ ] `npm run verify` and `npm run build` exit 0
- [ ] CLAUDE.md documents the two tiers

## STOP conditions

- `@utility` syntax rejected by the Tailwind build (see Step 1 fallback).
- The 1280px wide tier causes a horizontal scrollbar on the 9-column table at
  exactly 1280px viewport — report measurements rather than improvising column
  changes (that is plan 009's territory).

## Maintenance notes

- Plans 008 and 009 build on these shells; land this first.
- Any new route must use one of the two shells; reviewers should reject new
  `max-w-*` page wrappers.
