'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SearchBar({ className }: { className?: string }) {
  const setSearchQuery = useFilterStore((state) => state.setSearchQuery);
  const [localQuery, setLocalQuery] = useState(() => useFilterStore.getState().searchQuery);
  const localQueryRef = useRef(localQuery);
  const [isFocused, setIsFocused] = useState(false);

  const updateLocalQuery = useCallback((query: string) => {
    localQueryRef.current = query;
    setLocalQuery(query);
  }, []);

  // Debounce search updates
  useEffect(() => {
    if (localQuery === useFilterStore.getState().searchQuery) {
      return;
    }

    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Sync with store when filters are cleared or command search is used.
  useEffect(() => {
    return useFilterStore.subscribe((state, previousState) => {
      if (
        state.searchQuery !== previousState.searchQuery &&
        state.searchQuery !== localQueryRef.current
      ) {
        updateLocalQuery(state.searchQuery);
      }
    });
  }, [updateLocalQuery]);

  const handleClear = useCallback(() => {
    updateLocalQuery('');
    setSearchQuery('');
  }, [setSearchQuery, updateLocalQuery]);

  return (
    <div className={cn('relative h-11 w-full max-w-md group', className)}>
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isFocused ? 'text-[#1e43c8]' : 'text-[#52525b]'}`} />
      <input
        type="text"
        placeholder="Search by name, country, or acronym..."
        value={localQuery}
        onChange={(e) => updateLocalQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-11 pl-11 pr-20 bg-white border border-[#e4e4e7] text-[#18181b] placeholder:text-[#52525b]/60 text-sm focus:outline-none focus:border-[#1e43c8] focus:ring-1 focus:ring-[#1e43c8]/20 transition-all"
      />
      {localQuery ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#52525b] hover:text-[#18181b] transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-[#52525b]">
          <kbd className="px-1.5 py-0.5 bg-[#f4f4f5] border border-[#e4e4e7] rounded text-[10px] font-mono">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 bg-[#f4f4f5] border border-[#e4e4e7] rounded text-[10px] font-mono">K</kbd>
        </div>
      )}
    </div>
  );
}
