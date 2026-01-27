'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useFilterStore } from '@/store/filterStore';
import {
  Country,
  PolicyType,
  AffectedPopulation,
  EvidenceQuality,
  DEFAULT_FILTERS,
} from '@/types/policy';

export function useUrlSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setFilters, ...filters } = useFilterStore();

  // Parse URL params on mount
  useEffect(() => {
    const countries = searchParams.get('countries')?.split(',').filter(Boolean) as Country[] || [];
    const policyTypes = searchParams.get('types')?.split(',').filter(Boolean) as PolicyType[] || [];
    const affectedPopulations = searchParams.get('populations')?.split(',').filter(Boolean) as AffectedPopulation[] || [];
    const evidenceQuality = searchParams.get('evidence')?.split(',').filter(Boolean) as EvidenceQuality[] || [];
    const activeOnly = searchParams.get('active') === 'true';
    const yearStart = searchParams.get('yearStart');
    const yearEnd = searchParams.get('yearEnd');
    const query = searchParams.get('q') || '';

    const yearRange: [number, number] = [
      yearStart ? parseInt(yearStart, 10) : DEFAULT_FILTERS.yearRange[0],
      yearEnd ? parseInt(yearEnd, 10) : DEFAULT_FILTERS.yearRange[1],
    ];

    setFilters({
      searchQuery: query,
      countries,
      policyTypes,
      affectedPopulations,
      evidenceQuality,
      activeOnly,
      yearRange,
    });
  }, []);

  // Update URL when filters change
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (filters.searchQuery) {
      params.set('q', filters.searchQuery);
    }
    if (filters.countries.length > 0) {
      params.set('countries', filters.countries.join(','));
    }
    if (filters.policyTypes.length > 0) {
      params.set('types', filters.policyTypes.join(','));
    }
    if (filters.affectedPopulations.length > 0) {
      params.set('populations', filters.affectedPopulations.join(','));
    }
    if (filters.evidenceQuality.length > 0) {
      params.set('evidence', filters.evidenceQuality.join(','));
    }
    if (filters.activeOnly) {
      params.set('active', 'true');
    }
    if (filters.yearRange[0] !== DEFAULT_FILTERS.yearRange[0]) {
      params.set('yearStart', filters.yearRange[0].toString());
    }
    if (filters.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]) {
      params.set('yearEnd', filters.yearRange[1].toString());
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters, pathname, router]);

  return { updateUrl };
}
