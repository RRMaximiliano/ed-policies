'use client';

interface HeroProps {
  totalPolicies: number;
  countryCount: number;
  activeCount: number;
  evaluatedCount: number;
}

export function Hero({
  totalPolicies,
  countryCount,
  activeCount,
  evaluatedCount,
}: HeroProps) {
  return (
    <section className="border-b border-[#e4e4e7] bg-white">
      <div className="shell-wide py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[#18181b] md:text-5xl">
            Education policies of Latin America
          </h1>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-[#52525b] md:text-lg">
            A catalog of {totalPolicies} policies across {countryCount} countries in Latin
            America and the Caribbean. Every policy that happened belongs here, with evidence
            ratings and evaluation studies where research exists.
          </p>
        </div>

        <dl className="mt-8 flex flex-wrap justify-between gap-x-12 gap-y-4 border-t border-[#e4e4e7] pt-6">
          <Figure value={totalPolicies} label="Policies" />
          <Figure value={countryCount} label="Countries" />
          <Figure value={activeCount} label="Active today" />
          <Figure value={evaluatedCount} label="With evaluations" />
        </dl>
      </div>
    </section>
  );
}

function Figure({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <dd className="font-display text-3xl font-semibold tabular-nums text-[#18181b]">
        {value}
      </dd>
      <dt className="mt-0.5 text-sm text-[#52525b]">{label}</dt>
    </div>
  );
}
