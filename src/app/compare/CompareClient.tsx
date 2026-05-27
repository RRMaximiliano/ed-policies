'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  EVIDENCE_QUALITY_LABELS,
  POLICY_TYPE_LABELS,
  STUDY_METHODOLOGY_LABELS,
  EvidenceQuality,
  Policy,
} from '@/types/policy';
import policiesData from '@/data/policies.json';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const allPolicies = policiesData as Policy[];
const compareLimit = 4;

const evidenceBadgeStyles: Record<EvidenceQuality, string> = {
  high: 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]',
  moderate: 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]',
  emerging: 'bg-[#fff8e1] text-[#e65100] border-[#ffecb3]',
  low: 'bg-[#fff3e0] text-[#bf360c] border-[#ffe0b2]',
  none: 'bg-[#f5f5f5] text-[#616161] border-[#e0e0e0]',
};

export function CompareClient() {
  const searchParams = useSearchParams();
  const requestedIds = (searchParams.get('policies') || '')
    .split(',')
    .filter(Boolean)
    .slice(0, compareLimit);
  const selectedPolicies = requestedIds
    .map((id) => allPolicies.find((policy) => policy.id === id))
    .filter((policy): policy is Policy => Boolean(policy));

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="border-b border-[#e5e0d8] bg-[#fbfaf7]">
        <div className="container max-w-screen-2xl px-4 py-8 md:px-8 md:py-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#5c6578] hover:text-[#1a2744]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to browser
          </Link>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-10 bg-[#c4654a]" />
                <span className="text-xs uppercase text-[#5c6578]">Comparison</span>
              </div>
              <h1 className="font-serif text-3xl leading-tight text-[#1a2744] md:text-5xl">
                Policy Comparison
              </h1>
              <p className="mt-4 max-w-2xl text-[#5c6578]">
                Compare selected policies by implementation context, target population, evidence
                strength, key outcomes, evaluation studies, and source material.
              </p>
            </div>
            <div className="border border-[#e5e0d8] bg-white px-5 py-4">
              <div className="font-serif text-3xl text-[#1a2744]">{selectedPolicies.length}</div>
              <div className="text-sm text-[#5c6578]">Selected policies</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-screen-2xl px-4 py-8 md:px-8">
        {selectedPolicies.length === 0 ? (
          <EmptyCompareState />
        ) : (
          <>
            {selectedPolicies.length === 1 && (
              <div className="mb-6 border border-[#e5e0d8] bg-white p-4 text-sm text-[#5c6578]">
                Select at least one more policy from the browser for a meaningful comparison.
              </div>
            )}
            <CompareMatrix policies={selectedPolicies} />
          </>
        )}
      </main>
    </div>
  );
}

