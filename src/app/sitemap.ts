import type { MetadataRoute } from 'next';
import policiesData from '@/data/policies.json';
import { COUNTRY_LABELS, POLICY_TYPE_LABELS, Policy } from '@/types/policy';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const allPolicies = policiesData as Policy[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/compare`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contribute`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const policyPages: MetadataRoute.Sitemap = allPolicies.map((policy) => ({
    url: `${SITE_URL}/policies/${policy.id}`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const countryPages: MetadataRoute.Sitemap = Object.keys(COUNTRY_LABELS).map((country) => ({
    url: `${SITE_URL}/countries/${country}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const topicPages: MetadataRoute.Sitemap = Object.keys(POLICY_TYPE_LABELS).map((type) => ({
    url: `${SITE_URL}/topics/${type}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...policyPages, ...countryPages, ...topicPages];
}
