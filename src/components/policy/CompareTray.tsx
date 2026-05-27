'use client';

import Link from 'next/link';
import { Policy } from '@/types/policy';
import { GitCompareArrows, X } from 'lucide-react';

interface CompareTrayProps {
  policies: Policy[];
  limit?: number;
  onRemove: (policyId: string) => void;
  onClear: () => void;
}

export function CompareTray({ policies, limit = 4, onRemove, onClear }: CompareTrayProps) {
  if (policies.length === 0) {
    return null;
  }

  const compareHref = `/compare?policies=${policies.map((policy) => policy.id).join(',')}`;
  const canCompare = policies.length >= 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8d2c8] bg-[#fbfaf7]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(26,39,68,0.12)] backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-[#1a2744]">
            <GitCompareArrows className="h-4 w-4 text-[#c4654a]" />
            Compare {policies.length}/{limit}
          </div>
          <div className="flex min-w-0 flex-wrap gap-2">
            {policies.map((policy) => (
              <span
                key={policy.id}
                className="inline-flex max-w-[260px] items-center gap-2 border border-[#d8d2c8] bg-white px-2.5 py-1.5 text-xs text-[#1a2744]"
              >
                <span className="truncate">{policy.acronym || policy.name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(policy.id)}
                  className="text-[#5c6578] hover:text-[#c4654a]"
                  aria-label={`Remove ${policy.name} from comparison`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="h-10 px-3 text-sm font-medium text-[#5c6578] hover:text-[#1a2744]"
          >
            Clear
          </button>
          {canCompare ? (
            <Link
              href={compareHref}
              className="inline-flex h-10 items-center justify-center bg-[#1a2744] px-4 text-sm font-medium text-white hover:bg-[#26385f]"
            >
              Open comparison
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center bg-[#d8d2c8] px-4 text-sm font-medium text-[#5c6578]"
            >
              Select 2 to compare
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
