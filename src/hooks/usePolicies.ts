'use client';

import { useMemo } from 'react';
import { Policy, FilterState, DEFAULT_FILTERS } from '@/types/policy';
import { useSearch } from './useSearch';

function filterPolicies(policies: Policy[], filters: FilterState): Policy[] {
  return policies.filter((policy) => {
    // Country filter
    if (filters.countries.length > 0 && !filters.countries.includes(policy.country)) {
      return false;
    }

    // Policy type filter (any match)
    if (
      filters.policyTypes.length > 0 &&
      !filters.policyTypes.some((type) => policy.policyTypes.includes(type))
    ) {
      return false;
    }

    // Affected populations filter (any match)
    if (
      filters.affectedPopulations.length > 0 &&
      !filters.affectedPopulations.some((pop) => policy.affectedPopulations.includes(pop))
    ) {
      return false;
    }

    // Evidence quality filter
    if (
      filters.evidenceQuality.length > 0 &&
      !filters.evidenceQuality.includes(policy.evidenceQuality)
    ) {
      return false;
    }

    // Active only filter
    if (filters.activeOnly && !policy.isActive) {
      return false;
    }

    // Year range filter
    if (policy.yearStart > filters.yearRange[1]) {
      return false;
    }
    if (policy.yearEnd && policy.yearEnd < filters.yearRange[0]) {
      return false;
    }
    if (!policy.yearEnd && policy.yearStart < filters.yearRange[0]) {
      // For active policies without end date, check if they started before range
      // We want to include them if they're still active
    }

    return true;
  });
}

export function usePolicies(
  allPolicies: Policy[],
  filters: FilterState
): {
  policies: Policy[];
  totalCount: number;
  filteredCount: number;
  stats: {
    countryCount: number;
    activeCount: number;
    highEvidenceCount: number;
  };
} {
  // First apply filters (excluding search)
  const filteredByFilters = useMemo(() => {
    const filtersWithoutSearch = { ...filters, searchQuery: '' };
    return filterPolicies(allPolicies, filtersWithoutSearch);
  }, [allPolicies, filters]);

  // Then apply search
  const searchedPolicies = useSearch(filteredByFilters, filters.searchQuery);

  // Compute stats from all policies
  const stats = useMemo(() => {
    const countries = new Set(allPolicies.map((p) => p.country));
    const activeCount = allPolicies.filter((p) => p.isActive).length;
    const highEvidenceCount = allPolicies.filter(
      (p) => p.evidenceQuality === 'high' || p.evidenceQuality === 'moderate'
    ).length;

    return {
      countryCount: countries.size,
      activeCount,
      highEvidenceCount,
    };
  }, [allPolicies]);

  return {
    policies: searchedPolicies,
    totalCount: allPolicies.length,
    filteredCount: searchedPolicies.length,
    stats,
  };
}

// Hook to get filter options with counts
export function useFilterOptions(policies: Policy[]) {
  return useMemo(() => {
    const countryCounts = new Map<string, number>();
    const typeCounts = new Map<string, number>();
    const populationCounts = new Map<string, number>();
    const evidenceCounts = new Map<string, number>();

    policies.forEach((policy) => {
      // Country
      countryCounts.set(policy.country, (countryCounts.get(policy.country) || 0) + 1);

      // Policy types
      policy.policyTypes.forEach((type) => {
        typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
      });

      // Affected populations
      policy.affectedPopulations.forEach((pop) => {
        populationCounts.set(pop, (populationCounts.get(pop) || 0) + 1);
      });

      // Evidence quality
      evidenceCounts.set(
        policy.evidenceQuality,
        (evidenceCounts.get(policy.evidenceQuality) || 0) + 1
      );
    });

    return {
      countryCounts,
      typeCounts,
      populationCounts,
      evidenceCounts,
    };
  }, [policies]);
}
