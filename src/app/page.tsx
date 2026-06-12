'use client';

import Link from 'next/link';
import { useState, useCallback, Suspense, useMemo } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { usePolicies, useFilterOptions } from '@/hooks/usePolicies';
import { useUrlSync } from '@/hooks/useUrlSync';
import { Hero } from '@/components/layout/Hero';
import { PolicyResultsTable } from '@/components/policy/PolicyResultsTable';
import { PolicyCardsView } from '@/components/policy/PolicyCardsView';
import { PolicyTimelineView } from '@/components/policy/PolicyTimelineView';
import { ViewSwitcher, BrowserView } from '@/components/policy/ViewSwitcher';
import { SortSelect } from '@/components/policy/SortSelect';
import { PolicyDetail } from '@/components/policy/PolicyDetail';
import { CompareTray } from '@/components/policy/CompareTray';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { CommandPalette } from '@/components/search/CommandPalette';
import {
  COUNTRY_LABELS,
  DEFAULT_POLICY_SORT,
  EvidenceQuality,
  POLICY_TYPE_LABELS,
  Policy,
  PolicySortState,
} from '@/types/policy';
import policiesData from '@/data/policies.json';
import { FileSearch, RotateCcw } from 'lucide-react';

const allPolicies = policiesData as Policy[];
const compareLimit = 4;

const evidenceRank: Record<EvidenceQuality, number> = {
  high: 5,
  moderate: 4,
  emerging: 3,
  low: 2,
  none: 1,
};

function PolicyBrowser() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sort, setSort] = useState<PolicySortState>(DEFAULT_POLICY_SORT);
  const [sortTouched, setSortTouched] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [view, setView] = useState<BrowserView>('table');

  const filters = useFilterStore();
  const { policies, totalCount, stats } = usePolicies(allPolicies, filters);
  const filterOptions = useFilterOptions(allPolicies);

  useUrlSync({ sort, setSort, sortTouched, setSortTouched });

  const effectiveSort: PolicySortState = useMemo(() => {
    if (sortTouched) {
      return sort;
    }

    return filters.searchQuery ? { key: 'relevance', direction: 'desc' } : DEFAULT_POLICY_SORT;
  }, [filters.searchQuery, sort, sortTouched]);

  const sortedPolicies = useMemo(
    () => sortPolicies(policies, effectiveSort),
    [policies, effectiveSort]
  );

  const selectedComparePolicies = useMemo(
    () =>
      selectedCompareIds
        .map((id) => allPolicies.find((policy) => policy.id === id))
        .filter((policy): policy is Policy => Boolean(policy)),
    [selectedCompareIds]
  );

  const handlePolicyClick = useCallback((policy: Policy) => {
    setSelectedPolicy(policy);
    setDetailOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    filters.clearFilters();
  }, [filters]);

  const handleSortChange = useCallback((nextSort: PolicySortState) => {
    setSortTouched(true);
    setSort(nextSort);
  }, []);

  const handleToggleCompare = useCallback((policy: Policy) => {
    setSelectedCompareIds((current) => {
      if (current.includes(policy.id)) {
        return current.filter((id) => id !== policy.id);
      }

      if (current.length >= compareLimit) {
        return current;
      }

      return [...current, policy.id];
    });
  }, []);

  const handleRemoveCompare = useCallback((policyId: string) => {
    setSelectedCompareIds((current) => current.filter((id) => id !== policyId));
  }, []);

  return (
    <>
      <Hero
        totalPolicies={totalCount}
        countryCount={stats.countryCount}
        activeCount={stats.activeCount}
        evaluatedCount={stats.evaluatedCount}
      />

      <div className="shell-wide py-6 md:py-8">
        <FilterToolbar
          countryCounts={filterOptions.countryCounts}
          typeCounts={filterOptions.typeCounts}
          populationCounts={filterOptions.populationCounts}
          evidenceCounts={filterOptions.evidenceCounts}
        />

        <section className="border border-[#e4e4e7] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#e4e4e7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#52525b]">
              Showing <span className="font-medium text-[#18181b]">{sortedPolicies.length}</span>{' '}
              of <span className="font-medium text-[#18181b]">{totalCount}</span> policies
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ViewSwitcher view={view} onViewChange={setView} />
              {view !== 'timeline' && (
                <SortSelect sort={effectiveSort} onSortChange={handleSortChange} />
              )}
            </div>
          </div>

          {sortedPolicies.length === 0 ? (
            <NoResults onClearFilters={handleClearFilters} />
          ) : view === 'table' ? (
            <PolicyResultsTable
              policies={sortedPolicies}
              onPolicyClick={handlePolicyClick}
              sort={effectiveSort}
              onSortChange={handleSortChange}
              selectedCompareIds={selectedCompareIds}
              compareLimit={compareLimit}
              onToggleCompare={handleToggleCompare}
            />
          ) : view === 'cards' ? (
            <PolicyCardsView policies={sortedPolicies} onPolicyClick={handlePolicyClick} />
          ) : (
            <PolicyTimelineView policies={sortedPolicies} onPolicyClick={handlePolicyClick} />
          )}
        </section>

        <BrowseIndexes
          countryCounts={filterOptions.countryCounts}
          typeCounts={filterOptions.typeCounts}
        />
      </div>

      <PolicyDetail
        policy={selectedPolicy}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CommandPalette policies={allPolicies} />

      <CompareTray
        policies={selectedComparePolicies}
        limit={compareLimit}
        onRemove={handleRemoveCompare}
        onClear={() => setSelectedCompareIds([])}
      />
    </>
  );
}

function NoResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center border border-[#e4e4e7] bg-[#fafafa]">
        <FileSearch className="h-7 w-7 text-[#52525b]" />
      </div>
      <h3 className="mb-2 font-display text-xl text-[#18181b]">No policies found</h3>
      <p className="mb-6 max-w-md text-[#52525b]">
        No policies match your current query. Adjust the filters or clear everything to start
        over.
      </p>
      <button
        type="button"
        onClick={onClearFilters}
        className="inline-flex items-center gap-2 border border-[#18181b] px-4 py-2 text-sm font-medium text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white"
      >
        <RotateCcw className="h-4 w-4" />
        Clear all filters
      </button>
    </div>
  );
}

function BrowseIndexes({
  countryCounts,
  typeCounts,
}: {
  countryCounts: Map<string, number>;
  typeCounts: Map<string, number>;
}) {
  const countries = (Object.keys(COUNTRY_LABELS) as Array<keyof typeof COUNTRY_LABELS>)
    .filter((country) => (countryCounts.get(country) || 0) > 0)
    .sort((a, b) => COUNTRY_LABELS[a].localeCompare(COUNTRY_LABELS[b]));
  const types = (Object.keys(POLICY_TYPE_LABELS) as Array<keyof typeof POLICY_TYPE_LABELS>)
    .filter((type) => (typeCounts.get(type) || 0) > 0)
    .sort((a, b) => POLICY_TYPE_LABELS[a].localeCompare(POLICY_TYPE_LABELS[b]));

  return (
    <div className="mt-10 grid gap-8 border-t border-[#e4e4e7] pt-6 lg:grid-cols-2">
      <nav aria-label="Browse by topic">
        <h2 className="mb-3 font-display text-lg text-[#18181b]">Browse by topic</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {types.map((type) => (
            <li key={type}>
              <Link
                href={`/topics/${type}`}
                className="text-[#52525b] hover:text-[#18181b] hover:underline"
              >
                {POLICY_TYPE_LABELS[type]}
                <span className="ml-1 text-xs text-[#52525b]/70">({typeCounts.get(type)})</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label="Browse by country">
        <h2 className="mb-3 font-display text-lg text-[#18181b]">Browse by country</h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {countries.map((country) => (
            <li key={country}>
              <Link
                href={`/countries/${country}`}
                className="text-[#52525b] hover:text-[#18181b] hover:underline"
              >
                {COUNTRY_LABELS[country]}
                <span className="ml-1 text-xs text-[#52525b]/70">
                  ({countryCounts.get(country)})
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function sortPolicies(policies: Policy[], sort: PolicySortState) {
  if (sort.key === 'relevance') {
    return policies;
  }

  const direction = sort.direction === 'asc' ? 1 : -1;

  return [...policies].sort((a, b) => {
    const primary = compareBySortKey(a, b, sort.key) * direction;
    if (primary !== 0) {
      return primary;
    }

    const evidenceTie = (evidenceRank[b.evidenceQuality] - evidenceRank[a.evidenceQuality]);
    if (evidenceTie !== 0) {
      return evidenceTie;
    }

    const studyTie = (b.evaluations?.length ?? 0) - (a.evaluations?.length ?? 0);
    if (studyTie !== 0) {
      return studyTie;
    }

    return b.yearStart - a.yearStart;
  });
}

function compareBySortKey(a: Policy, b: Policy, key: PolicySortState['key']) {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'country':
      return COUNTRY_LABELS[a.country].localeCompare(COUNTRY_LABELS[b.country]);
    case 'year':
      return a.yearStart - b.yearStart;
    case 'evidence':
      return evidenceRank[a.evidenceQuality] - evidenceRank[b.evidenceQuality];
    case 'studies':
      return (a.evaluations?.length ?? 0) - (b.evaluations?.length ?? 0);
    case 'relevance':
    default:
      return 0;
  }
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PolicyBrowser />
    </Suspense>
  );
}
