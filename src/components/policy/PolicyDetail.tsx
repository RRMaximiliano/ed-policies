'use client';

import {
  Policy,
  COUNTRY_LABELS,
  POLICY_TYPE_LABELS,
  AFFECTED_POPULATION_LABELS,
  EVIDENCE_QUALITY_LABELS,
  EVIDENCE_QUALITY_DESCRIPTIONS,
  STUDY_METHODOLOGY_LABELS,
  EvidenceQuality,
} from '@/types/policy';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar,
  MapPin,
  Users,
  Target,
  BookOpen,
  ExternalLink,
  CheckCircle,
  Info,
  X,
} from 'lucide-react';

interface PolicyDetailProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const evidenceBadgeStyles: Record<EvidenceQuality, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-[#e8f5e9]', text: 'text-[#1b5e20]', border: 'border-[#c8e6c9]' },
  moderate: { bg: 'bg-[#e3f2fd]', text: 'text-[#1565c0]', border: 'border-[#bbdefb]' },
  emerging: { bg: 'bg-[#fff8e1]', text: 'text-[#e65100]', border: 'border-[#ffecb3]' },
  low: { bg: 'bg-[#fff3e0]', text: 'text-[#bf360c]', border: 'border-[#ffe0b2]' },
  none: { bg: 'bg-[#f5f5f5]', text: 'text-[#616161]', border: 'border-[#e0e0e0]' },
};

