'use client';

import Link from 'next/link';
import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  POLICY_TYPE_LABELS,
  Policy,
  PolicySortKey,
  PolicySortState,
} from '@/types/policy';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface PolicyResultsTableProps {
  policies: Policy[];
  sort: PolicySortState;
  onSortChange: (sort: PolicySortState) => void;
  onPolicyClick: (policy: Policy) => void;
  selectedCompareIds: string[];
  compareLimit?: number;
  onToggleCompare: (policy: Policy) => void;
}

const sortableColumns: Array<{
  key: PolicySortKey;
  label: string;
  className?: string;
}> = [
  { key: 'name', label: 'Policy', className: 'min-w-[230px]' },
  { key: 'country', label: 'Country' },
  { key: 'year', label: 'Years' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'studies', label: 'Studies' },
];

export function PolicyResultsTable({
  policies,
  sort,
  onSortChange,
  onPolicyClick,
  selectedCompareIds,
  compareLimit = 4,
  onToggleCompare,
}: PolicyResultsTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#f4f4f5] text-left text-xs uppercase text-[#52525b]">
            <tr>
              <th className="w-14 border-b border-[#e4e4e7] px-3 py-3 font-medium">
                Compare
              </th>
              {sortableColumns.map((column) => (
                <th
                  key={column.key}
                  aria-sort={
                    sort.key === column.key
                      ? sort.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                  className={`border-b border-[#e4e4e7] px-3 py-3 font-medium ${column.className || ''}`}
                >
                  <SortHeader
                    label={column.label}
                    sortKey={column.key}
                    sort={sort}
                    onSortChange={onSortChange}
                  />
                </th>
              ))}
              <th className="min-w-[110px] border-b border-[#e4e4e7] px-3 py-3 font-medium">
                Type
              </th>
              <th className="hidden min-w-[140px] border-b border-[#e4e4e7] px-3 py-3 font-medium xl:table-cell">
                Target
              </th>
              <th className="hidden min-w-[200px] border-b border-[#e4e4e7] px-3 py-3 font-medium 2xl:table-cell">
                Key outcome
              </th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => {
              const isSelected = selectedCompareIds.includes(policy.id);
              const isDisabled = !isSelected && selectedCompareIds.length >= compareLimit;

              return (
                <tr
                  key={policy.id}
                  tabIndex={0}
                  onClick={() => onPolicyClick(policy)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onPolicyClick(policy);
                    }
                  }}
                  className="cursor-pointer border-b border-[#e4e4e7] transition-colors last:border-b-0 hover:bg-[#fafafa] focus:bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#1e43c8]/40"
                  aria-label={`Open details for ${policy.name}`}
                >
                  <td className="px-3 py-3.5 align-top">
                    <CompareControl
                      policy={policy}
                      checked={isSelected}
                      disabled={isDisabled}
                      onToggleCompare={onToggleCompare}
                      compact
                    />
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <Link
                      href={`/policies/${policy.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="[overflow-wrap:anywhere] font-display text-base leading-snug text-[#18181b] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1e43c8]/40"
                    >
                      {policy.name}
                    </Link>
                    {policy.acronym && (
                      <div className="mt-1 text-xs uppercase text-[#52525b]">
                        {policy.acronym}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3.5 align-top text-[#18181b]">
                    {COUNTRY_LABELS[policy.country]}
                  </td>
                  <td className="px-3 py-3.5 align-top text-[#52525b]">
                    {formatYears(policy)}
                  </td>
                  <td className="px-3 py-3.5 align-top">
                    <EvidenceBadge quality={policy.evidenceQuality} />
                  </td>
                  <td className="px-3 py-3.5 align-top text-[#18181b]">
                    {policy.evaluations?.length ?? 0}
                  </td>
                  <td className="px-3 py-3.5 align-top text-[#52525b]">
                    {formatList(policy.policyTypes.map((type) => POLICY_TYPE_LABELS[type]))}
                  </td>
                  <td className="hidden px-3 py-3.5 align-top text-[#52525b] xl:table-cell">
                    {formatList(
                      policy.affectedPopulations.map((population) => AFFECTED_POPULATION_LABELS[population])
                    )}
                  </td>
                  <td className="hidden px-3 py-3.5 align-top text-[#52525b] 2xl:table-cell">
                    <span className="line-clamp-2">
                      {policy.keyOutcomes[0]?.effect || policy.impactSummary}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 lg:hidden">
        {policies.map((policy) => {
          const isSelected = selectedCompareIds.includes(policy.id);
          const isDisabled = !isSelected && selectedCompareIds.length >= compareLimit;

          return (
            <article
              key={policy.id}
              className="border-b border-[#e4e4e7] px-4 py-4 md:odd:border-r"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onPolicyClick(policy)}
                  className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-[#1e43c8]/40"
                >
                  <h3 className="font-display text-lg leading-snug text-[#18181b]">
                    {policy.name}
                  </h3>
                  {policy.acronym && (
                    <p className="mt-1 text-xs uppercase text-[#52525b]">{policy.acronym}</p>
                  )}
                </button>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <EvidenceBadge quality={policy.evidenceQuality} />
                  <CompareControl
                    policy={policy}
                    checked={isSelected}
                    disabled={isDisabled}
                    onToggleCompare={onToggleCompare}
                    compact
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onPolicyClick(policy)}
                className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#1e43c8]/40"
              >
                <div className="grid grid-cols-2 gap-3 text-xs text-[#52525b]">
                  <Meta label="Country" value={COUNTRY_LABELS[policy.country]} />
                  <Meta label="Years" value={formatYears(policy)} />
                  <Meta label="Studies" value={String(policy.evaluations?.length ?? 0)} />
                  <Meta
                    label="Type"
                    value={formatList(policy.policyTypes.map((type) => POLICY_TYPE_LABELS[type]))}
                  />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#52525b]">
                  {policy.keyOutcomes[0]?.effect || policy.summaryShort}
                </p>
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSortChange,
}: {
  label: string;
  sortKey: PolicySortKey;
  sort: PolicySortState;
  onSortChange: (sort: PolicySortState) => void;
}) {
  const isActive = sort.key === sortKey;
  const nextDirection = isActive && sort.direction === 'asc' ? 'desc' : 'asc';

  return (
    <button
      type="button"
      onClick={() => onSortChange({ key: sortKey, direction: nextDirection })}
      className={`inline-flex items-center gap-1.5 text-left hover:text-[#18181b] ${
        isActive ? 'text-[#18181b] underline decoration-[#1e43c8] decoration-2 underline-offset-4' : ''
      }`}
    >
      {label}
      {isActive ? (
        sort.direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5 text-[#1e43c8]" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-[#1e43c8]" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}

function CompareControl({
  policy,
  checked,
  disabled,
  onToggleCompare,
  compact = false,
}: {
  policy: Policy;
  checked: boolean;
  disabled: boolean;
  onToggleCompare: (policy: Policy) => void;
  compact?: boolean;
}) {
  return (
    <label
      className={`inline-flex items-center gap-2 text-xs ${
        disabled ? 'cursor-not-allowed text-[#52525b]/50' : 'cursor-pointer text-[#18181b]'
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggleCompare(policy)}
        className="h-4 w-4 accent-[#18181b]"
        aria-label={`${checked ? 'Remove' : 'Add'} ${policy.name} ${checked ? 'from' : 'to'} comparison`}
      />
      {!compact && <span>{checked ? 'Selected' : 'Compare'}</span>}
    </label>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 uppercase tracking-wide text-[#52525b]/70">{label}</div>
      <div className="text-[#18181b]">{value}</div>
    </div>
  );
}

function formatYears(policy: Policy) {
  return `${policy.yearStart}${policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}`;
}

function formatList(values: string[], max = 2) {
  if (values.length <= max) {
    return values.join(', ');
  }

  return `${values.slice(0, max).join(', ')} +${values.length - max}`;
}
