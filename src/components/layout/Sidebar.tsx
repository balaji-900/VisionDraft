'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/providers/ThemeProvider';
import { HiOutlineFilm, HiOutlineHome, HiOutlineFolderOpen, HiOutlineLightBulb, HiOutlineSparkles, HiOutlineCog6Tooth, HiOutlineArrowLeftOnRectangle, HiOutlineSun, HiOutlineMoon, HiOutlineBars3, HiOutlineXMark, HiOutlineAcademicCap } from 'react-icons/hi2';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/projects', label: 'Projects', icon: HiOutlineFolderOpen },
  { href: '/idea-vault', label: 'Idea Vault', icon: HiOutlineLightBulb },
  { href: '/ai-assistant', label: 'AI Assistant', icon: HiOutlineSparkles },
  { href: '/director-toolkit', label: 'Director Toolkit', icon: HiOutlineAcademicCap },
  { href: '/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 mb-2">
        <div className="w-9 h-9 rounded-lg bg-[var(--vd-accent)] flex items-center justify-center shrink-0">
          <HiOutlineFilm className="w-5 h-5 text-white" />
        </div>
        {!collapsed && <span className="text-lg font-bold" style={{ color: 'var(--vd-text)' }}>Vision<span style={{ color: 'var(--vd-accent)' }}>Draft</span></span>}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'glass-strong' : 'hover:bg-[var(--vd-accent-soft)]'}`} style={{ color: isActive ? 'var(--vd-accent)' : 'var(--vd-text-s)' }}>
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-2">
        <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full hover:bg-[var(--vd-accent-soft)] transition-all" style={{ color: 'var(--vd-text-s)' }}>
          {theme === 'dark' ? <HiOutlineSun className="w-5 h-5 shrink-0" /> : <HiOutlineMoon className="w-5 h-5 shrink-0" />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--vd-accent)' }}>
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--vd-text)' }}>{user?.displayName || 'User'}</p>
              <p className="text-xs truncate" style={{ color: 'var(--vd-text-m)' }}>{user?.email}</p>
            </div>
          )}
        </div>

        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full hover:bg-red-500/10 transition-all text-red-400">
          <HiOutlineArrowLeftOnRectangle className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass-strong flex items-center justify-center" style={{ color: 'var(--vd-text)' }}>
        <HiOutlineBars3 className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] z-50 border-r" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}>
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4" style={{ color: 'var(--vd-text-s)' }}>
                <HiOutlineXMark className="w-5 h-5" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 border-r transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[260px]'}`} style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}>
        <NavContent />
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-8 w-6 h-6 rounded-full border flex items-center justify-center text-xs hover:bg-[var(--vd-accent-soft)] transition-all" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text-s)' }}>
          {collapsed ? '→' : '←'}
        </button>
      </aside>
    </>
  );
}
