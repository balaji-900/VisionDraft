'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { settingSections } from '@/components/settings/SettingSections';
import {
  HiOutlineUser, HiOutlineSwatch, HiOutlinePencilSquare,
  HiOutlineSparkles, HiOutlineLightBulb, HiOutlineBell,
  HiOutlineArrowUpTray, HiOutlineShieldCheck, HiOutlineCodeBracket,
} from 'react-icons/hi2';

const NAV = [
  { id: 'profile',       label: 'Profile',            icon: HiOutlineUser,          color: '#6366f1', desc: 'Identity & genres' },
  { id: 'appearance',    label: 'Appearance',          icon: HiOutlineSwatch,         color: '#ec4899', desc: 'Themes & editor UI' },
  { id: 'writing',       label: 'Writing',             icon: HiOutlinePencilSquare,   color: '#f59e0b', desc: 'Format & auto-save' },
  { id: 'ai',            label: 'AI Assistant',        icon: HiOutlineSparkles,       color: '#6366f1', desc: 'Personality & features' },
  { id: 'vault',         label: 'Idea Vault',          icon: HiOutlineLightBulb,      color: '#10b981', desc: 'Capture settings' },
  { id: 'notifications', label: 'Notifications',       icon: HiOutlineBell,           color: '#f59e0b', desc: 'Reminders & alerts' },
  { id: 'backup',        label: 'Backup & Export',     icon: HiOutlineArrowUpTray,    color: '#3b82f6', desc: 'Sync & export' },
  { id: 'privacy',       label: 'Privacy & Security',  icon: HiOutlineShieldCheck,    color: '#ef4444', desc: 'Account safety' },
  { id: 'author',        label: 'Author',              icon: HiOutlineCodeBracket,    color: '#6366f1', desc: 'Developer info' },
];

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const ActiveSection = settingSections[active];

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />

      <div className="flex-1 lg:ml-[260px] flex flex-col">
        {/* Page Header */}
        <div
          className="relative overflow-hidden border-b px-6 py-8 md:px-10 shrink-0"
          style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 90% 20%, #ec4899 0%, transparent 40%)' }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--vd-accent)' }}>
              Director Control Panel
            </p>
            <h1 className="text-2xl md:text-3xl font-black" style={{ color: 'var(--vd-text)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--vd-text-m)' }}>
              Tune your creative workspace to match your directing vision.
            </p>
          </div>
        </div>

        {/* Body — sidebar nav + content */}
        <div className="flex flex-1 overflow-hidden">

          {/* Settings Nav */}
          <nav
            className="hidden md:flex flex-col w-56 shrink-0 border-r overflow-y-auto py-4 px-3 gap-1"
            style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}
          >
            {NAV.map(item => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                  style={{
                    background: isActive ? `${item.color}15` : 'transparent',
                    border: `1px solid ${isActive ? item.color + '40' : 'transparent'}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                    style={{ background: isActive ? `${item.color}20` : 'var(--vd-bg)' }}
                  >
                    <item.icon className="w-4 h-4" style={{ color: isActive ? item.color : 'var(--vd-text-m)' }} />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: isActive ? item.color : 'var(--vd-text)' }}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--vd-text-s)' }}>{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Mobile tabs */}
          <div
            className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 border-b shrink-0"
            style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}
          >
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: active === item.id ? `${item.color}20` : 'var(--vd-bg)',
                  color: active === item.id ? item.color : 'var(--vd-text-m)',
                  border: `1px solid ${active === item.id ? item.color : 'var(--vd-border)'}`,
                }}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8">
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {ActiveSection && <ActiveSection />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
