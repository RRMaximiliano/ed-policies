'use client';

import { BarChart3, BookOpen, Command, Globe, ShieldCheck } from 'lucide-react';

interface HeroProps {
  totalPolicies: number;
  countryCount: number;
  highEvidenceCount: number;
  highOrModerateEvidenceCount: number;
}

export function Hero({
  totalPolicies,
  countryCount,
  highEvidenceCount,
  highOrModerateEvidenceCount,
}: HeroProps) {
  return (
    <section className="border-b border-[#e5e0d8] bg-[#fbfaf7]">
      <div className="container max-w-screen-2xl px-4 md:px-8 py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.72fr)] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#c4654a]" />
              <span className="text-xs uppercase text-[#5c6578]">
                Research Database
              </span>
            </div>

            <h1 className="mb-4 font-serif text-3xl leading-tight text-[#1a2744] md:text-5xl">
              Latin America Education Policy Database
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[#5c6578] md:text-lg">
              Compare {totalPolicies} education policy records across {countryCount} countries,
              spanning Latin America and the Caribbean, with evidence ratings, evaluation studies,
              and implementation details for researchers and policy evaluators.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <div className="mb-3 inline-flex items-center gap-2 border border-[#e5e0d8] bg-white px-3 py-2 text-sm text-[#5c6578]">
              <Command className="h-3.5 w-3.5 text-[#c4654a]" />
              <span>Press</span>
              <kbd className="border border-[#e5e0d8] bg-[#f5f2ed] px-1.5 py-0.5 font-mono text-[10px] text-[#1a2744]">
                Ctrl or Cmd K
              </kbd>
              <span>to search</span>
            </div>

            <div className="grid grid-cols-2 border border-[#e5e0d8] bg-white md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Stat
                value={totalPolicies}
                label="Policies"
                icon={<BookOpen className="h-4 w-4" />}
              />
              <Stat
                value={countryCount}
                label="Countries"
                icon={<Globe className="h-4 w-4" />}
              />
              <Stat
                value={highEvidenceCount}
                label="High evidence"
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <Stat
                value={highOrModerateEvidenceCount}
                label="High or moderate"
                icon={<BarChart3 className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-b border-r border-[#e5e0d8] p-4 last:border-r-0 md:border-b-0 lg:border-b xl:border-b-0 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r lg:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(4)]:border-r-0">
      <div className="mb-2 flex items-baseline gap-1">
        <span className="font-serif text-3xl text-[#1a2744] tabular-nums">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#5c6578]">
        {icon && (
          <span className="text-[#c4654a]">
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
    </div>
  );
}
