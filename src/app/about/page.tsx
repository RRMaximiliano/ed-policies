import {
  EVIDENCE_QUALITY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  EvidenceQuality,
  Policy,
} from '@/types/policy';
import { ArrowUpRight } from 'lucide-react';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import policiesData from '@/data/policies.json';

const allPolicies = policiesData as Policy[];
const countryCount = new Set(allPolicies.map((policy) => policy.country)).size;

export const metadata = {
  title: 'About & Methodology | Latin America Education Policy Database',
  description:
    'Learn about our methodology for cataloging education policies, evidence quality ratings, and how to interpret policy impact findings.',
};


export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Page header */}
      <div className="border-b border-[#e4e4e7] bg-white">
        <div className="shell-article py-12 md:py-16">
          <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight tracking-tight text-[#18181b] mb-5">
            About this database
          </h1>
          <p className="text-lg text-[#52525b] leading-relaxed max-w-prose">
            A searchable catalog of education policies implemented across {countryCount} countries
            in Latin America and the Caribbean, built for researchers, policymakers, and
            students.
          </p>
        </div>
      </div>

      <div className="shell-article py-12 md:py-16">
        {/* Who Is This For */}
        <section className="mb-16">
          <SectionHeader>Who Is This For?</SectionHeader>
          <p className="max-w-prose text-[#52525b] leading-relaxed">
            This database serves <strong className="text-[#18181b]">researchers</strong> studying education policy and development economics,
            <strong className="text-[#18181b]"> policy evaluators</strong> designing impact studies and identifying evidence gaps,
            and <strong className="text-[#18181b]">policymakers</strong> seeking evidence-based options for improving education outcomes across Latin America.
          </p>
        </section>

        {/* Evidence Quality Ratings */}
        <section className="mb-16">
          <SectionHeader>Evidence Quality Ratings</SectionHeader>
          <p className="max-w-prose text-[#52525b] mb-8 leading-relaxed">
            We rate each policy&apos;s evidence base on a five-tier scale based on the rigor and
            consistency of available evaluations:
          </p>

          <div className="border border-[#e4e4e7] bg-white">
            {(Object.keys(EVIDENCE_QUALITY_LABELS) as EvidenceQuality[]).map((quality) => (
              <div
                key={quality}
                className="grid gap-1 border-b border-[#e4e4e7] p-5 last:border-b-0 sm:grid-cols-[160px_1fr] sm:gap-4"
              >
                <EvidenceBadge quality={quality} />
                <p className="text-sm text-[#52525b] leading-relaxed">
                  {EVIDENCE_QUALITY_DESCRIPTIONS[quality]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Study Methodologies */}
        <section className="mb-16">
          <SectionHeader>Study Methodologies</SectionHeader>
          <p className="max-w-prose text-[#52525b] mb-8 leading-relaxed">
            We prioritize evaluations using rigorous methodologies that can establish causal impacts:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <MethodCard
              title="Randomized Controlled Trials"
              acronym="RCTs"
              description="The gold standard for causal inference. Participants are randomly assigned to treatment or control groups."
            />
            <MethodCard
              title="Regression Discontinuity"
              acronym="RDD"
              description="Exploits sharp eligibility thresholds to compare outcomes just above and below cutoffs."
            />
            <MethodCard
              title="Difference-in-Differences"
              acronym="DiD"
              description="Compares changes over time between treatment and comparison groups."
            />
            <MethodCard
              title="Instrumental Variables"
              acronym="IV"
              description="Uses exogenous variation to isolate causal effects when randomization isn't possible."
            />
          </div>
        </section>

        {/* Policy Categories */}
        <section className="mb-16">
          <SectionHeader>Policy Categories</SectionHeader>
          <p className="max-w-prose text-[#52525b] mb-8 leading-relaxed">
            Policies are categorized by intervention type. Many policies span multiple categories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Conditional Cash Transfers', desc: 'Payments conditional on school attendance' },
              { label: 'School Feeding', desc: 'Free meals or snacks at school' },
              { label: 'Extended School Day', desc: 'Increased instructional time' },
              { label: 'Digital Inclusion', desc: 'Technology and connectivity programs' },
              { label: 'Teacher Reform', desc: 'Training, evaluation, and incentives' },
              { label: 'Vouchers/School Choice', desc: 'Subsidies for private school attendance' },
              { label: 'Higher Education Access', desc: 'Scholarships and affirmative action' },
              { label: 'Early Childhood', desc: 'Programs for children 0-5' },
              { label: 'Indigenous Education', desc: 'Bilingual and intercultural programs' },
              { label: 'Tutoring', desc: 'One-on-one or small group instruction' },
            ].map((category) => (
              <div key={category.label} className="p-4 bg-white border border-[#e4e4e7]">
                <span className="font-medium text-[#18181b]">{category.label}</span>
                <p className="text-sm text-[#52525b] mt-1">{category.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <SectionHeader>Data Sources</SectionHeader>
          <p className="max-w-prose text-[#52525b] mb-8 leading-relaxed">
            Policy information and evaluation evidence is compiled from peer-reviewed research and
            official government documentation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'IADB Publications', url: 'https://publications.iadb.org/' },
              { name: 'World Bank Documents', url: 'https://documents.worldbank.org/' },
              { name: 'J-PAL Evaluations', url: 'https://www.povertyactionlab.org/' },
              { name: 'ECLAC Social Protection', url: 'https://dds.cepal.org/bpsnc/' },
              { name: 'NBER Working Papers', url: 'https://www.nber.org/' },
              { name: 'VoxDev Education', url: 'https://voxdev.org/topic/education' },
            ].map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border border-[#e4e4e7] hover:border-[#1e43c8] hover:bg-[#1e43c8]/5 transition-all group"
              >
                <span className="text-[#18181b] group-hover:text-[#1e43c8] transition-colors">
                  {source.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#52525b] group-hover:text-[#1e43c8] transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <SectionHeader>Limitations</SectionHeader>
          <div className="bg-[#f4f4f5] border-l-4 border-[#1e43c8] p-6">
            <p className="max-w-prose text-[#52525b] leading-relaxed">
              This database aims to be comprehensive but has limitations. Not all policies have been
              rigorously evaluated, and we may not have captured all relevant studies. Evidence quality
              ratings are our assessment and may differ from others. Impact findings should be
              interpreted in context: effects may vary by implementation quality, target population, and
              local conditions.
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
      <h2 className="font-display text-2xl text-[#18181b]">{children}</h2>
      <div className="flex-1 h-[1px] bg-[#e4e4e7]" />
    </div>
  );
}

function MethodCard({
  title,
  acronym,
  description,
}: {
  title: string;
  acronym: string;
  description: string;
}) {
  return (
    <div className="p-5 bg-white border border-[#e4e4e7] hover:shadow-md transition-shadow">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-medium text-[#18181b]">{title}</h3>
        <span className="text-[10px] uppercase tracking-wide text-[#52525b] bg-[#f4f4f5] px-1.5 py-0.5">
          {acronym}
        </span>
      </div>
      <p className="text-sm text-[#52525b] leading-relaxed">{description}</p>
    </div>
  );
}
