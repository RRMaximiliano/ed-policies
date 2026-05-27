import { Suspense } from 'react';
import { CompareClient } from './CompareClient';

export const metadata = {
  title: 'Compare Policies | Latin America Education Policy Database',
  description:
    'Compare selected Latin America education policies across implementation context, target populations, evidence quality, outcomes, and evaluation studies.',
};

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading comparison...</div>}>
      <CompareClient />
    </Suspense>
  );
}
