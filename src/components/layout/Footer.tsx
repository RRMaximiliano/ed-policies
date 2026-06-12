import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#e4e4e7] bg-[#18181b] text-white">
      <div className="shell-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5">
            <div className="mb-6">
              <div className="font-display text-xl font-bold tracking-tight">Ed Policies</div>
              <div className="mt-0.5 text-sm text-white/60">
                Latin America &amp; the Caribbean
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              A catalog of education policies implemented across Latin America and the
              Caribbean, with evaluation evidence where research exists. Built for
              researchers, policymakers, and students.
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
              href="https://github.com/RRMaximiliano/ed-policies"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-sm hover:bg-white hover:text-[#18181b] transition-colors"
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
            Open source under the MIT license
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
        className="text-sm text-white/70 hover:text-[#1e43c8] transition-colors"
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
        className="text-sm text-white/70 hover:text-[#1e43c8] transition-colors inline-flex items-center gap-1"
      >
        {children}
        <ArrowUpRight className="h-3 w-3 opacity-50" />
      </a>
    </li>
  );
}
