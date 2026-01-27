'use client';

import { Policy } from '@/types/policy';
import { PolicyCard } from './PolicyCard';
import { FileSearch, RotateCcw } from 'lucide-react';

interface PolicyGridProps {
  policies: Policy[];
  onPolicyClick: (policy: Policy) => void;
  onClearFilters?: () => void;
  totalCount: number;
}

export function PolicyGrid({
  policies,
  onPolicyClick,
  onClearFilters,
  totalCount,
}: PolicyGridProps) {
  if (policies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 border-2 border-[#e5e0d8] rounded-full flex items-center justify-center mb-6">
          <FileSearch className="h-8 w-8 text-[#5c6578]" />
        </div>
        <h3 className="font-serif text-xl text-[#1a2744] mb-2">No policies found</h3>
        <p className="text-[#5c6578] mb-6 max-w-md">
          No policies match your current filters. Try adjusting your search criteria or clearing
          all filters to start fresh.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1a2744] border border-[#1a2744] hover:bg-[#1a2744] hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e0d8]">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#5c6578]">
            Showing{' '}
            <span className="font-medium text-[#1a2744]">{policies.length}</span>
            {' '}of{' '}
            <span className="font-medium text-[#1a2744]">{totalCount}</span>
            {' '}policies
          </span>
        </div>
        <div className="text-xs text-[#5c6578] uppercase tracking-wide">
          Sorted by relevance
        </div>
      </div>

      {/* Policy grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {policies.map((policy, index) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onClick={() => onPolicyClick(policy)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
