import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#e5e0d8] bg-[#1a2744] text-white">
      <div className="container max-w-screen-2xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-white/30 rounded-sm rotate-45" />
                <span className="font-serif text-lg font-bold relative z-10">LA</span>
              </div>
              <div>
                <div className="font-serif text-xl leading-tight">Education Policy</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Latin America Database
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              A curated collection of education policies implemented across Latin America,
              designed for researchers, policymakers, and students seeking evidence-based insights.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/50 mb-4">Navigation</h3>
            <ul className="space-y-3">
              <FooterLink href="/">Browse Policies</FooterLink>
              <FooterLink href="/about">About & Methodology</FooterLink>
              <FooterLink href="/contribute">Contribute</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/50 mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterExternalLink href="https://publications.iadb.org/">
                IADB Publications
              </FooterExternalLink>
              <FooterExternalLink href="https://www.povertyactionlab.org/">
                J-PAL Evaluations
              </FooterExternalLink>
              <FooterExternalLink href="https://documents.worldbank.org/">
                World Bank Documents
              </FooterExternalLink>
              <FooterExternalLink href="https://voxdev.org/topic/education">
                VoxDev Research
              </FooterExternalLink>
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-2">
            <h3 className="text-xs uppercase tracking-[0.15em] text-white/50 mb-4">Open Source</h3>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-sm hover:bg-white hover:text-[#1a2744] transition-colors"
            >
              View on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            Data compiled from peer-reviewed research and official government sources.
          </p>
          <p className="text-xs text-white/50">
            2024 &middot; Open source project
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/70 hover:text-[#c4654a] transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function FooterExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/70 hover:text-[#c4654a] transition-colors inline-flex items-center gap-1"
      >
        {children}
        <ArrowUpRight className="h-3 w-3 opacity-50" />
      </a>
    </li>
  );
}
