'use client';

import Link from 'next/link';
import { HiOutlineFilm } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="py-12 border-t" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--vd-accent)] flex items-center justify-center">
              <HiOutlineFilm className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--vd-text)' }}>
              Vision<span style={{ color: 'var(--vd-accent)' }}>Draft</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>Features</a>
            <a href="#ai" className="text-sm hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>AI Tools</a>
            <a href="#workflow" className="text-sm hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>Workflow</a>
          </div>
          <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>© 2026 VisionDraft. Crafted for storytellers.</p>
        </div>
      </div>
    </footer>
  );
}
