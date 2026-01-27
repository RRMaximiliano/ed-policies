'use client';

import { useMemo } from 'react';
import Fuse, { IFuseOptions } from 'fuse.js';
import { Policy } from '@/types/policy';

const fuseOptions: IFuseOptions<Policy> = {
  keys: [
    { name: 'name', weight: 0.3 },
    { name: 'nameLocal', weight: 0.2 },
    { name: 'acronym', weight: 0.25 },
    { name: 'summaryShort', weight: 0.1 },
    { name: 'summaryLong', weight: 0.05 },
    { name: 'objectives', weight: 0.05 },
    { name: 'impactSummary', weight: 0.05 },
  ],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function useSearch(policies: Policy[], query: string): Policy[] {
  const fuse = useMemo(() => new Fuse(policies, fuseOptions), [policies]);

  return useMemo(() => {
    if (!query.trim()) {
      return policies;
    }

    const results = fuse.search(query);
    return results.map((result) => result.item);
  }, [fuse, query, policies]);
}
