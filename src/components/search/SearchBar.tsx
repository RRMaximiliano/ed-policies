'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFilterStore } from '@/store/filterStore';
import { Search, X } from 'lucide-react';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  // Sync with store when cleared externally
  useEffect(() => {
    if (searchQuery === '' && localQuery !== '') {
      setLocalQuery('');
    }
  }, [searchQuery]);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <div className="relative w-full max-w-md group">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isFocused ? 'text-[#c4654a]' : 'text-[#5c6578]'}`} />
      <input
        type="text"
        placeholder="Search by name, country, or acronym..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-11 pl-11 pr-20 bg-white border border-[#e5e0d8] text-[#1a2744] placeholder:text-[#5c6578]/60 text-sm focus:outline-none focus:border-[#c4654a] focus:ring-1 focus:ring-[#c4654a]/20 transition-all"
      />
      {localQuery ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#5c6578] hover:text-[#1a2744] transition-colors"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      ) : (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-[#5c6578]">
          <kbd className="px-1.5 py-0.5 bg-[#f5f2ed] border border-[#e5e0d8] rounded text-[10px] font-mono">Ctrl</kbd>
          <kbd className="px-1.5 py-0.5 bg-[#f5f2ed] border border-[#e5e0d8] rounded text-[10px] font-mono">K</kbd>
        </div>
      )}
    </div>
  );
}
