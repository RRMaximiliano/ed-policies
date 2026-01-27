import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  FilterState,
  DEFAULT_FILTERS,
  Country,
  PolicyType,
  AffectedPopulation,
  EvidenceQuality,
} from '@/types/policy';

interface FilterStore extends FilterState {
  // Actions
  setSearchQuery: (query: string) => void;
  toggleCountry: (country: Country) => void;
  togglePolicyType: (type: PolicyType) => void;
  toggleAffectedPopulation: (population: AffectedPopulation) => void;
  toggleEvidenceQuality: (quality: EvidenceQuality) => void;
  setActiveOnly: (active: boolean) => void;
  setYearRange: (range: [number, number]) => void;
  clearFilters: () => void;
  setFilters: (filters: Partial<FilterState>) => void;

  // Computed
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_FILTERS,

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleCountry: (country) =>
        set((state) => ({
          countries: state.countries.includes(country)
            ? state.countries.filter((c) => c !== country)
            : [...state.countries, country],
        })),

      togglePolicyType: (type) =>
        set((state) => ({
          policyTypes: state.policyTypes.includes(type)
            ? state.policyTypes.filter((t) => t !== type)
            : [...state.policyTypes, type],
        })),

      toggleAffectedPopulation: (population) =>
        set((state) => ({
          affectedPopulations: state.affectedPopulations.includes(population)
            ? state.affectedPopulations.filter((p) => p !== population)
            : [...state.affectedPopulations, population],
        })),

      toggleEvidenceQuality: (quality) =>
        set((state) => ({
          evidenceQuality: state.evidenceQuality.includes(quality)
            ? state.evidenceQuality.filter((q) => q !== quality)
            : [...state.evidenceQuality, quality],
        })),

      setActiveOnly: (active) => set({ activeOnly: active }),

      setYearRange: (range) => set({ yearRange: range }),

      clearFilters: () => set(DEFAULT_FILTERS),

      setFilters: (filters) => set(filters),

      hasActiveFilters: () => {
        const state = get();
        return (
          state.searchQuery !== '' ||
          state.countries.length > 0 ||
          state.policyTypes.length > 0 ||
          state.affectedPopulations.length > 0 ||
          state.evidenceQuality.length > 0 ||
          state.activeOnly ||
          state.yearRange[0] !== DEFAULT_FILTERS.yearRange[0] ||
          state.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]
        );
      },

      getActiveFilterCount: () => {
        const state = get();
        let count = 0;
        if (state.searchQuery) count++;
        count += state.countries.length;
        count += state.policyTypes.length;
        count += state.affectedPopulations.length;
        count += state.evidenceQuality.length;
        if (state.activeOnly) count++;
        if (
          state.yearRange[0] !== DEFAULT_FILTERS.yearRange[0] ||
          state.yearRange[1] !== DEFAULT_FILTERS.yearRange[1]
        )
          count++;
        return count;
      },
    }),
    {
      name: 'ed-policies-filters',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        countries: state.countries,
        policyTypes: state.policyTypes,
        affectedPopulations: state.affectedPopulations,
        evidenceQuality: state.evidenceQuality,
        activeOnly: state.activeOnly,
        yearRange: state.yearRange,
      }),
    }
  )
);
