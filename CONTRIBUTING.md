# Contributing to the Latin America Education Policy Database

Thank you for your interest in contributing! This database is a community resource, and we welcome contributions of new policies, corrections, and additional evaluation evidence.

## How to Contribute

### Via Pull Request (Recommended)

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Edit `src/data/policies.json`** to add or update policy entries
4. **Validate your JSON** using a linter
5. **Submit a Pull Request** with a clear description of changes

### Via Issue

If you're not comfortable with Git, you can [open an issue](../../issues/new) with the policy information you'd like to add.

## Policy Entry Structure

Each policy entry must include the following fields:

```json
{
  "id": "unique-policy-slug",
  "name": "Full Policy Name in English",
  "nameLocal": "Name in Local Language (optional)",
  "acronym": "ACRONYM (optional)",

  "country": "country-code",
  "yearStart": 2020,
  "yearEnd": null,
  "isActive": true,

  "policyTypes": ["cct", "school-feeding"],
  "affectedPopulations": ["primary", "low-income"],

  "summaryShort": "1-2 sentence description for cards",
  "summaryLong": "1-2 paragraph detailed description",
  "objectives": [
    "First objective",
    "Second objective"
  ],
  "mechanisms": "How the policy works in detail",
  "coverage": "Number of beneficiaries",

  "evidenceQuality": "high|moderate|emerging|low|none",
  "impactSummary": "Overview of evaluation findings",
  "keyOutcomes": [
    {
      "metric": "Outcome measure",
      "effect": "Effect size or description",
      "source": "Author Year"
    }
  ],
  "evaluations": [
    {
      "authors": "Author Names",
      "year": 2020,
      "title": "Study Title",
      "methodology": "rct",
      "journal": "Journal Name",
      "doi": "10.xxxx/xxxxx",
      "keyFinding": "Main finding from the study"
    }
  ],
  "keyReferences": []
}
```

## Valid Field Values

### Countries

```
argentina, bolivia, brazil, chile, colombia, costa-rica, cuba,
dominican-republic, ecuador, el-salvador, guatemala, haiti, honduras,
mexico, nicaragua, panama, paraguay, peru, uruguay, venezuela
```

### Policy Types

```
cct, school-feeding, digital-inclusion, teacher-reform, vouchers,
higher-ed-access, early-childhood, extended-day, indigenous-ed,
tutoring, curriculum, infrastructure, governance
```

### Affected Populations

```
early-childhood, primary, secondary, tertiary, indigenous,
rural, low-income, women-girls, teachers, all
```

### Evidence Quality

| Rating | Definition |
|--------|------------|
| `high` | Multiple RCTs or rigorous quasi-experimental studies with consistent findings |
| `moderate` | At least one well-designed RCT or multiple high-quality quasi-experimental studies |
| `emerging` | Promising evidence from quasi-experimental studies or early-stage RCTs |
| `low` | Limited evidence, primarily descriptive or correlational studies |
| `none` | No systematic evaluation evidence available |

### Study Methodologies

```
rct, quasi-experimental, regression-discontinuity, difference-in-differences,
instrumental-variables, propensity-score, descriptive, qualitative,
systematic-review, meta-analysis
```

## Submission Checklist

Before submitting, please verify:

- [ ] All required fields are filled out
- [ ] Country code matches our standard list
- [ ] Policy types and populations use valid values
- [ ] Dates and numbers are accurate
- [ ] Summaries are clear, factual, and concise
- [ ] Evidence quality rating is justified by cited studies
- [ ] All evaluation studies have proper citations
- [ ] DOIs or URLs provided where available
- [ ] Key findings are supported by the cited sources
- [ ] JSON is valid and properly formatted

## Code of Conduct

- Be respectful and constructive
- Provide accurate, well-sourced information
- Do not include promotional or biased content
- Acknowledge uncertainty when evidence is limited

## Questions?

Open an issue if you have questions about contributing.