function EmptyCompareState() {
  return (
    <div className="border border-[#e5e0d8] bg-white p-8 text-center">
      <h2 className="font-serif text-2xl text-[#1a2744]">No policies selected</h2>
      <p className="mx-auto mt-3 max-w-xl text-[#5c6578]">
        Go back to the policy browser, select 2-4 policies, and open the comparison from the tray.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center bg-[#1a2744] px-4 text-sm font-medium text-white hover:bg-[#26385f]"
      >
        Browse policies
      </Link>
    </div>
  );
}

function CompareMatrix({ policies }: { policies: Policy[] }) {
  return (
    <div className="overflow-x-auto border border-[#e5e0d8] bg-white">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead>
          <tr className="bg-[#1a2744] text-white">
            <th className="sticky left-0 z-10 w-48 border-r border-white/10 bg-[#1a2744] px-4 py-4 text-left text-xs uppercase font-medium text-white/70">
              Field
            </th>
            {policies.map((policy) => (
              <th
                key={policy.id}
                className="min-w-[260px] border-r border-white/10 px-4 py-4 text-left align-top last:border-r-0"
              >
                <div className="font-serif text-xl font-normal leading-snug text-white">
                  {policy.name}
                </div>
                {policy.acronym && (
                  <div className="mt-1 text-xs uppercase text-white/55">{policy.acronym}</div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <CompareRow label="Country" policies={policies} render={(policy) => COUNTRY_LABELS[policy.country]} />
          <CompareRow label="Years" policies={policies} render={formatYears} />
          <CompareRow
            label="Policy type"
            policies={policies}
            render={(policy) => formatList(policy.policyTypes.map((type) => POLICY_TYPE_LABELS[type]))}
          />
          <CompareRow
            label="Target population"
            policies={policies}
            render={(policy) =>
              formatList(policy.affectedPopulations.map((population) => AFFECTED_POPULATION_LABELS[population]))
            }
          />
          <CompareRow
            label="Evidence rating"
            policies={policies}
            render={(policy) => <EvidenceBlock policy={policy} />}
          />
          <CompareRow
            label="Key outcomes"
            policies={policies}
            render={(policy) => (
              <ul className="space-y-2">
                {(policy.keyOutcomes.length > 0
                  ? policy.keyOutcomes
                  : [{ metric: 'Impact', effect: policy.impactSummary }]
                ).map((outcome, index) => (
                  <li key={`${outcome.metric}-${index}`}>
                    <span className="font-medium text-[#1a2744]">{outcome.metric}: </span>
                    <span>{outcome.effect}</span>
                    {outcome.source && <span className="text-[#5c6578]/70"> ({outcome.source})</span>}
                  </li>
                ))}
              </ul>
            )}
          />
          <CompareRow label="Mechanism" policies={policies} render={(policy) => policy.mechanisms} />
          <CompareRow label="Coverage" policies={policies} render={(policy) => policy.coverage || 'Not specified'} />
          <CompareRow
            label="Evaluation studies"
            policies={policies}
            render={(policy) => <EvaluationList policy={policy} />}
          />
          <CompareRow
            label="Key references"
            policies={policies}
            render={(policy) => <ReferenceList policy={policy} />}
          />
        </tbody>
      </table>
    </div>
  );
}

function CompareRow({
  label,
  policies,
  render,
}: {
  label: string;
  policies: Policy[];
  render: (policy: Policy) => ReactNode;
}) {
  return (
    <tr className="border-b border-[#e5e0d8] last:border-b-0">
      <th className="sticky left-0 z-10 border-r border-[#e5e0d8] bg-[#f5f2ed] px-4 py-4 text-left align-top text-xs uppercase font-medium text-[#5c6578]">
        {label}
      </th>
      {policies.map((policy) => (
        <td key={policy.id} className="border-r border-[#e5e0d8] px-4 py-4 align-top text-[#5c6578] last:border-r-0">
          {render(policy)}
        </td>
      ))}
    </tr>
  );
}

function EvidenceBlock({ policy }: { policy: Policy }) {
  return (
    <div className="space-y-3">
      <span
        className={`inline-flex items-center border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${evidenceBadgeStyles[policy.evidenceQuality]}`}
      >
        {EVIDENCE_QUALITY_LABELS[policy.evidenceQuality]}
      </span>
      <p>{EVIDENCE_QUALITY_DESCRIPTIONS[policy.evidenceQuality]}</p>
    </div>
  );
}

function EvaluationList({ policy }: { policy: Policy }) {
  if (policy.evaluations.length === 0) {
    return 'No evaluation studies listed';
  }

  return (
    <ul className="space-y-4">
      {policy.evaluations.map((study, index) => (
        <li key={`${study.title}-${index}`}>
          <div className="font-medium text-[#1a2744]">{study.title}</div>
          <div className="mt-1 text-xs text-[#5c6578]">
            {study.authors} ({study.year}) - {STUDY_METHODOLOGY_LABELS[study.methodology]}
          </div>
          <p className="mt-2">{study.keyFinding}</p>
          {(study.doi || study.url) && (
            <a
              href={study.doi ? `https://doi.org/${study.doi}` : study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#c4654a] hover:underline"
            >
              Source
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function ReferenceList({ policy }: { policy: Policy }) {
  if (policy.keyReferences.length === 0) {
    return 'No key references listed';
  }

  return (
    <ul className="space-y-3">
      {policy.keyReferences.slice(0, 3).map((reference, index) => (
        <li key={`${reference.title}-${index}`}>
          <span className="font-medium text-[#1a2744]">{reference.authors}</span> ({reference.year}).{' '}
          <em>{reference.title}</em>. {reference.source}.
          {reference.url && (
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1 text-[#c4654a] hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function formatYears(policy: Policy) {
  return `${policy.yearStart}${policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}`;
}

function formatList(values: string[]) {
  return values.join(', ');
}
