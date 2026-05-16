'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCamera, HiOutlinePlus, HiOutlineTrash,
  HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineCheck,
  HiOutlineXMark,
} from 'react-icons/hi2';

/* ── Types ─────────────────────────────────────────── */
export interface ShotEntry {
  id: string;
  shotType: string;
  angle: string;
  movement: string;
  lens: string;
  mood: string;
  sceneRef: string;
  description: string;
}

/* ── Constants ─────────────────────────────────────── */
const SHOT_TYPES = ['Establishing','Wide','Medium','Close-Up','Extreme Close-Up','Over-the-Shoulder','POV','Two-Shot','Insert'];
const ANGLES     = ['Eye Level','High Angle','Low Angle','Dutch Angle','Bird\'s Eye','Worm\'s Eye'];
const MOVEMENTS  = ['Static','Pan','Tilt','Dolly In','Dolly Out','Tracking','Handheld','Crane','Steadicam'];
const MOODS      = ['Tense','Melancholic','Euphoric','Mysterious','Terrifying','Romantic','Intense','Hopeful'];

const SHOT_COLORS: Record<string, string> = {
  'Establishing': '#6366f1', 'Wide': '#3b82f6', 'Medium': '#10b981',
  'Close-Up': '#f59e0b', 'Extreme Close-Up': '#ef4444', 'Over-the-Shoulder': '#8b5cf6',
  'POV': '#ec4899', 'Two-Shot': '#06b6d4', 'Insert': '#78716c',
};

const empty: Omit<ShotEntry, 'id'> = {
  shotType: 'Wide', angle: 'Eye Level', movement: 'Static',
  lens: '', mood: '', sceneRef: '', description: '',
};

const uid = () => Math.random().toString(36).slice(2, 9);

