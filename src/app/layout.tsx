import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Latin America Education Policy Database',
  description:
    'A comprehensive, searchable catalog of education policies implemented across Latin America and the Caribbean, with evaluation evidence where research exists. Designed for PhD students, policy evaluators, and researchers.',
  keywords: [
    'education policy',
    'Latin America',
    'policy evaluation',
    'conditional cash transfers',
    'school feeding',
    'education research',
  ],
  authors: [{ name: 'Latin America Education Policy Database' }],
  openGraph: {
    title: 'Latin America Education Policy Database',
    description:
      'Explore evidence-based education policies across Latin America. Search by country, policy type, or evidence quality.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latin America Education Policy Database',
    description:
      'Explore evidence-based education policies across Latin America.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: SITE_NAME,
    description:
      'A catalog of education policies implemented across Latin America and the Caribbean, with evidence ratings and evaluation studies where research exists.',
    url: SITE_URL,
    license: 'https://opensource.org/licenses/MIT',
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl:
          'https://raw.githubusercontent.com/RRMaximiliano/ed-policies/main/src/data/policies.json',
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
