import Link from 'next/link';
import {
  Policy,
  COUNTRY_LABELS,
  POLICY_TYPE_LABELS,
  AFFECTED_POPULATION_LABELS,
  EVIDENCE_QUALITY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  IMPLEMENTATION_STATUS_LABELS,
  STUDY_METHODOLOGY_LABELS,
} from '@/types/policy';
import { EVIDENCE_BADGE_CLASSES } from '@/lib/evidence';
import { ExternalLink } from 'lucide-react';

interface PolicyRecordProps {
  policy: Policy;
  /** 'h1' on standalone pages, 'h2' inside the dialog (which carries its own sr-only DialogTitle). */
  headingLevel?: 'h1' | 'h2';
  /**
   * Extra classes on the Categories/Populations block. The record page passes
   * 'xl:hidden' because it shows the same taxonomy in its sticky facts rail at xl;
   * the dialog leaves this empty.
   */
  taxonomyClassName?: string;
}

export function PolicyRecord({
  policy,
  headingLevel = 'h2',
  taxonomyClassName = '',
}: PolicyRecordProps) {
  const Heading = headingLevel;
  const evaluations = policy.evaluations ?? [];
  const references = policy.keyReferences ?? [];

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[#e4e4e7] px-6 pb-6 pt-7">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-wide">
          <span className={EVIDENCE_BADGE_CLASSES[policy.evidenceQuality]}>
            {EVIDENCE_QUALITY_LABELS[policy.evidenceQuality]}
            {policy.evidenceQuality !== 'none' && ' evidence'}
          </span>
          <span className="text-[#52525b]">
            {IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}
          </span>
          {policy.isActive && <span className="text-[#52525b]">Active</span>}
        </div>
        <Heading className="pr-8 font-display text-2xl font-semibold leading-tight tracking-tight text-[#18181b] [overflow-wrap:anywhere] md:text-3xl">
          {policy.name}
          {policy.acronym && (
            <span className="ml-2 font-normal text-[#52525b]">({policy.acronym})</span>
          )}
        </Heading>
        {policy.nameLocal && (
          <p className="mt-1 break-words text-[#52525b]">{policy.nameLocal}</p>
        )}

        <p className="mt-4 text-sm text-[#52525b]">
          <span className="font-medium text-[#18181b]">{COUNTRY_LABELS[policy.country]}</span>
          {', '}
          {policy.yearStart}
          {policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}
          {policy.coverage && (
            <span className="mt-1 block">{policy.coverage}</span>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 break-words p-6">
        <Section title="Summary">
          <p className="max-w-prose leading-relaxed text-[#52525b]">{policy.summaryLong}</p>
        </Section>

        <Section title="Objectives">
          <ul className="max-w-prose list-disc space-y-2 pl-5 text-[#52525b] marker:text-[#1e43c8]">
            {policy.objectives.map((objective, idx) => (
              <li key={idx} className="pl-1">
                {objective}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Mechanisms">
          <p className="max-w-prose leading-relaxed text-[#52525b]">{policy.mechanisms}</p>
        </Section>

        <div className={`grid gap-6 md:grid-cols-2 ${taxonomyClassName}`}>
          <Section title="Policy Categories">
            <div className="flex flex-wrap gap-2">
              {policy.policyTypes.map((type) => (
                <Link
                  key={type}
                  href={`/topics/${type}`}
                  className="border border-[#e4e4e7] bg-[#f4f4f5] px-2.5 py-1.5 text-[10px] uppercase tracking-wide text-[#52525b] transition-colors hover:border-[#1e43c8] hover:text-[#18181b]"
                >
                  {POLICY_TYPE_LABELS[type]}
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Target Populations">
            <div className="flex flex-wrap gap-2">
              {policy.affectedPopulations.map((pop) => (
                <span
                  key={pop}
                  className="border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-wide text-[#52525b]"
                >
                  {AFFECTED_POPULATION_LABELS[pop]}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <div className="border-t border-[#e4e4e7]" />

        <Section
          title="Evidence & Impact"
          badge={
            <span
              className={`text-[11px] font-semibold uppercase tracking-wide ${EVIDENCE_BADGE_CLASSES[policy.evidenceQuality]}`}
            >
              {EVIDENCE_QUALITY_LABELS[policy.evidenceQuality]}
            </span>
          }
        >
          <p className="mb-4 max-w-prose border-l-2 border-[#e4e4e7] pl-4 text-sm leading-relaxed text-[#52525b]">
            {EVIDENCE_QUALITY_DESCRIPTIONS[policy.evidenceQuality]}
          </p>

          <p className="mb-6 max-w-prose leading-relaxed text-[#52525b]">{policy.impactSummary}</p>

          {policy.keyOutcomes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-[#52525b]">
                Key Outcomes
              </h4>
              {policy.keyOutcomes.map((outcome, idx) => (
                <div key={idx} className="border border-[#e4e4e7] bg-white p-4">
                  <span className="text-sm font-medium text-[#18181b]">{outcome.metric}: </span>
                  <span className="text-sm text-[#52525b]">{outcome.effect}</span>
                  {outcome.source && (
                    <span className="ml-1 text-xs text-[#52525b]/70">({outcome.source})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Section>

        {evaluations.length > 0 ? (
          <Section title="Evaluation Studies">
            <div className="space-y-4">
              {evaluations.map((study, idx) => (
                <div key={idx} className="border border-[#e4e4e7] bg-white p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h4 className="font-display leading-snug text-[#18181b]">{study.title}</h4>
                    <span className="shrink-0 border border-[#e4e4e7] bg-[#f4f4f5] px-2 py-1 text-[10px] uppercase tracking-wide text-[#52525b]">
                      {STUDY_METHODOLOGY_LABELS[study.methodology]}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-[#52525b]">
                    {study.authors} ({study.year})
                    {study.journal && <span className="text-[#52525b]/70">, {study.journal}</span>}
                  </p>
                  <p className="border-l-2 border-[#1e43c8] pl-4 text-sm italic text-[#52525b]">
                    &ldquo;{study.keyFinding}&rdquo;
                  </p>
                  {(study.doi || study.url) && (
                    <a
                      href={study.doi ? `https://doi.org/${study.doi}` : study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 break-all text-sm text-[#1e43c8] hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      <span className="break-all">{study.doi ? `DOI: ${study.doi}` : 'View source'}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section title="Evaluation Studies">
            <div className="border border-dashed border-[#d4d4d8] bg-[#fafafa] p-5">
              <p className="text-sm font-medium text-[#18181b]">No evaluation studies yet</p>
              <p className="mt-1 text-sm leading-relaxed text-[#52525b]">
                This policy has not been systematically evaluated. It is cataloged because it
                happened, and that makes it a candidate for future research.
              </p>
            </div>
          </Section>
        )}

        {references.length > 0 && (
          <Section title="Key References">
            <ul className="space-y-3">
              {references.map((ref, idx) => (
                <li
                  key={idx}
                  className="-indent-5 max-w-prose pl-5 text-sm leading-relaxed text-[#52525b]"
                >
                  {ref.authors} ({ref.year}). <em>{ref.title}</em>. {ref.source}.
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 text-[#1e43c8] hover:underline"
                    >
                      Source
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-display text-lg text-[#18181b]">{title}</h3>
        {badge}
      </div>
      {children}
    </div>
  );
}