/* ── Shot Form ──────────────────────────────────────── */
function ShotForm({
  initial, onSave, onCancel,
}: { initial?: ShotEntry; onSave: (s: ShotEntry) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Omit<ShotEntry, 'id'>>(
    initial ? { ...initial } : { ...empty }
  );
  const f = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const fieldCls = 'w-full px-3 py-2 rounded-lg border text-xs outline-none focus:border-[var(--vd-accent)] transition-colors';
  const fieldSty = { background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="p-4 rounded-xl border mt-3" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-accent)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-accent)' }}>
          {initial ? 'Edit Shot' : 'New Shot'}
        </p>

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Shot Type</label>
            <select className={fieldCls} style={fieldSty} value={form.shotType} onChange={e => f('shotType', e.target.value)}>
              {SHOT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Angle</label>
            <select className={fieldCls} style={fieldSty} value={form.angle} onChange={e => f('angle', e.target.value)}>
              {ANGLES.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Movement</label>
            <select className={fieldCls} style={fieldSty} value={form.movement} onChange={e => f('movement', e.target.value)}>
              {MOVEMENTS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Mood</label>
            <select className={fieldCls} style={fieldSty} value={form.mood} onChange={e => f('mood', e.target.value)}>
              <option value="">Select…</option>
              {MOODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Lens</label>
            <input className={fieldCls} style={fieldSty} value={form.lens} onChange={e => f('lens', e.target.value)} placeholder="35mm, 85mm…" />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Scene Ref</label>
            <input className={fieldCls} style={fieldSty} value={form.sceneRef} onChange={e => f('sceneRef', e.target.value)} placeholder="Scene 3 / Act 2…" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-xs mb-1 block" style={{ color: 'var(--vd-text-m)' }}>Shot Description</label>
          <textarea
            rows={2}
            className={`${fieldCls} resize-none`}
            style={fieldSty}
            value={form.description}
            onChange={e => f('description', e.target.value)}
            placeholder="What does this shot capture — action, composition, emotion…"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--vd-bg)] transition-colors" style={{ color: 'var(--vd-text-m)' }}>
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.description.trim()) return;
              onSave({ id: initial?.id ?? uid(), ...form });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--vd-accent)' }}
          >
            <HiOutlineCheck className="w-3.5 h-3.5" />
            {initial ? 'Save' : 'Add Shot'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Shot Card ──────────────────────────────────────── */
function ShotCard({
  shot, index, onDelete, onEdit,
}: { shot: ShotEntry; index: number; onDelete: () => void; onEdit: () => void }) {
  const color = SHOT_COLORS[shot.shotType] ?? '#6366f1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-xl border p-3 transition-all hover:shadow-md"
      style={{
        background: 'var(--vd-bg)',
        borderColor: 'var(--vd-border)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {/* Shot number */}
        <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-black text-white shrink-0"
          style={{ background: color }}>
          {index + 1}
        </span>

        {/* Shot type badge */}
        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${color}18`, color }}>
          {shot.shotType}
        </span>

        {/* Tags */}
        {[shot.angle, shot.movement].map(tag => tag && (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--vd-bg-s)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>
            {tag}
          </span>
        ))}
        {shot.lens && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--vd-bg-s)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>
            🎞 {shot.lens}
          </span>
        )}
        {shot.mood && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--vd-bg-s)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>
            🎭 {shot.mood}
          </span>
        )}
        {shot.sceneRef && (
          <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
            style={{ color: 'var(--vd-text-s)' }}>
            ↗ {shot.sceneRef}
          </span>
        )}
      </div>

      {/* Description */}
      {shot.description && (
        <p className="text-xs leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>
          {shot.description}
        </p>
      )}

      {/* Hover actions */}
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit}
          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--vd-accent-soft)]"
          style={{ color: 'var(--vd-accent)' }}>
          <HiOutlineCamera className="w-3.5 h-3.5" />
        </button>
        <button onClick={onDelete}
          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-red-400">
          <HiOutlineTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── Scene Shot Planner (main export) ───────────────── */
interface Props {
  sceneId: string;
  sceneNumber: number;
  initialShots?: ShotEntry[];
  onShotsChange?: (shots: ShotEntry[]) => void;
}

export default function SceneShotPlanner({ sceneId, sceneNumber, initialShots = [], onShotsChange }: Props) {
  const [open, setOpen] = useState(false);
  const [shots, setShots] = useState<ShotEntry[]>(initialShots);
  const [showForm, setShowForm] = useState(false);
  const [editingShot, setEditingShot] = useState<ShotEntry | null>(null);

  // Sync shots when the active scene changes
  useEffect(() => {
    setShots(initialShots);
    setShowForm(false);
    setEditingShot(null);
  }, [sceneId]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (next: ShotEntry[]) => {
    setShots(next);
    onShotsChange?.(next);
  };

  const addShot = (s: ShotEntry) => {
    update([...shots, s]);
    setShowForm(false);
  };

  const editShot = (s: ShotEntry) => {
    update(shots.map(x => x.id === s.id ? s : x));
    setEditingShot(null);
  };

  const deleteShot = (id: string) => {
    update(shots.filter(s => s.id !== id));
  };

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors hover:bg-[var(--vd-accent-soft)]"
      >
        <div className="flex items-center gap-2.5">
          <HiOutlineCamera className="w-4 h-4" style={{ color: 'var(--vd-accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>Shot Planning</span>
          {shots.length > 0 && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}
            >
              {shots.length} {shots.length === 1 ? 'shot' : 'shots'}
            </span>
          )}
        </div>
        {open
          ? <HiOutlineChevronUp className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />
          : <HiOutlineChevronDown className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />
        }
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="shot-planner-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t"
            style={{ borderColor: 'var(--vd-border)' }}
          >
            <div className="p-4 space-y-3">
              {/* Shot cards */}
              <AnimatePresence>
                {shots.map((shot, i) =>
                  editingShot?.id === shot.id ? (
                    <ShotForm
                      key={shot.id}
                      initial={editingShot}
                      onSave={s => { editShot(s); }}
                      onCancel={() => setEditingShot(null)}
                    />
                  ) : (
                    <ShotCard
                      key={shot.id}
                      shot={shot}
                      index={i}
                      onDelete={() => deleteShot(shot.id)}
                      onEdit={() => { setEditingShot(shot); setShowForm(false); }}
                    />
                  )
                )}
              </AnimatePresence>

              {/* Empty state */}
              {shots.length === 0 && !showForm && (
                <div className="text-center py-5 rounded-xl border border-dashed" style={{ borderColor: 'var(--vd-border)' }}>
                  <HiOutlineCamera className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--vd-text-m)' }} />
                  <p className="text-xs font-medium" style={{ color: 'var(--vd-text-s)' }}>
                    No shots planned for Scene {sceneNumber} yet
                  </p>
                </div>
              )}

              {/* Add shot form */}
              <AnimatePresence>
                {showForm && (
                  <ShotForm
                    key="new-shot-form"
                    onSave={addShot}
                    onCancel={() => setShowForm(false)}
                  />
                )}
              </AnimatePresence>

              {/* Add shot button */}
              {!showForm && !editingShot && (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-xs font-semibold transition-all hover:border-[var(--vd-accent)] hover:bg-[var(--vd-accent-soft)] hover:text-[var(--vd-accent)]"
                  style={{ borderColor: 'var(--vd-border)', color: 'var(--vd-text-m)' }}
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  Add Shot
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
