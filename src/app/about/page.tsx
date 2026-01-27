import {
  EVIDENCE_QUALITY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  EvidenceQuality,
} from '@/types/policy';
import { CheckCircle, ArrowUpRight } from 'lucide-react';

export const metadata = {
  title: 'About & Methodology | Latin America Education Policy Database',
  description:
    'Learn about our methodology for cataloging education policies, evidence quality ratings, and how to interpret policy impact findings.',
};

const evidenceStyles: Record<EvidenceQuality, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-[#e8f5e9]', text: 'text-[#1b5e20]', border: 'border-[#c8e6c9]' },
  moderate: { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', border: 'border-[#bbdefb]' },
  emerging: { bg: 'bg-[#fff8e1]', text: 'text-[#e65100]', border: 'border-[#ffecb3]' },
  low: { bg: 'bg-[#fff3e0]', text: 'text-[#bf360c]', border: 'border-[#ffe0b2]' },
  none: { bg: 'bg-[#f5f5f5]', text: 'text-[#616161]', border: 'border-[#e0e0e0]' },
};

export default function AboutPage() {
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
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">Methodology</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            About This <em className="text-[#c4654a]">Database</em>
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
            A comprehensive, searchable resource cataloging education policies implemented across
            20 Latin American countries, designed for researchers, policymakers, and students
            seeking evidence-based insights.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl px-4 md:px-8 py-12 md:py-16">
        {/* Who Is This For */}
        <section className="mb-16">
          <SectionHeader>Who Is This For?</SectionHeader>
          <p className="text-[#5c6578] leading-relaxed">
            This database serves <strong className="text-[#1a2744]">researchers</strong> studying education policy and development economics,
            <strong className="text-[#1a2744]"> policy evaluators</strong> designing impact studies and identifying evidence gaps,
            and <strong className="text-[#1a2744]">policymakers</strong> seeking evidence-based options for improving education outcomes across Latin America.
          </p>
        </section>

        {/* Evidence Quality Ratings */}
        <section className="mb-16">
          <SectionHeader>Evidence Quality Ratings</SectionHeader>
          <p className="text-[#5c6578] mb-8 leading-relaxed">
            We rate each policy&apos;s evidence base on a five-tier scale based on the rigor and
            consistency of available evaluations:
          </p>

          <div className="space-y-4">
            {(Object.keys(EVIDENCE_QUALITY_LABELS) as EvidenceQuality[]).map((quality) => {
              const style = evidenceStyles[quality];
              return (
                <div
                  key={quality}
                  className="flex items-start gap-4 p-5 bg-white border border-[#e5e0d8] hover:border-[#c4654a]/30 transition-colors"
                >
                  <span className={`shrink-0 text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 border ${style.bg} ${style.text} ${style.border}`}>
                    {EVIDENCE_QUALITY_LABELS[quality]}
                  </span>
                  <p className="text-sm text-[#5c6578] leading-relaxed">
                    {EVIDENCE_QUALITY_DESCRIPTIONS[quality]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Study Methodologies */}
        <section className="mb-16">
          <SectionHeader>Study Methodologies</SectionHeader>
          <p className="text-[#5c6578] mb-8 leading-relaxed">
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
          <p className="text-[#5c6578] mb-8 leading-relaxed">
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
              <div key={category.label} className="flex items-start gap-3 p-4 bg-white border border-[#e5e0d8]">
                <CheckCircle className="h-4 w-4 text-[#2d6a4f] mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-[#1a2744]">{category.label}</span>
                  <p className="text-sm text-[#5c6578] mt-1">{category.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-16">
          <SectionHeader>Data Sources</SectionHeader>
          <p className="text-[#5c6578] mb-8 leading-relaxed">
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
                className="flex items-center justify-between p-4 bg-white border border-[#e5e0d8] hover:border-[#c4654a] hover:bg-[#c4654a]/5 transition-all group"
              >
                <span className="text-[#1a2744] group-hover:text-[#c4654a] transition-colors">
                  {source.name}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#5c6578] group-hover:text-[#c4654a] transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-16">
          <SectionHeader>Limitations</SectionHeader>
          <div className="bg-[#f5f2ed] border-l-4 border-[#c4654a] p-6">
            <p className="text-[#5c6578] leading-relaxed">
              This database aims to be comprehensive but has limitations. Not all policies have been
              rigorously evaluated, and we may not have captured all relevant studies. Evidence quality
              ratings are our assessment and may differ from others. Impact findings should be
              interpreted in context—effects may vary by implementation quality, target population, and
              local conditions.
            </p>
          </div>
        </section>

        {/* Citation */}
        <section>
          <SectionHeader>Citation</SectionHeader>
          <div className="bg-[#1a2744] text-white p-6">
            <p className="font-mono text-sm leading-relaxed">
              Latin America Education Policy Database. (2024). Retrieved from [URL]
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
    <div className="p-5 bg-white border border-[#e5e0d8] hover:shadow-md transition-shadow">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-medium text-[#1a2744]">{title}</h3>
        <span className="text-[10px] uppercase tracking-wide text-[#5c6578] bg-[#f5f2ed] px-1.5 py-0.5">
          {acronym}
        </span>
      </div>
      <p className="text-sm text-[#5c6578] leading-relaxed">{description}</p>
    </div>
  );
}
