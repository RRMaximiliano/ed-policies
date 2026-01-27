'use client';

import { Policy, COUNTRY_LABELS, POLICY_TYPE_LABELS, EvidenceQuality } from '@/types/policy';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

interface PolicyCardProps {
  policy: Policy;
  onClick: () => void;
  index?: number;
}

const evidenceBadgeStyles: Record<EvidenceQuality, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-[#e8f5e9]', text: 'text-[#1b5e20]', border: 'border-[#c8e6c9]' },
  moderate: { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', border: 'border-[#bbdefb]' },
  emerging: { bg: 'bg-[#fff8e1]', text: 'text-[#e65100]', border: 'border-[#ffecb3]' },
  low: { bg: 'bg-[#fff3e0]', text: 'text-[#bf360c]', border: 'border-[#ffe0b2]' },
  none: { bg: 'bg-[#f5f5f5]', text: 'text-[#616161]', border: 'border-[#e0e0e0]' },
};

const evidenceLabels: Record<EvidenceQuality, string> = {
  high: 'High Evidence',
  moderate: 'Moderate',
  emerging: 'Emerging',
  low: 'Limited',
  none: 'No Data',
};

export function PolicyCard({ policy, onClick, index = 0 }: PolicyCardProps) {
  const evidenceStyle = evidenceBadgeStyles[policy.evidenceQuality];

  return (
    <article
      onClick={onClick}
      className="policy-card group relative bg-white border border-[#e5e0d8] cursor-pointer h-full flex flex-col overflow-hidden animate-fade-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#c4654a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg text-[#1a2744] leading-snug line-clamp-2 group-hover:text-[#c4654a] transition-colors">
              {policy.name}
            </h3>
            {policy.acronym && (
              <span className="text-xs text-[#5c6578] font-medium uppercase tracking-wide">
                {policy.acronym}
              </span>
            )}
          </div>
          <span
            className={`shrink-0 text-[10px] uppercase tracking-wider font-medium px-2 py-1 border ${evidenceStyle.bg} ${evidenceStyle.text} ${evidenceStyle.border}`}
          >
            {evidenceLabels[policy.evidenceQuality]}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-[#5c6578] mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#c4654a]" />
            {COUNTRY_LABELS[policy.country]}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {policy.yearStart}
            {policy.isActive ? '–Present' : policy.yearEnd ? `–${policy.yearEnd}` : ''}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-[#5c6578] leading-relaxed line-clamp-3 mb-4 flex-1">
          {policy.summaryShort}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {policy.policyTypes.slice(0, 2).map((type) => (
            <span
              key={type}
              className="text-[10px] uppercase tracking-wide text-[#5c6578] bg-[#f5f2ed] px-2 py-1"
            >
              {POLICY_TYPE_LABELS[type]}
            </span>
          ))}
          {policy.policyTypes.length > 2 && (
            <span className="text-[10px] text-[#5c6578] bg-[#f5f2ed] px-2 py-1">
              +{policy.policyTypes.length - 2}
            </span>
          )}
        </div>

        {/* Key finding */}
        {policy.keyOutcomes.length > 0 && (
          <div className="border-t border-[#e5e0d8] pt-3 mt-auto">
            <p className="text-xs text-[#5c6578] line-clamp-2">
              <span className="font-medium text-[#1a2744]">Key finding: </span>
              <span className="italic">{policy.keyOutcomes[0].effect}</span>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#e5e0d8] bg-[#faf8f5]/50 flex items-center justify-between">
        <span className="text-xs text-[#5c6578]">
          {policy.evaluations.length} {policy.evaluations.length === 1 ? 'study' : 'studies'}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-[#c4654a] opacity-0 group-hover:opacity-100 transition-opacity">
          View details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </article>
  );
}
