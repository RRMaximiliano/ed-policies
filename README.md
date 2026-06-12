# Latin America Education Policy Database

<!-- badges: start -->
[![Deploy to GitHub Pages](https://github.com/RRMaximiliano/ed-policies/actions/workflows/deploy.yml/badge.svg)](https://github.com/RRMaximiliano/ed-policies/actions/workflows/deploy.yml)
<!-- badges: end -->

A catalog of education policies implemented across Latin America and the Caribbean. The goal is to document **every education policy that happened in the region, whether or not it has been evaluated**, with evidence ratings and evaluation studies where research exists. Designed for researchers, policymakers, and PhD students.

**Live site**: https://www.rrmaximiliano.com/ed-policies/

## Overview

This database catalogs 100+ education policies (as of June 2026) with detailed information on:

- Policy mechanisms and objectives
- Implementation status (pilot, regional, national, scaled-down, ended)
- Target populations and coverage
- Evidence quality ratings (high, moderate, emerging, low, not yet evaluated)
- Evaluation studies and key findings
- Academic references

Every policy gets its own citable page (`/policies/<id>`), and every country gets a landing page (`/countries/<country>`).

### Coverage

| Category | Count |
|----------|-------|
| Policies | 100+ |
| Countries | 21 |
| Policy types | 13 |
| With evaluation studies | 90+ |

### Policy Types

- Conditional Cash Transfers
- School Feeding Programs
- Extended School Day
- Digital Inclusion
- Teacher Reform
- Vouchers/School Choice
- Higher Education Access
- Early Childhood Education
- Indigenous/Bilingual Education
- Tutoring and Remediation

## Installation

Clone the repository:

```bash
git clone https://github.com/RRMaximiliano/ed-policies.git
cd ed-policies
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

Generate static export:

```bash
npm run build
```

Output is generated in the `out/` directory.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (static export) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| State Management | Zustand |
| Search | Fuse.js |
| Deployment | GitHub Pages |

## Data Structure

Policy entries are stored in `src/data/policies.json`. Each entry includes:

```typescript
interface Policy {
  id: string;
  name: string;
  country: Country;
  yearStart: number;
  yearEnd?: number | null;
  isActive: boolean;
  implementationStatus: 'pilot' | 'regional' | 'national' | 'scaled-down' | 'ended';
  policyTypes: PolicyType[];
  affectedPopulations: AffectedPopulation[];
  summaryShort: string;
  summaryLong: string;
  objectives: string[];
  mechanisms: string;
  coverage?: string;
  evidenceQuality: 'high' | 'moderate' | 'emerging' | 'low' | 'none';
  impactSummary: string;
  keyOutcomes: Outcome[];
  evaluations?: EvaluationStudy[];   // optional: unevaluated policies are first-class
  keyReferences?: Reference[];       // optional
}
```

Policies **without research are first-class entries**: set `evidenceQuality: "none"` and omit `evaluations`/`keyReferences`.

Validate the dataset any time with:

```bash
npm run validate   # schema check for src/data/policies.json
npm run verify     # validate + typecheck + lint (also runs in CI)
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new policies or corrections.

## Data Sources

- IADB Publications
- World Bank Documents
- J-PAL Evaluations
- ECLAC Social Protection Database
- NBER Working Papers
- VoxDev Education Research

## License

MIT
