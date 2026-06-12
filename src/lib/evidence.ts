import { EvidenceQuality } from '@/types/policy';

// Single source of truth for evidence label styling. Text-only, no chip
// chrome: the color scale carries the meaning (strong green -> weak gray).
export const EVIDENCE_BADGE_CLASSES: Record<EvidenceQuality, string> = {
  high: 'text-[#166534]',
  moderate: 'text-[#1e40af]',
  emerging: 'text-[#854d0e]',
  low: 'text-[#9a3412]',
  none: 'text-[#52525b]',
};
