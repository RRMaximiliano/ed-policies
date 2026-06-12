'use client';

import { useMemo } from 'react';
import { COUNTRY_LABELS, POLICY_TYPE_LABELS, Policy } from '@/types/policy';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';

// Chronological view grouped by decade. Reads as a history of reform waves:
// CCTs clustering in the early 2000s, digital programs around 2010, and so on.
export function PolicyTimelineView({
  policies,
  onPolicyClick,
}: {
  policies: Policy[];
  onPolicyClick: (policy: Policy) => void;
}) {
  const decades = useMemo(() => {
    const sorted = [...policies].sort(
      (a, b) => a.yearStart - b.yearStart || a.name.localeCompare(b.name)
    );
    const groups = new Map<number, Policy[]>();
    for (const policy of sorted) {
      const decade = Math.floor(policy.yearStart / 10) * 10;
      const bucket = groups.get(decade) ?? [];
      bucket.push(policy);
      groups.set(decade, bucket);
    }
    return [...groups.entries()];
  }, [policies]);

  return (
    <div>
      {decades.map(([decade, group]) => (
        <section key={decade} className="border-b border-[#e4e4e7] last:border-b-0">
          <div className="grid md:grid-cols-[140px_1fr]">
            <div className="border-b border-[#e4e4e7] bg-[#f4f4f5] px-5 py-4 md:border-b-0 md:border-r">
              <div className="md:sticky md:top-20">
                <span className="font-display text-2xl text-[#18181b]">{decade}s</span>
                <p className="mt-1 text-xs text-[#52525b]">
                  {group.length} {group.length === 1 ? 'policy' : 'policies'}
                </p>
              </div>
            </div>
            <ol>
              {group.map((policy) => (
                <li
                  key={policy.id}
                  className="border-b border-[#e4e4e7] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => onPolicyClick(policy)}
                    className="grid w-full grid-cols-[3.5rem_1fr] items-baseline gap-x-4 gap-y-1 px-5 py-3.5 text-left transition-colors hover:bg-[#fafafa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e43c8]/40"
                    aria-label={`Quick view of ${policy.name}`}
                  >
                    <span className="font-display tabular-nums text-[#1e43c8]">
                      {policy.yearStart}
                    </span>
                    <span className="min-w-0">
                      <span className="font-display text-[#18181b]">{policy.name}</span>
                      <span className="block text-sm text-[#52525b]">
                        {COUNTRY_LABELS[policy.country]}
                        {' · '}
                        {policy.policyTypes
                          .slice(0, 2)
                          .map((t) => POLICY_TYPE_LABELS[t])
                          .join(', ')}
                        <EvidenceBadge
                          quality={policy.evidenceQuality}
                          className="ml-3 align-baseline"
                        />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </div>
  );
}
