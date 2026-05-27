'use client';

import { useMemo } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { useFilterStore } from '@/store/filterStore';
import {
  AFFECTED_POPULATION_LABELS,
  COUNTRY_LABELS,
  EVIDENCE_QUALITY_LABELS,
  POLICY_TYPE_LABELS,
  Country,
  EvidenceQuality,
  PolicyType,
} from '@/types/policy';
import { ChevronDown, Filter, RotateCcw, X } from 'lucide-react';

interface FilterToolbarProps {
  countryCounts?: Map<string, number>;
  typeCounts?: Map<string, number>;
  populationCounts?: Map<string, number>;
  evidenceCounts?: Map<string, number>;
}

export function FilterToolbar({
  countryCounts,
  typeCounts,
  populationCounts,
  evidenceCounts,
}: FilterToolbarProps) {
  const {
    searchQuery,
    countries,
    policyTypes,
    affectedPopulations,
    evidenceQuality,
    activeOnly,
    toggleCountry,
    togglePolicyType,
    toggleAffectedPopulation,
    toggleEvidenceQuality,
    setSearchQuery,
    setActiveOnly,
    clearFilters,
    hasActiveFilters,
    getActiveFilterCount,
  } = useFilterStore();

  const activeFilterCount = getActiveFilterCount();

  const countryOptions = useMemo(
    () =>
      (Object.keys(COUNTRY_LABELS) as Country[])
        .filter((country) => (countryCounts?.get(country) || 0) > 0)
        .sort((a, b) => COUNTRY_LABELS[a].localeCompare(COUNTRY_LABELS[b])),
    [countryCounts]
  );

  const typeOptions = useMemo(
    () =>
      (Object.keys(POLICY_TYPE_LABELS) as PolicyType[])
        .filter((type) => (typeCounts?.get(type) || 0) > 0)
        .sort((a, b) => POLICY_TYPE_LABELS[a].localeCompare(POLICY_TYPE_LABELS[b])),
    [typeCounts]
  );

  const evidenceOptions = useMemo(
    () =>
      (Object.keys(EVIDENCE_QUALITY_LABELS) as EvidenceQuality[]).filter(
        (quality) => (evidenceCounts?.get(quality) || 0) > 0
      ),
    [evidenceCounts]
  );

  return (
    <section className="mb-6 border border-[#e5e0d8] bg-white">
      <div className="grid gap-3 border-b border-[#e5e0d8] p-4 lg:grid-cols-[minmax(280px,1fr)_auto]">
        <SearchBar className="max-w-none" />

        <div className="flex flex-wrap items-center gap-2">
          <QuickSelect
            label="Country"
            value=""
            onChange={(value) => value && toggleCountry(value as Country)}
            options={countryOptions
              .filter((country) => !countries.includes(country))
              .map((country) => ({
                value: country,
                label: COUNTRY_LABELS[country],
                count: countryCounts?.get(country),
              }))}
          />
          <QuickSelect
            label="Policy type"
            value=""
            onChange={(value) => value && togglePolicyType(value as PolicyType)}
            options={typeOptions
              .filter((type) => !policyTypes.includes(type))
              .map((type) => ({
                value: type,
                label: POLICY_TYPE_LABELS[type],
                count: typeCounts?.get(type),
              }))}
          />
          <QuickSelect
            label="Evidence"
            value=""
            onChange={(value) => value && toggleEvidenceQuality(value as EvidenceQuality)}
            options={evidenceOptions
              .filter((quality) => !evidenceQuality.includes(quality))
              .map((quality) => ({
                value: quality,
                label: EVIDENCE_QUALITY_LABELS[quality],
                count: evidenceCounts?.get(quality),
              }))}
          />

          <label className="flex h-11 items-center gap-2 border border-[#e5e0d8] bg-[#fbfaf7] px-3 text-sm text-[#1a2744]">
            <Checkbox
              checked={activeOnly}
              onCheckedChange={(checked) => setActiveOnly(checked as boolean)}
              className="border-[#d8d2c8]"
            />
            Active only
          </label>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-none border-[#e5e0d8] bg-white text-[#1a2744] hover:border-[#c4654a] hover:bg-[#fbfaf7]"
              >
                <Filter className="h-4 w-4" />
                More filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-[#c4654a] px-1.5 py-0.5 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[340px] max-w-[92vw] bg-[#faf8f5] p-0 sm:w-[400px]"
            >
              <SheetTitle className="sr-only">Filter Policies</SheetTitle>
              <div className="p-6">
                <FilterSidebar
                  countryCounts={countryCounts}
                  typeCounts={typeCounts}
                  populationCounts={populationCounts}
                  evidenceCounts={evidenceCounts}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-4">
        {hasActiveFilters() ? (
          <>
            {searchQuery && (
              <FilterChip label={`Search: ${searchQuery}`} onRemove={() => setSearchQuery('')} />
            )}
            {countries.map((country) => (
              <FilterChip
                key={country}
                label={COUNTRY_LABELS[country]}
                onRemove={() => toggleCountry(country)}
              />
            ))}
            {policyTypes.map((type) => (
              <FilterChip
                key={type}
                label={POLICY_TYPE_LABELS[type]}
                onRemove={() => togglePolicyType(type)}
              />
            ))}
            {evidenceQuality.map((quality) => (
              <FilterChip
                key={quality}
                label={`${EVIDENCE_QUALITY_LABELS[quality]} evidence`}
                onRemove={() => toggleEvidenceQuality(quality)}
              />
            ))}
            {affectedPopulations.map((population) => (
              <FilterChip
                key={population}
                label={AFFECTED_POPULATION_LABELS[population]}
                onRemove={() => toggleAffectedPopulation(population)}
              />
            ))}
            {activeOnly && (
              <FilterChip label="Active policies only" onRemove={() => setActiveOnly(false)} />
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 inline-flex h-7 items-center gap-1.5 px-2 text-xs font-medium text-[#5c6578] hover:text-[#c4654a]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear all
            </button>
          </>
        ) : (
          <span className="text-sm text-[#5c6578]">
            No filters active. Add filters above to narrow the evidence set.
          </span>
        )}
      </div>
    </section>
  );
}

function QuickSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; count?: number }>;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-w-[150px] appearance-none border border-[#e5e0d8] bg-white py-2 pl-3 pr-8 text-sm text-[#1a2744] outline-none transition-colors hover:border-[#c4654a] focus:border-[#c4654a] focus:ring-1 focus:ring-[#c4654a]/20"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
            {option.count !== undefined ? ` (${option.count})` : ''}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5c6578]">
        <ChevronDown className="h-3.5 w-3.5" />
      </span>
    </label>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-7 max-w-full items-center gap-1.5 border border-[#d8d2c8] bg-[#f5f2ed] px-2 text-xs text-[#1a2744]">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-[#5c6578] hover:text-[#c4654a]"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
