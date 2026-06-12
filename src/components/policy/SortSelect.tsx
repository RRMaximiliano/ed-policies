'use client';

import { PolicySortKey, PolicySortState } from '@/types/policy';

export function SortSelect({
  sort,
  onSortChange,
}: {
  sort: PolicySortState;
  onSortChange: (sort: PolicySortState) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs uppercase text-[#52525b]">
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
        className="h-9 border border-[#e4e4e7] bg-white px-2 text-sm normal-case text-[#18181b] outline-none focus:border-[#1e43c8] focus:ring-1 focus:ring-[#1e43c8]/20"
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
