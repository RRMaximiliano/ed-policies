'use client';

import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useFilterStore } from '@/store/filterStore';
import {
  AffectedPopulation,
  Country,
  DEFAULT_FILTERS,
  DEFAULT_POLICY_SORT,
  EvidenceQuality,
  PolicySortKey,
  PolicySortState,
  PolicyType,
  SortDirection,
} from '@/types/policy';

interface UseUrlSyncArgs {
  sort: PolicySortState;
  setSort: Dispatch<SetStateAction<PolicySortState>>;
  sortTouched: boolean;
  setSortTouched: Dispatch<SetStateAction<boolean>>;
}

const sortKeys: PolicySortKey[] = ['relevance', 'name', 'country', 'year', 'evidence', 'studies'];
const sortDirections: SortDirection[] = ['asc', 'desc'];

export function useUrlSync({
  sort,
  setSort,
  sortTouched,
  setSortTouched,
}: UseUrlSyncArgs) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const skipNextUrlWriteRef = useRef(false);

  const setFilters = useFilterStore((state) => state.setFilters);
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const countries = useFilterStore((state) => state.countries);
  const policyTypes = useFilterStore((state) => state.policyTypes);
  const affectedPopulations = useFilterStore((state) => state.affectedPopulations);
  const evidenceQuality = useFilterStore((state) => state.evidenceQuality);
  const activeOnly = useFilterStore((state) => state.activeOnly);
  const yearRange = useFilterStore((state) => state.yearRange);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const nextSort = parseSort(searchParams.get('sort'), query);
    const hasExplicitSort = searchParams.has('sort');

    skipNextUrlWriteRef.current = true;
    setFilters({
      searchQuery: query,
      countries: toList<Country>(searchParams.get('countries')),
      policyTypes: toList<PolicyType>(searchParams.get('types')),
      affectedPopulations: toList<AffectedPopulation>(searchParams.get('populations')),
      evidenceQuality: toList<EvidenceQuality>(searchParams.get('evidence')),
      activeOnly: searchParams.get('active') === 'true',
      yearRange: [
        parseYear(searchParams.get('yearStart'), DEFAULT_FILTERS.yearRange[0]),
        parseYear(searchParams.get('yearEnd'), DEFAULT_FILTERS.yearRange[1]),
      ],
    });
    setSort(nextSort);
    setSortTouched(hasExplicitSort);
  }, [searchParams, setFilters, setSort, setSortTouched]);

  useEffect(() => {
    if (skipNextUrlWriteRef.current) {
      skipNextUrlWriteRef.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (countries.length > 0) {
      params.set('countries', countries.join(','));
    }
    if (policyTypes.length > 0) {
      params.set('types', policyTypes.join(','));
    }
    if (affectedPopulations.length > 0) {
      params.set('populations', affectedPopulations.join(','));
    }
    if (evidenceQuality.length > 0) {
      params.set('evidence', evidenceQuality.join(','));
    }
    if (activeOnly) {
      params.set('active', 'true');
    }
    if (yearRange[0] !== DEFAULT_FILTERS.yearRange[0]) {
      params.set('yearStart', String(yearRange[0]));
    }
    if (yearRange[1] !== DEFAULT_FILTERS.yearRange[1]) {
      params.set('yearEnd', String(yearRange[1]));
    }

    if (sortTouched) {
      params.set('sort', `${sort.key}:${sort.direction}`);
    } else if (searchParams.has('sort')) {
      params.set('sort', searchParams.get('sort') || '');
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    activeOnly,
    affectedPopulations,
    countries,
    evidenceQuality,
    pathname,
    policyTypes,
    router,
    searchParams,
    searchQuery,
    sort,
    sortTouched,
    yearRange,
  ]);
}

function toList<T extends string>(value: string | null): T[] {
  return (value?.split(',').filter(Boolean) || []) as T[];
}

function parseYear(value: string | null, fallback: number) {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseSort(value: string | null, query: string): PolicySortState {
  if (!value) {
    return query ? { key: 'relevance', direction: 'desc' } : DEFAULT_POLICY_SORT;
  }

  const [key, direction] = value.split(':') as [PolicySortKey, SortDirection];

  if (!sortKeys.includes(key) || !sortDirections.includes(direction)) {
    return query ? { key: 'relevance', direction: 'desc' } : DEFAULT_POLICY_SORT;
  }

  return { key, direction };
}
