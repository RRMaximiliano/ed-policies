# Latin America Education Policy Database

<!-- badges: start -->
[![Deploy to GitHub Pages](https://github.com/RRMaximiliano/ed-policies/actions/workflows/deploy.yml/badge.svg)](https://github.com/RRMaximiliano/ed-policies/actions/workflows/deploy.yml)
<!-- badges: end -->

A curated collection of evidence-based education policies implemented across 20 Latin American countries. Designed for researchers, policymakers, and PhD students seeking policy information, evaluation evidence, and impact findings.

**Live site**: https://www.rrmaximiliano.com/ed-policies/

## Overview

This database catalogs 54 education policies with detailed information on:

- Policy mechanisms and objectives
- Target populations and coverage
- Evidence quality ratings (high, moderate, emerging, low, none)
- Evaluation studies and key findings
- Academic references

### Coverage

| Category | Count |
|----------|-------|
| Policies | 54 |
| Countries | 15+ |
| Policy types | 13 |
| With rigorous evidence | 20+ |

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
| Framework | Next.js 14+ |
| Styling | Tailwind CSS |
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
  yearEnd?: number;
  isActive: boolean;
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
  evaluations: EvaluationStudy[];
  keyReferences: Reference[];
}
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
