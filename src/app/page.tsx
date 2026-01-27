'use client';

import { useState, useCallback, Suspense } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { usePolicies, useFilterOptions } from '@/hooks/usePolicies';
import { Hero } from '@/components/layout/Hero';
import { PolicyGrid } from '@/components/policy/PolicyGrid';
import { PolicyDetail } from '@/components/policy/PolicyDetail';
import { FilterSidebar, MobileFilterSheet } from '@/components/filters/FilterSidebar';
import { SearchBar } from '@/components/search/SearchBar';
import { CommandPalette } from '@/components/search/CommandPalette';
import { Policy } from '@/types/policy';
import policiesData from '@/data/policies.json';

const allPolicies = policiesData as Policy[];

function PolicyBrowser() {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filters = useFilterStore();
  const { policies, totalCount, filteredCount, stats } = usePolicies(allPolicies, filters);
  const filterOptions = useFilterOptions(allPolicies);

  const handlePolicyClick = useCallback((policy: Policy) => {
    setSelectedPolicy(policy);
    setDetailOpen(true);
  }, []);

  const handleClearFilters = useCallback(() => {
    filters.clearFilters();
  }, [filters]);

  return (
    <>
      <Hero
        totalPolicies={totalCount}
        countryCount={stats.countryCount}
        highEvidenceCount={stats.highEvidenceCount}
      />

      <div className="container max-w-screen-2xl px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                countryCounts={filterOptions.countryCounts}
                typeCounts={filterOptions.typeCounts}
                populationCounts={filterOptions.populationCounts}
                evidenceCounts={filterOptions.evidenceCounts}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchBar />
              <MobileFilterSheet
                countryCounts={filterOptions.countryCounts}
                typeCounts={filterOptions.typeCounts}
                populationCounts={filterOptions.populationCounts}
                evidenceCounts={filterOptions.evidenceCounts}
              />
            </div>

            <PolicyGrid
              policies={policies}
              onPolicyClick={handlePolicyClick}
              onClearFilters={handleClearFilters}
              totalCount={totalCount}
            />
          </main>
        </div>
      </div>

      <PolicyDetail
        policy={selectedPolicy}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <CommandPalette policies={allPolicies} onSelectPolicy={handlePolicyClick} />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PolicyBrowser />
    </Suspense>
  );
}
