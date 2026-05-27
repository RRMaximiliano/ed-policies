'use client';

import { useState, useCallback, Suspense, useMemo } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { usePolicies, useFilterOptions } from '@/hooks/usePolicies';
import { useUrlSync } from '@/hooks/useUrlSync';
import { Hero } from '@/components/layout/Hero';
import { PolicyResultsTable } from '@/components/policy/PolicyResultsTable';
import { PolicyDetail } from '@/components/policy/PolicyDetail';
import { CompareTray } from '@/components/policy/CompareTray';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { CommandPalette } from '@/components/search/CommandPalette';
import {
  COUNTRY_LABELS,
  DEFAULT_POLICY_SORT,
  EvidenceQuality,
  Policy,
  PolicySortState,
} from '@/types/policy';
import policiesData from '@/data/policies.json';

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
        highEvidenceCount={stats.highEvidenceCount}
        highOrModerateEvidenceCount={stats.highOrModerateEvidenceCount}
      />

      <div className="container max-w-screen-2xl px-4 md:px-8 py-6 md:py-8">
        <FilterToolbar
          countryCounts={filterOptions.countryCounts}
          typeCounts={filterOptions.typeCounts}
          populationCounts={filterOptions.populationCounts}
          evidenceCounts={filterOptions.evidenceCounts}
        />

        <PolicyResultsTable
          policies={sortedPolicies}
          onPolicyClick={handlePolicyClick}
          onClearFilters={handleClearFilters}
          totalCount={totalCount}
          sort={effectiveSort}
          onSortChange={handleSortChange}
          selectedCompareIds={selectedCompareIds}
          compareLimit={compareLimit}
          onToggleCompare={handleToggleCompare}
        />
      </div>

      <PolicyDetail
        policy={selectedPolicy}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CommandPalette policies={allPolicies} onSelectPolicy={handlePolicyClick} />

      <CompareTray
        policies={selectedComparePolicies}
        limit={compareLimit}
        onRemove={handleRemoveCompare}
        onClear={() => setSelectedCompareIds([])}
      />
    </>
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

    const studyTie = b.evaluations.length - a.evaluations.length;
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
      return a.evaluations.length - b.evaluations.length;
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
