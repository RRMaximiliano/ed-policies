'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  POLICY_TYPE_LABELS,
  STUDY_METHODOLOGY_LABELS,
  Policy,
} from '@/types/policy';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import policiesData from '@/data/policies.json';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const allPolicies = policiesData as Policy[];
const compareLimit = 4;

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
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-[#e4e4e7] bg-[#fafafa]">
        <div className="shell-wide py-8 md:py-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#52525b] hover:text-[#18181b]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to browser
          </Link>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[#18181b] md:text-5xl">
            Policy comparison
          </h1>
          <p className="mt-4 max-w-prose text-[#52525b]">
            {selectedPolicies.length > 0
              ? `Comparing ${selectedPolicies.length} ${selectedPolicies.length === 1 ? 'policy' : 'policies'} by implementation context, target population, evidence strength, outcomes, and sources.`
              : 'Compare policies by implementation context, target population, evidence strength, outcomes, and sources.'}
          </p>
        </div>
      </header>

      <main className="shell-wide py-8">
        {selectedPolicies.length === 0 ? (
          <EmptyCompareState />
        ) : (
          <>
            {selectedPolicies.length === 1 && (
              <div className="mb-6 border border-[#e4e4e7] bg-white p-4 text-sm text-[#52525b]">
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
    <div className="border border-[#e4e4e7] bg-white p-8 text-center">
      <h2 className="font-display text-2xl text-[#18181b]">No policies selected</h2>
      <p className="mx-auto mt-3 max-w-xl text-[#52525b]">
        Go back to the policy browser, select 2-4 policies, and open the comparison from the tray.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center bg-[#18181b] px-4 text-sm font-medium text-white hover:bg-[#2f2f36]"
      >
        Browse policies
      </Link>
    </div>
  );
}

function CompareMatrix({ policies }: { policies: Policy[] }) {
  return (
    <div className="overflow-x-auto border border-[#e4e4e7] bg-white">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-[#18181b] bg-[#f4f4f5]">
            <th className="sticky left-0 z-10 w-48 border-r border-[#e4e4e7] bg-[#f4f4f5] px-4 py-4 text-left text-xs uppercase font-medium text-[#52525b]">
              Field
            </th>
            {policies.map((policy) => (
              <th
                key={policy.id}
                className="min-w-[260px] border-r border-[#e4e4e7] px-4 py-4 text-left align-top last:border-r-0"
              >
                <div className="font-display text-xl leading-snug text-[#18181b]">
                  {policy.name}
                </div>
                {policy.acronym && (
                  <div className="mt-1 text-xs uppercase text-[#52525b]">{policy.acronym}</div>
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
                    <span className="font-medium text-[#18181b]">{outcome.metric}: </span>
                    <span>{outcome.effect}</span>
                    {outcome.source && <span className="text-[#52525b]/70"> ({outcome.source})</span>}
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
    <tr className="border-b border-[#e4e4e7] last:border-b-0">
      <th className="sticky left-0 z-10 border-r border-[#e4e4e7] bg-[#f4f4f5] px-4 py-4 text-left align-top text-xs uppercase font-medium text-[#52525b]">
        {label}
      </th>
      {policies.map((policy) => (
        <td key={policy.id} className="border-r border-[#e4e4e7] px-4 py-4 align-top text-[#52525b] last:border-r-0">
          <div className="max-w-[52ch]">{render(policy)}</div>
        </td>
      ))}
    </tr>
  );
}

function EvidenceBlock({ policy }: { policy: Policy }) {
  return (
    <div className="space-y-3">
      <EvidenceBadge quality={policy.evidenceQuality} />
      <p>{EVIDENCE_QUALITY_DESCRIPTIONS[policy.evidenceQuality]}</p>
    </div>
  );
}

function EvaluationList({ policy }: { policy: Policy }) {
  const evaluations = policy.evaluations ?? [];
  if (evaluations.length === 0) {
    return 'No evaluation studies yet';
  }

  return (
    <ul className="space-y-4">
      {evaluations.map((study, index) => (
        <li key={`${study.title}-${index}`}>
          <div className="font-medium text-[#18181b]">{study.title}</div>
          <div className="mt-1 text-xs text-[#52525b]">
            {study.authors} ({study.year}) - {STUDY_METHODOLOGY_LABELS[study.methodology]}
          </div>
          <p className="mt-2">{study.keyFinding}</p>
          {(study.doi || study.url) && (
            <a
              href={study.doi ? `https://doi.org/${study.doi}` : study.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#1e43c8] hover:underline"
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
  const references = policy.keyReferences ?? [];
  if (references.length === 0) {
    return 'No key references listed';
  }

  return (
    <ul className="space-y-3">
      {references.slice(0, 3).map((reference, index) => (
        <li key={`${reference.title}-${index}`}>
          <span className="font-medium text-[#18181b]">{reference.authors}</span> ({reference.year}).{' '}
          <em>{reference.title}</em>. {reference.source}.
          {reference.url && (
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1 text-[#1e43c8] hover:underline"
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
