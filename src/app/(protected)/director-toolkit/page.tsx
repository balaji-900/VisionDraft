'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { toolkitCategories, ToolkitItem } from '@/lib/toolkitData';
import {
  HiOutlineCamera, HiOutlineFilm, HiOutlineLightBulb,
  HiOutlineDocumentText, HiOutlineSparkles, HiOutlineXMark,
  HiOutlineChevronRight, HiOutlineBookOpen, HiOutlineAcademicCap,
} from 'react-icons/hi2';

const categoryIcons: Record<string, React.ElementType> = {
  camera: HiOutlineCamera,
  mood: HiOutlineFilm,
  structure: HiOutlineLightBulb,
  format: HiOutlineDocumentText,
};

/* ── Detail Modal ─────────────────────────────────────── */
function DetailModal({ item, onClose }: { item: ToolkitItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border"
        style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 pt-6 pb-4 border-b" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 inline-block"
                style={{ background: `${item.color}20`, color: item.color }}>
                {item.tag}
              </span>
              <h2 className="text-xl font-bold" style={{ color: 'var(--vd-text)' }}>{item.title}</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--vd-text-m)' }}>{item.subtitle}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--vd-bg)] transition-colors shrink-0" style={{ color: 'var(--vd-text-m)' }}>
              <HiOutlineXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--vd-text-m)' }}>What It Is</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text)' }}>{item.description}</p>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>How to Use It</h3>
            <ul className="space-y-2">
              {item.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                    style={{ background: item.color }}>
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--vd-text)' }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          {item.examples.map((ex, i) => (
            <div key={i}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--vd-text-m)' }}>{ex.label}</h3>
              <div className="rounded-xl p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap border"
                style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
                {ex.text}
              </div>
            </div>
          ))}

          {/* Pro Tip */}
          {item.proTip && (
            <div className="rounded-xl p-4 border-l-4" style={{ background: `${item.color}10`, borderLeftColor: item.color }}>
              <div className="flex items-center gap-2 mb-1.5">
                <HiOutlineSparkles className="w-4 h-4" style={{ color: item.color }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>Director's Pro Tip</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text)' }}>{item.proTip}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Card ─────────────────────────────────────────────── */
function ToolkitCard({ item, index, onOpen }: { item: ToolkitItem; index: number; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      className="group cursor-pointer rounded-2xl border p-5 transition-all hover:-translate-y-1"
      style={{
        background: 'var(--vd-bg-s)',
        borderColor: 'var(--vd-border)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = item.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${item.color}20`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--vd-border)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
    >
      {/* Tag */}
      <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
        style={{ background: `${item.color}18`, color: item.color }}>
        {item.tag}
      </span>

      <h3 className="text-base font-bold mb-1 leading-snug" style={{ color: 'var(--vd-text)' }}>{item.title}</h3>
      <p className="text-xs mb-3" style={{ color: 'var(--vd-text-m)' }}>{item.subtitle}</p>

      <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: 'var(--vd-text-s)' }}>
        {item.description}
      </p>

      {/* Tips preview */}
      <div className="space-y-1.5 mb-4">
        {item.tips.slice(0, 3).map((tip, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
            <span className="text-xs leading-relaxed line-clamp-1" style={{ color: 'var(--vd-text-s)' }}>{tip}</span>
          </div>
        ))}
        {item.tips.length > 3 && (
          <p className="text-xs pl-3.5" style={{ color: item.color }}>+{item.tips.length - 3} more...</p>
        )}
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color: item.color }}>
        <HiOutlineBookOpen className="w-3.5 h-3.5" />
        <span>Read full lesson</span>
        <HiOutlineChevronRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function DirectorToolkitPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<ToolkitItem | null>(null);
  const [search, setSearch] = useState('');

  const totalItems = toolkitCategories.reduce((a, c) => a + c.items.length, 0);

  const filtered = toolkitCategories
    .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tag.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 flex flex-col">

        {/* Hero Header */}
        <div className="relative overflow-hidden border-b px-6 py-10 md:px-10 md:py-14 shrink-0"
          style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 40%)' }} />
          <div className="relative max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                <HiOutlineAcademicCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                Learning Hub
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: 'var(--vd-text)' }}>
              Director's Toolkit
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: 'var(--vd-text-m)' }}>
              Master cinematic storytelling — from camera angles and sound design to story structure and screenplay format. Every lesson is written by filmmakers, for filmmakers.
            </p>
            <div className="flex items-center gap-4 mt-5 flex-wrap">
              {toolkitCategories.map(cat => (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--vd-text-m)' }}>
                    {cat.items.length} {cat.label}
                  </span>
                </div>
              ))}
              <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                {totalItems} Lessons Total
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-0 z-20 border-b px-6 py-3 flex items-center gap-3 flex-wrap shrink-0"
          style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)', backdropFilter: 'blur(12px)' }}>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons..."
            className="flex-1 min-w-[160px] max-w-xs px-4 py-2 rounded-xl border text-sm outline-none transition-colors focus:border-[var(--vd-accent)]"
            style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
          />

          {/* Category pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: activeCategory === 'all' ? 'var(--vd-accent)' : 'var(--vd-bg)',
                color: activeCategory === 'all' ? 'white' : 'var(--vd-text-m)',
                border: `1px solid ${activeCategory === 'all' ? 'var(--vd-accent)' : 'var(--vd-border)'}`,
              }}
            >
              All ({totalItems})
            </button>
            {toolkitCategories.map(cat => {
              const Icon = categoryIcons[cat.id];
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? `${cat.color}15` : 'var(--vd-bg)',
                    color: isActive ? cat.color : 'var(--vd-text-m)',
                    border: `1px solid ${isActive ? cat.color : 'var(--vd-border)'}`,
                  }}
                >
                  <span>{cat.emoji}</span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-4xl mb-3">🎬</p>
                <p className="text-sm font-medium" style={{ color: 'var(--vd-text-m)' }}>No lessons match your search</p>
              </div>
            ) : (
              filtered.map(cat => (
                <div key={cat.id}>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}15` }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: 'var(--vd-text)' }}>{cat.label}</h2>
                      <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{cat.items.length} lessons</p>
                    </div>
                    <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${cat.color}40, transparent)` }} />
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cat.items.map((item, i) => (
                      <ToolkitCard
                        key={item.id}
                        item={item}
                        index={i}
                        onOpen={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
