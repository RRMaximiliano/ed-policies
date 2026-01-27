'use client';

import { useFilterStore } from '@/store/filterStore';
import {
  COUNTRY_LABELS,
  POLICY_TYPE_LABELS,
  AFFECTED_POPULATION_LABELS,
  EVIDENCE_QUALITY_LABELS,
  Country,
  PolicyType,
  AffectedPopulation,
  EvidenceQuality,
} from '@/types/policy';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterSidebarProps {
  countryCounts?: Map<string, number>;
  typeCounts?: Map<string, number>;
  populationCounts?: Map<string, number>;
  evidenceCounts?: Map<string, number>;
}

export function FilterSidebar({
  countryCounts,
  typeCounts,
  populationCounts,
  evidenceCounts,
}: FilterSidebarProps) {
  const {
    countries,
    policyTypes,
    affectedPopulations,
    evidenceQuality,
    activeOnly,
    toggleCountry,
    togglePolicyType,
    toggleAffectedPopulation,
    toggleEvidenceQuality,
    setActiveOnly,
    clearFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const filterCount = getActiveFilterCount();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e5e0d8]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg text-[#1a2744]">Filters</span>
          {filterCount > 0 && (
            <span className="text-xs bg-[#c4654a] text-white px-2 py-0.5 rounded-full">
              {filterCount}
            </span>
          )}
        </div>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-[#5c6578] hover:text-[#c4654a] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-240px)]">
        <div className="space-y-6 pr-4">
          {/* Active Status */}
          <FilterSection title="Status" defaultOpen>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="active-only"
                checked={activeOnly}
                onCheckedChange={(checked) => setActiveOnly(checked as boolean)}
                className="border-[#e5e0d8] data-[state=checked]:bg-[#1a2744] data-[state=checked]:border-[#1a2744]"
              />
              <label
                htmlFor="active-only"
                className="text-sm text-[#1a2744] cursor-pointer select-none"
              >
                Active policies only
              </label>
            </div>
          </FilterSection>

          {/* Evidence Quality */}
          <FilterSection title="Evidence Quality" defaultOpen>
            {(Object.keys(EVIDENCE_QUALITY_LABELS) as EvidenceQuality[]).map((quality) => (
              <FilterCheckbox
                key={quality}
                id={`evidence-${quality}`}
                label={EVIDENCE_QUALITY_LABELS[quality]}
                checked={evidenceQuality.includes(quality)}
                count={evidenceCounts?.get(quality)}
                onChange={() => toggleEvidenceQuality(quality)}
              />
            ))}
          </FilterSection>

          {/* Policy Types */}
          <FilterSection title="Policy Type" defaultOpen>
            {(Object.keys(POLICY_TYPE_LABELS) as PolicyType[]).map((type) => (
              <FilterCheckbox
                key={type}
                id={`type-${type}`}
                label={POLICY_TYPE_LABELS[type]}
                checked={policyTypes.includes(type)}
                count={typeCounts?.get(type)}
                onChange={() => togglePolicyType(type)}
              />
            ))}
          </FilterSection>

          {/* Countries */}
          <FilterSection title="Country">
            {(Object.keys(COUNTRY_LABELS) as Country[])
              .sort((a, b) => COUNTRY_LABELS[a].localeCompare(COUNTRY_LABELS[b]))
              .map((country) => (
                <FilterCheckbox
                  key={country}
                  id={`country-${country}`}
                  label={COUNTRY_LABELS[country]}
                  checked={countries.includes(country)}
                  count={countryCounts?.get(country)}
                  onChange={() => toggleCountry(country)}
                />
              ))}
          </FilterSection>

          {/* Affected Populations */}
          <FilterSection title="Target Population">
            {(Object.keys(AFFECTED_POPULATION_LABELS) as AffectedPopulation[]).map(
              (population) => (
                <FilterCheckbox
                  key={population}
                  id={`pop-${population}`}
                  label={AFFECTED_POPULATION_LABELS[population]}
                  checked={affectedPopulations.includes(population)}
                  count={populationCounts?.get(population)}
                  onChange={() => toggleAffectedPopulation(population)}
                />
              )
            )}
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#e5e0d8] pb-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <h3 className="text-xs uppercase tracking-[0.15em] font-medium text-[#5c6578]">
          {title}
        </h3>
        <ChevronDown
          className={`h-4 w-4 text-[#5c6578] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  id,
  label,
  checked,
  count,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onChange}
          className="border-[#e5e0d8] data-[state=checked]:bg-[#1a2744] data-[state=checked]:border-[#1a2744]"
        />
        <label
          htmlFor={id}
          className="text-sm text-[#1a2744] cursor-pointer select-none group-hover:text-[#c4654a] transition-colors"
        >
          {label}
        </label>
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-xs text-[#5c6578] tabular-nums">{count}</span>
      )}
    </div>
  );
}

// Mobile filter sheet wrapper
export function MobileFilterSheet({
  children,
  ...props
}: FilterSidebarProps & { children?: React.ReactNode }) {
  const { getActiveFilterCount } = useFilterStore();
  const filterCount = getActiveFilterCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#1a2744] border border-[#e5e0d8] bg-white hover:border-[#c4654a] transition-colors">
          <Filter className="h-4 w-4" />
          Filters
          {filterCount > 0 && (
            <span className="bg-[#c4654a] text-white px-2 py-0.5 rounded-full text-xs">
              {filterCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[380px] bg-[#faf8f5] border-r border-[#e5e0d8] p-0">
        <SheetTitle className="sr-only">Filter Policies</SheetTitle>
        <div className="p-6">
          <FilterSidebar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