export function PolicyDetail({ policy, open, onOpenChange }: PolicyDetailProps) {
  if (!policy) return null;

  const evidenceStyle = evidenceBadgeStyles[policy.evidenceQuality];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 bg-[#faf8f5] border-[#e5e0d8] overflow-hidden">
        <ScrollArea className="max-h-[90vh] overflow-x-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#1a2744] text-white px-6 py-6 overflow-hidden">
            <DialogHeader>
              <div className="flex items-start gap-3 mb-3">
                <span className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 border ${evidenceStyle.bg} ${evidenceStyle.text} ${evidenceStyle.border}`}>
                  {EVIDENCE_QUALITY_LABELS[policy.evidenceQuality]} Evidence
                </span>
                {policy.isActive && (
                  <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-1 bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                    Active
                  </span>
                )}
              </div>
              <DialogTitle className="font-serif text-2xl md:text-3xl text-white leading-tight pr-8 [overflow-wrap:anywhere]">
                {policy.name}
                {policy.acronym && (
                  <span className="text-white/60 font-normal ml-2">
                    ({policy.acronym})
                  </span>
                )}
              </DialogTitle>
              {policy.nameLocal && (
                <p className="text-white/70 italic mt-1 break-words">{policy.nameLocal}</p>
              )}
            </DialogHeader>

            {/* Meta row */}
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#c4654a]" />
                {COUNTRY_LABELS[policy.country]}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {policy.yearStart}{policy.isActive ? '–Present' : policy.yearEnd ? `–${policy.yearEnd}` : ''}
              </div>
              {policy.coverage && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {policy.coverage}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8 overflow-hidden break-words">
            {/* Summary */}
            <Section title="Summary">
              <p className="text-[#5c6578] leading-relaxed">{policy.summaryLong}</p>
            </Section>

            {/* Objectives */}
            <Section title="Objectives">
              <ul className="space-y-3">
                {policy.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[#5c6578]">
                    <Target className="h-4 w-4 mt-0.5 text-[#c4654a] shrink-0" />
                    {objective}
                  </li>
                ))}
              </ul>
            </Section>

            {/* Mechanisms */}
            <Section title="Mechanisms">
              <p className="text-[#5c6578] leading-relaxed">{policy.mechanisms}</p>
            </Section>

            {/* Categories & Populations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Section title="Policy Categories">
                <div className="flex flex-wrap gap-2">
                  {policy.policyTypes.map((type) => (
                    <span key={type} className="text-[10px] uppercase tracking-wide text-[#5c6578] bg-[#f5f2ed] px-2.5 py-1.5 border border-[#e5e0d8]">
                      {POLICY_TYPE_LABELS[type]}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Target Populations">
                <div className="flex flex-wrap gap-2">
                  {policy.affectedPopulations.map((pop) => (
                    <span key={pop} className="text-[10px] uppercase tracking-wide text-[#5c6578] bg-white px-2.5 py-1.5 border border-[#e5e0d8]">
                      {AFFECTED_POPULATION_LABELS[pop]}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            {/* Divider */}
            <div className="border-t border-[#e5e0d8]" />

            {/* Evidence Section */}
            <Section
              title="Evidence & Impact"
              badge={
                <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-1 border ${evidenceStyle.bg} ${evidenceStyle.text} ${evidenceStyle.border}`}>
                  {EVIDENCE_QUALITY_LABELS[policy.evidenceQuality]}
                </span>
              }
            >
              <div className="bg-[#f5f2ed] border border-[#e5e0d8] p-4 mb-4">
                <div className="flex items-start gap-3 text-sm text-[#5c6578]">
                  <Info className="h-4 w-4 mt-0.5 text-[#c4654a] shrink-0" />
                  {EVIDENCE_QUALITY_DESCRIPTIONS[policy.evidenceQuality]}
                </div>
              </div>

              <p className="text-[#5c6578] leading-relaxed mb-6">
                {policy.impactSummary}
              </p>

              {policy.keyOutcomes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-[0.15em] font-medium text-[#5c6578]">Key Outcomes</h4>
                  {policy.keyOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-[#e5e0d8]">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-[#2d6a4f] shrink-0" />
                      <div>
                        <span className="font-medium text-sm text-[#1a2744]">{outcome.metric}: </span>
                        <span className="text-sm text-[#5c6578]">{outcome.effect}</span>
                        {outcome.source && (
                          <span className="text-xs text-[#5c6578]/70 ml-1">({outcome.source})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Evaluation Studies */}
            {policy.evaluations.length > 0 && (
              <Section title="Evaluation Studies">
                <div className="space-y-4">
                  {policy.evaluations.map((study, idx) => (
                    <div key={idx} className="bg-white border border-[#e5e0d8] p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="font-serif text-[#1a2744] leading-snug">{study.title}</h4>
                        <span className="shrink-0 text-[10px] uppercase tracking-wide text-[#5c6578] bg-[#f5f2ed] px-2 py-1 border border-[#e5e0d8]">
                          {STUDY_METHODOLOGY_LABELS[study.methodology]}
                        </span>
                      </div>
                      <p className="text-sm text-[#5c6578] mb-3">
                        {study.authors} ({study.year})
                        {study.journal && <span className="text-[#5c6578]/70"> — {study.journal}</span>}
                      </p>
                      <p className="text-sm text-[#5c6578] italic border-l-2 border-[#c4654a] pl-4">
                        &ldquo;{study.keyFinding}&rdquo;
                      </p>
                      {(study.doi || study.url) && (
                        <a
                          href={study.doi ? `https://doi.org/${study.doi}` : study.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#c4654a] hover:underline mt-4 break-all"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          <span className="break-all">{study.doi ? `DOI: ${study.doi}` : 'View source'}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* References */}
            {policy.keyReferences.length > 0 && (
              <Section title="Key References">
                <ul className="space-y-3">
                  {policy.keyReferences.map((ref, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#5c6578]">
                      <BookOpen className="h-4 w-4 mt-0.5 shrink-0 text-[#c4654a]" />
                      <span>
                        {ref.authors} ({ref.year}). <em>{ref.title}</em>. {ref.source}.
                        {ref.url && (
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#c4654a] hover:underline ml-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-serif text-lg text-[#1a2744]">{title}</h3>
        {badge}
      </div>
      {children}
    </div>
  );
}
