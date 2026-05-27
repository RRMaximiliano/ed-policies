'use client';

import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  EVIDENCE_QUALITY_LABELS,
  POLICY_TYPE_LABELS,
  EvidenceQuality,
  Policy,
  PolicySortKey,
  PolicySortState,
} from '@/types/policy';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  FileSearch,
  RotateCcw,
} from 'lucide-react';

interface PolicyResultsTableProps {
  policies: Policy[];
  totalCount: number;
  sort: PolicySortState;
  onSortChange: (sort: PolicySortState) => void;
  onPolicyClick: (policy: Policy) => void;
  selectedCompareIds: string[];
  compareLimit?: number;
  onToggleCompare: (policy: Policy) => void;
  onClearFilters?: () => void;
}

const evidenceBadgeStyles: Record<EvidenceQuality, string> = {
  high: 'bg-[#e8f5e9] text-[#1b5e20] border-[#c8e6c9]',
  moderate: 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]',
  emerging: 'bg-[#fff8e1] text-[#e65100] border-[#ffecb3]',
  low: 'bg-[#fff3e0] text-[#bf360c] border-[#ffe0b2]',
  none: 'bg-[#f5f5f5] text-[#616161] border-[#e0e0e0]',
};

const sortableColumns: Array<{
  key: PolicySortKey;
  label: string;
  className?: string;
}> = [
  { key: 'name', label: 'Policy', className: 'min-w-[260px]' },
  { key: 'country', label: 'Country' },
  { key: 'year', label: 'Years' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'studies', label: 'Studies' },
];

