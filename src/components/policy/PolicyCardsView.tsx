'use client';

import Link from 'next/link';
import {
  COUNTRY_LABELS,
  IMPLEMENTATION_STATUS_LABELS,
  POLICY_TYPE_LABELS,
  Policy,
} from '@/types/policy';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';

export function PolicyCardsView({
  policies,
  onPolicyClick,
}: {
  policies: Policy[];
  onPolicyClick: (policy: Policy) => void;
}) {
  return (
    <div className="grid gap-px bg-[#e4e4e7] sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {policies.map((policy) => (
        <article key={policy.id} className="flex flex-col bg-white">
          <button
            type="button"
            onClick={() => onPolicyClick(policy)}
            className="flex flex-1 flex-col items-start gap-2 p-5 text-left transition-colors hover:bg-[#fafafa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e43c8]/40"
            aria-label={`Quick view of ${policy.name}`}
          >
            <div className="flex w-full items-start justify-between gap-3">
              <h3 className="font-display text-lg leading-snug text-[#18181b]">{policy.name}</h3>
              <EvidenceBadge quality={policy.evidenceQuality} className="shrink-0" />
            </div>
            <p className="text-sm text-[#52525b]">
              {COUNTRY_LABELS[policy.country]}, {policy.yearStart}
              {policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}
              {' · '}
              {IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}
            </p>
            <p className="line-clamp-3 max-w-[65ch] text-sm leading-relaxed text-[#52525b]">
              {policy.summaryShort}
            </p>
            <p className="mt-auto pt-2 text-xs uppercase tracking-wide text-[#52525b]/80">
              {policy.policyTypes.map((t) => POLICY_TYPE_LABELS[t]).join(', ')}
            </p>
          </button>
          <div className="border-t border-[#e4e4e7] px-5 py-2.5">
            <Link
              href={`/policies/${policy.id}`}
              className="text-xs font-medium text-[#1e43c8] hover:underline"
            >
              Full record
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
