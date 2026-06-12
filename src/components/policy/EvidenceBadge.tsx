import { EVIDENCE_QUALITY_LABELS, EvidenceQuality } from '@/types/policy';
import { EVIDENCE_BADGE_CLASSES } from '@/lib/evidence';

export function EvidenceBadge({
  quality,
  suffix,
  className = '',
}: {
  quality: EvidenceQuality;
  suffix?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide ${EVIDENCE_BADGE_CLASSES[quality]} ${className}`}
    >
      {EVIDENCE_QUALITY_LABELS[quality]}
      {suffix ? ` ${suffix}` : ''}
    </span>
  );
}
