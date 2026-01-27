'use client';

import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf8f5]/95 backdrop-blur-sm border-b border-[#e5e0d8]">
      <div className="container max-w-screen-2xl">
        {/* Top bar with title */}
        <div className="flex items-center justify-between h-16 px-4 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            {/* Custom logo mark */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#1a2744] rounded-sm rotate-45 group-hover:rotate-[50deg] transition-transform duration-300" />
              <span className="font-serif text-lg font-bold text-[#1a2744] relative z-10">LA</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-xl text-[#1a2744] leading-tight">
                Education Policy
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#5c6578] -mt-0.5">
                Latin America Database
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Browse</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contribute">Contribute</NavLink>
            <div className="w-px h-5 bg-[#e5e0d8] mx-3" />
            <a
              href="https://github.com/RRMaximiliano/ed-policies"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5c6578] hover:text-[#1a2744] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#1a2744]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-sm bg-[#faf8f5] border-l border-[#e5e0d8]"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4 border-b border-[#e5e0d8]">
                  <span className="font-serif text-lg text-[#1a2744]">Menu</span>
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
                <div className="mt-auto py-6 border-t border-[#e5e0d8]">
                  <a
                    href="https://github.com/RRMaximiliano/ed-policies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#5c6578] hover:text-[#1a2744] transition-colors"
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
      className="relative px-4 py-2 text-sm font-medium text-[#5c6578] hover:text-[#1a2744] transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#c4654a] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
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
      className="py-4 text-lg font-serif text-[#1a2744] border-b border-[#e5e0d8] hover:pl-2 transition-all"
    >
      {children}
    </Link>
  );
}