export function PolicyResultsTable({
  policies,
  totalCount,
  sort,
  onSortChange,
  onPolicyClick,
  selectedCompareIds,
  compareLimit = 4,
  onToggleCompare,
  onClearFilters,
}: PolicyResultsTableProps) {
  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-[#e5e0d8] bg-white px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center border border-[#e5e0d8] bg-[#fbfaf7]">
          <FileSearch className="h-7 w-7 text-[#5c6578]" />
        </div>
        <h3 className="mb-2 font-serif text-xl text-[#1a2744]">No policies found</h3>
        <p className="mb-6 max-w-md text-[#5c6578]">
          No policies match your current query. Adjust the filters or clear everything to
          restart the comparison set.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 border border-[#1a2744] px-4 py-2 text-sm font-medium text-[#1a2744] transition-colors hover:bg-[#1a2744] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="border border-[#e5e0d8] bg-white">
      <div className="flex flex-col gap-3 border-b border-[#e5e0d8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#5c6578]">
            Showing <span className="font-medium text-[#1a2744]">{policies.length}</span> of{' '}
            <span className="font-medium text-[#1a2744]">{totalCount}</span> policies
          </p>
        </div>
        <SortSelect sort={sort} onSortChange={onSortChange} />
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1140px] border-collapse text-sm">
          <thead className="bg-[#f5f2ed] text-left text-xs uppercase text-[#5c6578]">
            <tr>
              <th className="w-24 border-b border-[#e5e0d8] px-4 py-3 font-medium">
                Compare
              </th>
              {sortableColumns.map((column) => (
                <th key={column.key} className={`border-b border-[#e5e0d8] px-4 py-3 font-medium ${column.className || ''}`}>
                  <SortHeader
                    label={column.label}
                    sortKey={column.key}
                    sort={sort}
                    onSortChange={onSortChange}
                  />
                </th>
              ))}
              <th className="min-w-[180px] border-b border-[#e5e0d8] px-4 py-3 font-medium">
                Type
              </th>
              <th className="min-w-[180px] border-b border-[#e5e0d8] px-4 py-3 font-medium">
                Target
              </th>
              <th className="min-w-[260px] border-b border-[#e5e0d8] px-4 py-3 font-medium">
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
                  className="cursor-pointer border-b border-[#e5e0d8] transition-colors last:border-b-0 hover:bg-[#fbfaf7] focus:bg-[#fbfaf7] focus:outline-none focus:ring-2 focus:ring-[#c4654a]/40"
                  aria-label={`Open details for ${policy.name}`}
                >
                  <td className="px-4 py-4 align-top">
                    <CompareControl
                      policy={policy}
                      checked={isSelected}
                      disabled={isDisabled}
                      onToggleCompare={onToggleCompare}
                    />
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="font-serif text-base leading-snug text-[#1a2744]">
                      {policy.name}
                    </div>
                    {policy.acronym && (
                      <div className="mt-1 text-xs uppercase text-[#5c6578]">
                        {policy.acronym}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-[#1a2744]">
                    {COUNTRY_LABELS[policy.country]}
                  </td>
                  <td className="px-4 py-4 align-top text-[#5c6578]">
                    {formatYears(policy)}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <EvidenceBadge quality={policy.evidenceQuality} />
                  </td>
                  <td className="px-4 py-4 align-top text-[#1a2744]">
                    {policy.evaluations.length}
                  </td>
                  <td className="px-4 py-4 align-top text-[#5c6578]">
                    {formatList(policy.policyTypes.map((type) => POLICY_TYPE_LABELS[type]))}
                  </td>
                  <td className="px-4 py-4 align-top text-[#5c6578]">
                    {formatList(
                      policy.affectedPopulations.map((population) => AFFECTED_POPULATION_LABELS[population])
                    )}
                  </td>
                  <td className="px-4 py-4 align-top text-[#5c6578]">
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

      <div className="divide-y divide-[#e5e0d8] md:hidden">
        {policies.map((policy) => {
          const isSelected = selectedCompareIds.includes(policy.id);
          const isDisabled = !isSelected && selectedCompareIds.length >= compareLimit;

          return (
            <article key={policy.id} className="px-4 py-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onPolicyClick(policy)}
                  className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-[#c4654a]/40"
                >
                  <h3 className="font-serif text-lg leading-snug text-[#1a2744]">
                    {policy.name}
                  </h3>
                  {policy.acronym && (
                    <p className="mt-1 text-xs uppercase text-[#5c6578]">{policy.acronym}</p>
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
                className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-[#c4654a]/40"
              >
                <div className="grid grid-cols-2 gap-3 text-xs text-[#5c6578]">
                  <Meta label="Country" value={COUNTRY_LABELS[policy.country]} />
                  <Meta label="Years" value={formatYears(policy)} />
                  <Meta label="Studies" value={String(policy.evaluations.length)} />
                  <Meta
                    label="Type"
                    value={formatList(policy.policyTypes.map((type) => POLICY_TYPE_LABELS[type]))}
                  />
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#5c6578]">
                  {policy.keyOutcomes[0]?.effect || policy.summaryShort}
                </p>
              </button>
            </article>
          );
        })}
      </div>
    </section>
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
      className="inline-flex items-center gap-1.5 text-left hover:text-[#1a2744]"
    >
      {label}
      {isActive ? (
        sort.direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5 text-[#c4654a]" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-[#c4654a]" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      )}
    </button>
  );
}

function SortSelect({
  sort,
  onSortChange,
}: {
  sort: PolicySortState;
  onSortChange: (sort: PolicySortState) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase text-[#5c6578]">
      Sort
      <select
        value={`${sort.key}:${sort.direction}`}
        onChange={(event) => {
          const [key, direction] = event.target.value.split(':') as [
            PolicySortKey,
            PolicySortState['direction'],
          ];
          onSortChange({ key, direction });
        }}
        className="h-9 border border-[#e5e0d8] bg-white px-2 text-sm normal-case text-[#1a2744] outline-none focus:border-[#c4654a] focus:ring-1 focus:ring-[#c4654a]/20"
      >
        <option value="relevance:desc">Relevance</option>
        <option value="evidence:desc">Evidence strongest first</option>
        <option value="evidence:asc">Evidence weakest first</option>
        <option value="studies:desc">Most studies</option>
        <option value="studies:asc">Fewest studies</option>
        <option value="year:desc">Newest start year</option>
        <option value="year:asc">Oldest start year</option>
        <option value="country:asc">Country A-Z</option>
        <option value="name:asc">Policy A-Z</option>
      </select>
    </label>
  );
}

function EvidenceBadge({ quality }: { quality: EvidenceQuality }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${evidenceBadgeStyles[quality]}`}
    >
      {EVIDENCE_QUALITY_LABELS[quality]}
    </span>
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
        disabled ? 'cursor-not-allowed text-[#5c6578]/50' : 'cursor-pointer text-[#1a2744]'
      }`}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => onToggleCompare(policy)}
        className="h-4 w-4 accent-[#1a2744]"
        aria-label={`${checked ? 'Remove' : 'Add'} ${policy.name} ${checked ? 'from' : 'to'} comparison`}
      />
      {!compact && <span>{checked ? 'Selected' : 'Compare'}</span>}
    </label>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 uppercase tracking-wide text-[#5c6578]/70">{label}</div>
      <div className="text-[#1a2744]">{value}</div>
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
