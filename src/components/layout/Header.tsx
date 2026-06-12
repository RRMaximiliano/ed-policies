'use client';

import Link from 'next/link';
import { Github, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fafafa]/95 backdrop-blur-sm border-b border-[#e4e4e7]">
      <div className="shell-wide">
        {/* Top bar with title */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-[#18181b]">
              Ed Policies
            </span>
            <span className="hidden text-sm text-[#52525b] sm:inline">
              Latin America &amp; the Caribbean
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Browse</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contribute">Contribute</NavLink>
            <div className="w-px h-5 bg-[#e4e4e7] mx-3" />
            <a
              href="https://github.com/RRMaximiliano/ed-policies"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#52525b] hover:text-[#18181b] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#18181b]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-sm bg-[#fafafa] border-l border-[#e4e4e7]"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b border-[#e4e4e7]">
                  <span className="font-display text-lg text-[#18181b]">Menu</span>
                </div>
                <nav className="flex flex-col py-8">
                  <MobileNavLink href="/" onClick={() => setOpen(false)}>
                    Browse Policies
                  </MobileNavLink>
                  <MobileNavLink href="/about" onClick={() => setOpen(false)}>
                    About & Methodology
                  </MobileNavLink>
                  <MobileNavLink href="/contribute" onClick={() => setOpen(false)}>
                    Contribute
                  </MobileNavLink>
                </nav>
                <div className="mt-auto py-6 border-t border-[#e4e4e7]">
                  <a
                    href="https://github.com/RRMaximiliano/ed-policies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#52525b] hover:text-[#18181b] transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="text-sm">View on GitHub</span>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-medium text-[#52525b] hover:text-[#18181b] transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#1e43c8] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="py-4 text-lg font-display text-[#18181b] border-b border-[#e4e4e7] hover:pl-2 transition-all"
    >
      {children}
    </Link>
  );
}
