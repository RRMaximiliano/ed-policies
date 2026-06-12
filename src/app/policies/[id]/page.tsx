import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import policiesData from '@/data/policies.json';
import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  IMPLEMENTATION_STATUS_LABELS,
  POLICY_TYPE_LABELS,
  Policy,
} from '@/types/policy';
import { PolicyRecord } from '@/components/policy/PolicyRecord';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ArrowLeft, Scale } from 'lucide-react';

const allPolicies = policiesData as Policy[];

export const dynamicParams = false;

export function generateStaticParams() {
  return allPolicies.map((policy) => ({ id: policy.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const policy = allPolicies.find((p) => p.id === id);
  if (!policy) return {};

  const title = `${policy.name} (${COUNTRY_LABELS[policy.country]})`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description: policy.summaryShort,
    openGraph: {
      title,
      description: policy.summaryShort,
      type: 'article',
      url: `${SITE_URL}/policies/${policy.id}`,
    },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const policy = allPolicies.find((p) => p.id === id);
  if (!policy) notFound();

  // Related: same instrument first (other countries preferred for contrast),
  // then same country. Max 4.
  const primaryType = policy.policyTypes[0];
  const sameType = allPolicies.filter(
    (p) => p.id !== policy.id && p.policyTypes.includes(primaryType)
  );
  const related = [
    ...sameType.filter((p) => p.country !== policy.country),
    ...sameType.filter((p) => p.country === policy.country),
    ...allPolicies.filter(
      (p) =>
        p.id !== policy.id &&
        p.country === policy.country &&
        !p.policyTypes.includes(primaryType)
    ),
  ]
    .filter((p, i, arr) => arr.findIndex((q) => q.id === p.id) === i)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: policy.name,
    alternateName: policy.nameLocal,
    description: policy.summaryShort,
    serviceType: 'Education policy',
    areaServed: COUNTRY_LABELS[policy.country],
    provider: {
      '@type': 'GovernmentOrganization',
      name: `Government of ${COUNTRY_LABELS[policy.country]}`,
    },
    url: `${SITE_URL}/policies/${policy.id}`,
  };

  return (
    <div className="bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell-wide py-8 xl:grid xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[#52525b]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#18181b] hover:underline">
                  All policies
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/countries/${policy.country}`}
                  className="hover:text-[#18181b] hover:underline"
                >
                  {COUNTRY_LABELS[policy.country]}
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-[#18181b]">
                {policy.name}
              </li>
            </ol>
          </nav>

          <article className="border border-[#e4e4e7] bg-white">
            <PolicyRecord policy={policy} headingLevel="h1" taxonomyClassName="xl:hidden" />
          </article>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm xl:hidden">
            <Link
              href={`/compare?policies=${policy.id}`}
              className="inline-flex h-10 items-center gap-2 border border-[#18181b] px-4 font-medium text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white"
            >
              <Scale className="h-4 w-4" />
              Compare with other policies
            </Link>
            <Link
              href={`/countries/${policy.country}`}
              className="inline-flex h-10 items-center gap-2 px-2 font-medium text-[#52525b] hover:text-[#18181b]"
            >
              <ArrowLeft className="h-4 w-4" />
              All policies in {COUNTRY_LABELS[policy.country]}
            </Link>
          </div>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl text-[#18181b]">Related policies</h2>
            <div className="grid gap-px border border-[#e4e4e7] bg-[#e4e4e7] sm:grid-cols-2">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/policies/${rel.id}`}
                  className="group flex flex-col gap-2 bg-white p-5 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display leading-snug text-[#18181b] group-hover:underline">
                      {rel.name}
                    </h3>
                    <EvidenceBadge quality={rel.evidenceQuality} className="shrink-0" />
                  </div>
                  <p className="text-sm text-[#52525b]">
                    {COUNTRY_LABELS[rel.country]}, {rel.yearStart}
                    {rel.isActive ? '-Present' : rel.yearEnd ? `-${rel.yearEnd}` : ''}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-[#52525b]/80">
                    {rel.policyTypes.map((t) => POLICY_TYPE_LABELS[t]).join(', ')}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

          <p className="mt-8 border-t border-[#e4e4e7] pt-4 text-xs leading-relaxed text-[#52525b]">
            Implementation status: {IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}.
            Spotted an error or have evaluation evidence to add? See the{' '}
            <Link href="/contribute" className="text-[#1e43c8] hover:underline">
              contribution guide
            </Link>
            .
          </p>
        </div>

        {/* Facts rail: xl only; below xl the same information lives inside the
            record header, the in-record taxonomy block, and the actions row. */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-6">
            <dl className="border border-[#e4e4e7] bg-white">
              <FactRow label="Country" value={COUNTRY_LABELS[policy.country]} />
              <FactRow
                label="Years"
                value={`${policy.yearStart}${policy.isActive ? '-Present' : policy.yearEnd ? `-${policy.yearEnd}` : ''}`}
              />
              <FactRow
                label="Status"
                value={IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}
              />
              <FactRow
                label="Evidence"
                value={<EvidenceBadge quality={policy.evidenceQuality} />}
              />
              {policy.coverage && <FactRow label="Coverage" value={policy.coverage} />}
            </dl>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-[#52525b]">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                {policy.policyTypes.map((type) => (
                  <Link
                    key={type}
                    href={`/topics/${type}`}
                    className="border border-[#e4e4e7] bg-[#f4f4f5] px-2.5 py-1.5 text-[10px] uppercase tracking-wide text-[#52525b] transition-colors hover:border-[#1e43c8] hover:text-[#18181b]"
                  >
                    {POLICY_TYPE_LABELS[type]}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-[#52525b]">
                Target populations
              </h2>
              <div className="flex flex-wrap gap-2">
                {policy.affectedPopulations.map((pop) => (
                  <span
                    key={pop}
                    className="border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-[10px] uppercase tracking-wide text-[#52525b]"
                  >
                    {AFFECTED_POPULATION_LABELS[pop]}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-[#e4e4e7] pt-4 text-sm">
              <Link
                href={`/compare?policies=${policy.id}`}
                className="inline-flex h-10 w-full items-center justify-center gap-2 border border-[#18181b] px-4 font-medium text-[#18181b] transition-colors hover:bg-[#18181b] hover:text-white"
              >
                <Scale className="h-4 w-4" />
                Compare with other policies
              </Link>
              <Link
                href={`/countries/${policy.country}`}
                className="inline-flex items-center gap-2 font-medium text-[#52525b] hover:text-[#18181b]"
              >
                <ArrowLeft className="h-4 w-4" />
                All policies in {COUNTRY_LABELS[policy.country]}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#e4e4e7] px-4 py-3 last:border-b-0">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-[#52525b]">
        {label}
      </dt>
      <dd className="text-right text-sm text-[#18181b]">{value}</dd>
    </div>
  );
}
