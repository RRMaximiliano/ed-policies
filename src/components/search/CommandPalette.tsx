'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Policy, COUNTRY_LABELS, POLICY_TYPE_LABELS } from '@/types/policy';
import { useFilterStore } from '@/store/filterStore';
import { MapPin, Calendar, FileText, Filter, RotateCcw } from 'lucide-react';

interface CommandPaletteProps {
  policies: Policy[];
  onSelectPolicy: (policy: Policy) => void;
}

export function CommandPalette({ policies, onSelectPolicy }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { clearFilters, setSearchQuery } = useFilterStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback(
    (policy: Policy) => {
      setOpen(false);
      setSearch('');
      onSelectPolicy(policy);
    },
    [onSelectPolicy]
  );

  const handleSearch = useCallback(() => {
    if (search) {
      setSearchQuery(search);
      setOpen(false);
      setSearch('');
    }
  }, [search, setSearchQuery]);

  // Filter policies based on search
  const filteredPolicies = search
    ? policies.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.acronym?.toLowerCase().includes(search.toLowerCase()) ||
          COUNTRY_LABELS[p.country].toLowerCase().includes(search.toLowerCase())
      ).slice(0, 8)
    : policies.slice(0, 5);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search policies by name, country, or acronym..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No policies found.</CommandEmpty>

        {search && (
          <>
            <CommandGroup heading="Actions">
              <CommandItem onSelect={handleSearch}>
                <Filter className="mr-2 h-4 w-4" />
                Search for &quot;{search}&quot; in all policies
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading={search ? 'Matching Policies' : 'Recent Policies'}>
          {filteredPolicies.map((policy) => (
            <CommandItem
              key={policy.id}
              value={`${policy.name} ${policy.acronym || ''} ${COUNTRY_LABELS[policy.country]}`}
              onSelect={() => handleSelect(policy)}
            >
              <FileText className="mr-2 h-4 w-4 shrink-0" />
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="truncate">{policy.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  {COUNTRY_LABELS[policy.country]}
                  <span className="text-muted-foreground/50">|</span>
                  <Calendar className="h-3 w-3" />
                  {policy.yearStart}
                </span>
              </div>
              {policy.acronym && (
                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                  {policy.acronym}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              clearFilters();
              setOpen(false);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear all filters
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push('/about');
              setOpen(false);
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            About & Methodology
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
