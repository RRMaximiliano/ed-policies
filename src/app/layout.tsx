import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Latin America Education Policy Database',
  description:
    'A comprehensive, searchable database of education policies implemented across Latin America. Designed for PhD students, policy evaluators, and researchers.',
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
