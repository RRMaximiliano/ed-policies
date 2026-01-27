import { FileJson, CheckSquare, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'Contribute | Latin America Education Policy Database',
  description:
    'Learn how to contribute new policies, corrections, or evaluation evidence to the Latin America Education Policy Database.',
};

export default function ContributePage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <div className="relative bg-[#1a2744] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container max-w-4xl px-4 md:px-8 py-16 md:py-24 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-[#c4654a]" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Open Source</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Contribute to the <em className="text-[#c4654a]">Database</em>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            This database is a community resource. We welcome contributions of new policies,
            corrections to existing entries, and additional evaluation evidence.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 md:px-8 py-12 md:py-16">
        {/* How to Contribute */}
        <section className="mb-16">
          <SectionHeader>How to Contribute</SectionHeader>
          <div className="space-y-6 text-[#5c6578] leading-relaxed">
            <div>
              <h3 className="font-medium text-[#1a2744] mb-2">Via GitHub <span className="text-xs text-[#c4654a] uppercase tracking-wide ml-2">Recommended</span></h3>
              <p className="mb-3">
                Fork the repository, add or edit entries in <code className="bg-[#f5f2ed] px-1.5 py-0.5 text-[#1a2744] text-sm">policies.json</code>,
                and submit a Pull Request with sources for all claims.
              </p>
              <a
                href="https://github.com/RRMaximiliano/ed-policies"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#c4654a] hover:underline"
              >
                View repository
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div>
              <h3 className="font-medium text-[#1a2744] mb-2">Via Email</h3>
              <p>
                Send policy information or corrections directly to our team with relevant details and source citations.
              </p>
            </div>
          </div>
        </section>

        {/* Policy Entry Template */}
        <section className="mb-16">
          <SectionHeader>Policy Entry Template</SectionHeader>
          <p className="text-[#5c6578] mb-6 leading-relaxed">
            Each policy entry should include the following information:
          </p>

          <div className="bg-white border border-[#e5e0d8] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 bg-[#f5f2ed] border-b border-[#e5e0d8]">
              <FileJson className="h-5 w-5 text-[#c4654a]" />
              <span className="font-medium text-[#1a2744]">Required Fields</span>
            </div>
            <pre className="p-5 overflow-x-auto text-xs text-[#5c6578] leading-relaxed">
{`{
  "id": "unique-policy-slug",
  "name": "Full Policy Name",
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
  "mechanisms": "How the policy works",
  "coverage": "Number of beneficiaries",

  "evidenceQuality": "high|moderate|emerging|low|none",
  "impactSummary": "Overview of evidence findings",
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
      "methodology": "rct|quasi-experimental|etc",
      "journal": "Journal Name",
      "doi": "10.xxxx/xxxxx",
      "keyFinding": "Main finding from the study"
    }
  ],
  "keyReferences": []
}`}
            </pre>
          </div>
        </section>

        {/* Submission Checklist */}
        <section className="mb-16">
          <SectionHeader>Submission Checklist</SectionHeader>
          <div className="bg-white border border-[#e5e0d8]">
            <div className="flex items-center gap-3 px-5 py-4 bg-[#f5f2ed] border-b border-[#e5e0d8]">
              <CheckSquare className="h-5 w-5 text-[#c4654a]" />
              <span className="font-medium text-[#1a2744]">Before Submitting</span>
            </div>
            <ul className="p-5 space-y-3">
              {[
                'All required fields are filled out',
                'Country code matches our standard list',
                'Policy types and populations use valid values',
                'Dates and numbers are accurate',
                'Summaries are clear and factual',
                'Evidence quality rating is justified',
                'All evaluation studies have proper citations',
                'DOIs or URLs provided where available',
                'Key findings are supported by the cited sources',
                'JSON is valid and properly formatted',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#5c6578]">
                  <CheckSquare className="h-4 w-4 text-[#2d6a4f] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Valid Field Values */}
        <section className="mb-16">
          <SectionHeader>Valid Field Values</SectionHeader>

          <div className="space-y-8">
            <FieldValueGroup
              title="Countries"
              values={[
                'argentina', 'bolivia', 'brazil', 'chile', 'colombia', 'costa-rica', 'cuba',
                'dominican-republic', 'ecuador', 'el-salvador', 'guatemala', 'haiti', 'honduras',
                'mexico', 'nicaragua', 'panama', 'paraguay', 'peru', 'uruguay', 'venezuela',
              ]}
            />

            <FieldValueGroup
              title="Policy Types"
              values={[
                'cct', 'school-feeding', 'digital-inclusion', 'teacher-reform', 'vouchers',
                'higher-ed-access', 'early-childhood', 'extended-day', 'indigenous-ed',
                'tutoring', 'curriculum', 'infrastructure', 'governance',
              ]}
            />

            <FieldValueGroup
              title="Affected Populations"
              values={[
                'early-childhood', 'primary', 'secondary', 'tertiary', 'indigenous',
                'rural', 'low-income', 'women-girls', 'teachers', 'all',
              ]}
            />

            <FieldValueGroup
              title="Study Methodologies"
              values={[
                'rct', 'quasi-experimental', 'regression-discontinuity',
                'difference-in-differences', 'instrumental-variables', 'propensity-score',
                'descriptive', 'qualitative', 'systematic-review', 'meta-analysis',
              ]}
            />
          </div>
        </section>

        {/* Questions */}
        <section>
          <SectionHeader>Questions?</SectionHeader>
          <div className="bg-[#f5f2ed] border-l-4 border-[#c4654a] p-6">
            <p className="text-[#5c6578] leading-relaxed">
              If you have questions about contributing or need help with the submission process, please
              open an issue on GitHub or contact us directly. We appreciate your contributions to making
              this resource more comprehensive and accurate.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-serif text-2xl text-[#1a2744]">{children}</h2>
      <div className="flex-1 h-[1px] bg-[#e5e0d8]" />
    </div>
  );
}

function FieldValueGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="font-medium text-[#1a2744] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="font-mono text-xs bg-white border border-[#e5e0d8] px-2.5 py-1.5 text-[#5c6578] hover:border-[#c4654a]/50 hover:text-[#1a2744] transition-colors"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
