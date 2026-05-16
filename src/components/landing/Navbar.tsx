'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/providers/ThemeProvider';
import { HiOutlineFilm, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-strong py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[var(--vd-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
            <HiOutlineFilm className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--vd-text)' }}>
            Vision<span style={{ color: 'var(--vd-accent)' }}>Draft</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>Features</a>
          <a href="#ai" className="text-sm font-medium hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>AI Tools</a>
          <a href="#workflow" className="text-sm font-medium hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>Workflow</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--vd-accent-soft)]"
            style={{ color: 'var(--vd-text-s)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>

          <Link href="/login" className="hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-all hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text)' }}>
            Log In
          </Link>
          <Link href="/signup" className="btn-primary text-sm !py-2 !px-5">
            Get Started
          </Link>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            <span className={`w-5 h-0.5 rounded-full transition-all ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} style={{ background: 'var(--vd-text)' }} />
            <span className={`w-5 h-0.5 rounded-full transition-all ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} style={{ background: 'var(--vd-text)' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              <a href="#features" className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text)' }}>Features</a>
              <a href="#ai" className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text)' }}>AI Tools</a>
              <a href="#workflow" className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text)' }}>Workflow</a>
              <Link href="/login" className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text)' }}>Log In</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
