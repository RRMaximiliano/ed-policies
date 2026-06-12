import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import policiesData from '@/data/policies.json';
import {
  COUNTRY_LABELS,
  IMPLEMENTATION_STATUS_LABELS,
  POLICY_TYPE_LABELS,
  Country,
  Policy,
} from '@/types/policy';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const allPolicies = policiesData as Policy[];
const countrySlugs = Object.keys(COUNTRY_LABELS) as Country[];

export const dynamicParams = false;

export function generateStaticParams() {
  return countrySlugs.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const label = COUNTRY_LABELS[country as Country];
  if (!label) return {};

  const count = allPolicies.filter((p) => p.country === country).length;
  const description = `${count} education ${count === 1 ? 'policy' : 'policies'} from ${label}: programs, implementation details, and evaluation evidence where research exists.`;
  return {
    title: `Education policies in ${label} | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `Education policies in ${label}`,
      description,
      type: 'website',
      url: `${SITE_URL}/countries/${country}`,
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const slug = country as Country;
  const label = COUNTRY_LABELS[slug];
  if (!label) notFound();

  const policies = allPolicies
    .filter((p) => p.country === slug)
    .sort((a, b) => b.yearStart - a.yearStart);

  return (
    <div className="bg-[#fafafa]">
      <header className="border-b border-[#e4e4e7] bg-[#fafafa]">
        <div className="shell-article py-8 md:py-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#52525b] hover:text-[#18181b]"
          >
            <ArrowLeft className="h-4 w-4" />
            All policies
          </Link>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[#18181b] md:text-5xl">
            {label}
          </h1>
          <p className="mt-4 max-w-prose text-[#52525b]">
            {policies.length} education {policies.length === 1 ? 'policy' : 'policies'} cataloged
            for {label}, from national programs to local pilots, whether or not they have been
            evaluated.
          </p>
        </div>
      </header>

      <main className="shell-article py-8">
        {policies.length === 0 ? (
          <div className="border border-[#e4e4e7] bg-white px-4 py-16 text-center">
            <h2 className="font-display text-2xl text-[#18181b]">No policies cataloged yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#52525b]">
              We have not documented any education policies for {label} yet. Know one that
              belongs here? Help us complete the catalog.
            </p>
            <Link
              href="/contribute"
              className="mt-6 inline-flex h-10 items-center justify-center bg-[#18181b] px-4 text-sm font-medium text-white hover:bg-[#2f2f36]"
            >
              Contribute a policy
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[#e4e4e7] border border-[#e4e4e7] bg-white">
            {policies.map((policy) => (
              <li key={policy.id}>
                <Link
                  href={`/policies/${policy.id}`}
                  className="group block px-5 py-5 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-lg leading-snug text-[#18181b] group-hover:underline">
                        {policy.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#52525b]">
                        {policy.yearStart}
                        {policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}
                        {' · '}
                        {IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}
                      </p>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-[#52525b]/80">
                        {policy.policyTypes.map((t) => POLICY_TYPE_LABELS[t]).join(', ')}
                      </p>
                      <p className="mt-2 line-clamp-2 max-w-[65ch] text-sm leading-relaxed text-[#52525b]">
                        {policy.summaryShort}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <EvidenceBadge quality={policy.evidenceQuality} />
                      <ArrowUpRight className="h-4 w-4 text-[#52525b] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-sm text-[#52525b]">
          Want to filter by type, population, or evidence?{' '}
          <Link
            href={`/?countries=${slug}`}
            className="font-medium text-[#1e43c8] hover:underline"
          >
            Open {label} in the policy browser
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
