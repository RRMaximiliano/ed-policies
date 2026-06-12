# CLAUDE.md

Latin America Education Policy Database: a static catalog of education policies across
Latin America and the Caribbean. Product goal: document **every** policy that happened
in the region, evaluated or not. Evidence ratings exist where research exists; a policy
with no research is a first-class entry, never second-class.

## Commands

- `npm run dev` - dev server (no basePath locally; prod serves under `/ed-policies`)
- `npm run verify` - validate data + typecheck + lint (run before any commit; CI runs it)
- `npm run validate` - schema-check `src/data/policies.json` only
- `npm run build` - static export to `out/` (94+ pages)

## Architecture

- **Data**: `src/data/policies.json` (single hand-curated array) typed by
  `src/types/policy.ts` (enums + `Policy` interface). All label maps
  (`COUNTRY_LABELS`, `POLICY_TYPE_LABELS`, ...) live in the types file.
- **Validation**: `scripts/validate-policies.mjs` duplicates the enum lists on purpose
  (runs without TS). **Any schema change in `src/types/policy.ts` must update this
  script in the same commit.**
- **Routes**: `/` (client-side browser: filters + table + dialog), `/policies/[id]`
  (static page per policy via `generateStaticParams`), `/countries/[country]`,
  `/compare?policies=a,b`, `/about`, `/contribute`, `sitemap.ts`.
- **State**: `src/store/filterStore.ts` (Zustand, sessionStorage persist) +
  `src/hooks/useUrlSync.ts` (filters <-> URL params, e.g. `?countries=peru`).
- **Search**: `src/hooks/useSearch.ts` (Fuse.js); command palette is Cmd/Ctrl+K.
- **Shared UI**: `src/components/policy/PolicyRecord.tsx` renders a full policy record
  (used by both the dialog and the static page). Evidence badge styling lives only in
  `src/lib/evidence.ts`.

## Hard conventions

- Page width is defined ONLY by the two shells in `globals.css`: `shell-wide`
  (1280px; working surfaces + header/footer/tray) and `shell-article` (896px;
  reading surfaces). Both center and carry the horizontal padding. Never hand-roll
  `container`/`max-w-*` page wrappers. Measure caps (`max-w-prose`, `max-w-[65ch]`)
  live on text elements, not on shells.
- Static export (`output: 'export'`, basePath `/ed-policies` in prod). Use Next
  `<Link>` with relative hrefs; never hand-prefix the basePath. Absolute URLs for
  metadata/JSON-LD come from `SITE_URL` in `src/lib/site.ts`.
- Design system: neutral paper (`#fafafa`), near-black ink (`#18181b`), one cobalt
  accent (`#1e43c8`), Archivo (grotesque, via `.font-display`) for headings, Source
  Sans 3 for text. Square corners. Evidence levels are text-only colored labels
  (see `src/lib/evidence.ts`), never pastel chips. Avoid AI-default decoration:
  no eyebrow labels, no icon-studded stat tiles, no decorative icons on bullets.
  No em-dashes in UI copy; use hyphens.
- Default sort is year desc (recency), NOT evidence: do not reintroduce
  evidence-first defaults; they bury unevaluated policies.
