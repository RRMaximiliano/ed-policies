'use client';

import { History, LayoutGrid, Table2 } from 'lucide-react';

export type BrowserView = 'table' | 'cards' | 'timeline';

const views: Array<{ key: BrowserView; label: string; icon: React.ReactNode }> = [
  { key: 'table', label: 'Table', icon: <Table2 className="h-3.5 w-3.5" /> },
  { key: 'cards', label: 'Cards', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { key: 'timeline', label: 'Timeline', icon: <History className="h-3.5 w-3.5" /> },
];

export function ViewSwitcher({
  view,
  onViewChange,
}: {
  view: BrowserView;
  onViewChange: (view: BrowserView) => void;
}) {
  return (
    <div role="group" aria-label="Result view" className="inline-flex border border-[#e4e4e7]">
      {views.map((option) => {
        const isActive = view === option.key;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onViewChange(option.key)}
            className={`inline-flex h-9 items-center gap-1.5 border-r border-[#e4e4e7] px-3 text-sm last:border-r-0 ${
              isActive
                ? 'bg-[#18181b] text-white'
                : 'bg-white text-[#52525b] hover:bg-[#fafafa] hover:text-[#18181b]'
            }`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sr-only sm:hidden">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
