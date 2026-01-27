'use client';

import { BookOpen, Globe, TrendingUp, Command } from 'lucide-react';

interface HeroProps {
  totalPolicies: number;
  countryCount: number;
  highEvidenceCount: number;
}

export function Hero({ totalPolicies, countryCount, highEvidenceCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#1a2744] text-white">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/3 pointer-events-none">
        <div className="absolute inset-0 border border-white/10 rounded-full" />
        <div className="absolute inset-12 border border-white/10 rounded-full" />
        <div className="absolute inset-24 border border-white/10 rounded-full" />
      </div>

      <div className="relative container max-w-screen-2xl px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-[#c4654a]" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/60">
              Research Database
            </span>
          </div>

          {/* Main title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
            Latin America
            <br />
            <em className="text-[#c4654a]">Education Policy</em>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
            A curated collection of evidence-based education policies across
            20 countries. Explore interventions, examine rigorous evaluations,
            and discover what works.
          </p>

          {/* Search hint */}
          <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/20 text-sm text-white/80">
            <Command className="h-3.5 w-3.5" />
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-xs font-mono">Ctrl K</kbd>
            <span>to search</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <Stat
              value={totalPolicies}
              label="Policies Catalogued"
              icon={<BookOpen className="h-4 w-4" />}
            />
            <Stat
              value={countryCount}
              label="Countries Covered"
              icon={<Globe className="h-4 w-4" />}
            />
            <Stat
              value={highEvidenceCount}
              label="Strong Evidence"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <Stat
              value="1955"
              label="Earliest Policy"
              suffix="–Present"
            />
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
  suffix
}: {
  value: number | string;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="group">
      <div className="flex items-baseline gap-1 mb-2">
        <span className="font-serif text-3xl md:text-4xl text-white tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm text-white/50">{suffix}</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-white/60">
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
