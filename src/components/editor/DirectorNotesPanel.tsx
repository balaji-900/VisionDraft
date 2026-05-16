'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineCamera, HiOutlineClock, HiOutlineHeart, HiOutlineMusicalNote, HiOutlineSun } from 'react-icons/hi2';
import { DirectorNotes } from '@/types';

interface DirectorNotesPanelProps {
  notes: Partial<DirectorNotes>;
  onChange: (notes: Partial<DirectorNotes>) => void;
}

const noteFields = [
  { key: 'camera', label: 'Camera Notes', icon: HiOutlineCamera, placeholder: 'e.g. Slow dolly in. Hold on the eyes. Low angle...' },
  { key: 'pacing', label: 'Pacing Notes', icon: HiOutlineClock, placeholder: 'e.g. Let silence breathe. 3-beat pause between lines...' },
  { key: 'emotion', label: 'Emotional Direction', icon: HiOutlineHeart, placeholder: 'e.g. Controlled rage beneath the surface. Vulnerability hidden...' },
  { key: 'soundtrack', label: 'Soundtrack Ideas', icon: HiOutlineMusicalNote, placeholder: 'e.g. Sparse piano, no drums. Build with strings...' },
  { key: 'lighting', label: 'Lighting Notes', icon: HiOutlineSun, placeholder: 'e.g. Single overhead source. Hard shadows. Low-key...' },
];

export default function DirectorNotesPanel({ notes, onChange }: DirectorNotesPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
        style={{ color: 'var(--vd-text)' }}
      >
        <span className="flex items-center gap-2">
          <HiOutlineCamera className="w-4 h-4" style={{ color: 'var(--vd-accent)' }} />
          Director Notes
        </span>
        {open
          ? <HiOutlineChevronUp className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />
          : <HiOutlineChevronDown className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t p-4 space-y-4"
          style={{ borderColor: 'var(--vd-border)' }}
        >
          {noteFields.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium flex items-center gap-1.5 mb-1.5" style={{ color: 'var(--vd-text-s)' }}>
                <f.icon className="w-3.5 h-3.5" style={{ color: 'var(--vd-accent)' }} />
                {f.label}
              </label>
              <textarea
                value={notes[f.key as keyof DirectorNotes] ?? ''}
                onChange={(e) => onChange({ ...notes, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none resize-none focus:border-[var(--vd-accent)]"
                style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
