'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scene, SceneType } from '@/types';
import { HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi2';

interface SceneBuilderProps {
  scene: Partial<Scene>;
  onChange: (updates: Partial<Scene>) => void;
}

const sceneTypes: SceneType[] = [
  'Intro Scene', 'Emotional Scene', 'Fight Scene',
  'Horror Scene', 'Romance Scene', 'Flashback', 'Climax',
];

const moods = ['Tense', 'Romantic', 'Melancholic', 'Hopeful', 'Terrifying', 'Euphoric', 'Mysterious', 'Intense'];

export default function SceneBuilder({ scene, onChange }: SceneBuilderProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border overflow-hidden mb-4" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
        style={{ color: 'var(--vd-text)' }}
      >
        <span>Scene Properties</span>
        {open ? <HiOutlineChevronUp className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />
               : <HiOutlineChevronDown className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t overflow-hidden"
            style={{ borderColor: 'var(--vd-border)' }}
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {/* Scene Number */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>Scene #</label>
                <input
                  type="number"
                  value={scene.sceneNumber ?? ''}
                  onChange={(e) => onChange({ sceneNumber: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                />
              </div>

              {/* INT / EXT */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>INT / EXT</label>
                <select
                  value={scene.intExt ?? 'INT'}
                  onChange={(e) => onChange({ intExt: e.target.value as Scene['intExt'] })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                >
                  <option value="INT">INT</option>
                  <option value="EXT">EXT</option>
                  <option value="INT/EXT">INT/EXT</option>
                </select>
              </div>

              {/* Day / Night */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>Time</label>
                <select
                  value={scene.dayNight ?? 'DAY'}
                  onChange={(e) => onChange({ dayNight: e.target.value as Scene['dayNight'] })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                >
                  <option value="DAY">DAY</option>
                  <option value="NIGHT">NIGHT</option>
                  <option value="DAWN">DAWN</option>
                  <option value="DUSK">DUSK</option>
                </select>
              </div>

              {/* Scene Type */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>Scene Type</label>
                <select
                  value={scene.type ?? 'Intro Scene'}
                  onChange={(e) => onChange({ type: e.target.value as SceneType })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                >
                  {sceneTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Mood */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>Mood</label>
                <select
                  value={scene.mood ?? ''}
                  onChange={(e) => onChange({ mood: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                >
                  <option value="">Select mood</option>
                  {moods.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--vd-text-s)' }}>Location</label>
                <input
                  type="text"
                  value={scene.location ?? ''}
                  onChange={(e) => onChange({ location: e.target.value })}
                  placeholder="e.g. Old Warehouse"
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
