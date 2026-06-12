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
  PolicyType,
} from '@/types/policy';
import { TOPIC_DESCRIPTIONS } from '@/data/topics';
import { EvidenceBadge } from '@/components/policy/EvidenceBadge';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const allPolicies = policiesData as Policy[];
const typeSlugs = Object.keys(POLICY_TYPE_LABELS) as PolicyType[];

export const dynamicParams = false;

export function generateStaticParams() {
  return typeSlugs.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const label = POLICY_TYPE_LABELS[type as PolicyType];
  if (!label) return {};

  const count = allPolicies.filter((p) => p.policyTypes.includes(type as PolicyType)).length;
  const description = `${count} ${label.toLowerCase()} ${count === 1 ? 'policy' : 'policies'} across Latin America and the Caribbean, with evaluation evidence where research exists.`;
  return {
    title: `${label} policies in Latin America | ${SITE_NAME}`,
    description,
    openGraph: {
      title: `${label} policies in Latin America`,
      description,
      type: 'website',
      url: `${SITE_URL}/topics/${type}`,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const slug = type as PolicyType;
  const label = POLICY_TYPE_LABELS[slug];
  if (!label) notFound();

  const policies = allPolicies
    .filter((p) => p.policyTypes.includes(slug))
    .sort((a, b) => a.yearStart - b.yearStart);

  const countries = new Set(policies.map((p) => p.country));

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
          <h1 className="font-display text-3xl leading-tight text-[#18181b] md:text-5xl">
            {label}
          </h1>
          <p className="mt-4 max-w-prose leading-relaxed text-[#52525b]">
            {TOPIC_DESCRIPTIONS[slug]}
          </p>
          <p className="mt-3 text-sm text-[#52525b]">
            {policies.length} {policies.length === 1 ? 'policy' : 'policies'} in{' '}
            {countries.size} {countries.size === 1 ? 'country' : 'countries'}, listed oldest
            first.
          </p>
        </div>
      </header>

      <main className="shell-article py-8">
        {policies.length === 0 ? (
          <div className="border border-[#e4e4e7] bg-white px-4 py-16 text-center">
            <h2 className="font-display text-2xl text-[#18181b]">No policies cataloged yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#52525b]">
              We have not documented any {label.toLowerCase()} policies yet. Know one that
              belongs here?
            </p>
            <Link
              href="/contribute"
              className="mt-6 inline-flex h-10 items-center justify-center bg-[#18181b] px-4 text-sm font-medium text-white hover:bg-[#2f2f36]"
            >
              Contribute a policy
            </Link>
          </div>
        ) : (
          <ol className="divide-y divide-[#e4e4e7] border border-[#e4e4e7] bg-white">
            {policies.map((policy) => (
              <li key={policy.id}>
                <Link
                  href={`/policies/${policy.id}`}
                  className="group block px-5 py-5 transition-colors hover:bg-[#fafafa]"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-14 shrink-0 pt-0.5 font-display text-lg tabular-nums text-[#1e43c8]">
                      {policy.yearStart}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg leading-snug text-[#18181b] group-hover:underline">
                        {policy.name}
                      </h2>
                      <p className="mt-1 text-sm text-[#52525b]">
                        {COUNTRY_LABELS[policy.country as Country]}
                        {' · '}
                        {IMPLEMENTATION_STATUS_LABELS[policy.implementationStatus]}
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
          </ol>
        )}

        <p className="mt-6 text-sm text-[#52525b]">
          Want to combine this with country or evidence filters?{' '}
          <Link
            href={`/?types=${slug}`}
            className="font-medium text-[#1e43c8] hover:underline"
          >
            Open {label.toLowerCase()} in the policy browser
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
