'use client';

import Link from 'next/link';
import { Policy } from '@/types/policy';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PolicyRecord } from '@/components/policy/PolicyRecord';
import { ArrowUpRight } from 'lucide-react';

interface PolicyDetailProps {
  policy: Policy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolicyDetail({ policy, open, onOpenChange }: PolicyDetailProps) {
  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden border-[#e4e4e7] bg-[#fafafa] p-0">
        <DialogTitle className="sr-only">{policy.name}</DialogTitle>
        <ScrollArea className="max-h-[90vh] overflow-x-hidden">
          <PolicyRecord policy={policy} headingLevel="h2" />
          <div className="border-t border-[#e4e4e7] bg-white px-6 py-4">
            <Link
              href={`/policies/${policy.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1e43c8] hover:underline"
            >
              Open full page for citing and sharing
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
