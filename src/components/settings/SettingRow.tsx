'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/* ── Section Card ─────────────────────────────────── */
export function SectionCard({ title, subtitle, icon: Icon, children, accent = '#6366f1' }: {
  title: string; subtitle?: string; icon: React.ElementType;
  children: ReactNode; accent?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border overflow-hidden mb-5"
      style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}18` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--vd-text)' }}>{title}</p>
          {subtitle && <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{subtitle}</p>}
        </div>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--vd-border)' }}>{children}</div>
    </motion.div>
  );
}

/* ── Setting Row ──────────────────────────────────── */
export function SettingRow({ label, description, children }: {
  label: string; description?: string; children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 group hover:bg-[var(--vd-accent-soft)] transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--vd-text)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--vd-text-s)' }}>{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ── Toggle ───────────────────────────────────────── */
export function Toggle({ checked, onChange, accent = '#6366f1' }: {
  checked: boolean; onChange: (v: boolean) => void; accent?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{ background: checked ? accent : 'var(--vd-border)', focusRingColor: accent } as React.CSSProperties}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );
}

/* ── Slider Row ───────────────────────────────────── */
export function SliderRow({ label, description, min, max, value, onChange, unit, accent = '#6366f1' }: {
  label: string; description?: string; min: number; max: number;
  value: number; onChange: (v: number) => void; unit?: string; accent?: string;
}) {
  return (
    <div className="px-6 py-4 hover:bg-[var(--vd-accent-soft)] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--vd-text)' }}>{label}</p>
          {description && <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>{description}</p>}
        </div>
        <span className="text-sm font-bold px-2.5 py-0.5 rounded-lg" style={{ background: `${accent}18`, color: accent }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: accent }}
      />
    </div>
  );
}

/* ── Select Row ───────────────────────────────────── */
export function SelectRow({ label, description, value, onChange, options }: {
  label: string; description?: string; value: string;
  onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[var(--vd-accent-soft)] transition-colors">
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--vd-text)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--vd-text-s)' }}>{description}</p>}
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="text-sm px-3 py-1.5 rounded-lg border outline-none cursor-pointer"
        style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/* ── Pill Multi-Select ────────────────────────────── */
export function PillSelect({ label, description, options, selected, onChange, accent = '#6366f1' }: {
  label: string; description?: string; options: string[];
  selected: string[]; onChange: (v: string[]) => void; accent?: string;
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);

  return (
    <div className="px-6 py-4 hover:bg-[var(--vd-accent-soft)] transition-colors">
      <p className="text-sm font-medium mb-1" style={{ color: 'var(--vd-text)' }}>{label}</p>
      {description && <p className="text-xs mb-3" style={{ color: 'var(--vd-text-s)' }}>{description}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map(opt => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: on ? accent : 'var(--vd-bg)',
                color: on ? '#fff' : 'var(--vd-text-m)',
                border: `1px solid ${on ? accent : 'var(--vd-border)'}`,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Danger Row ───────────────────────────────────── */
export function DangerRow({ label, description, buttonLabel, onClick }: {
  label: string; description?: string; buttonLabel: string; onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--vd-text)' }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: 'var(--vd-text-s)' }}>{description}</p>}
      </div>
      <button
        onClick={onClick}
        className="text-xs px-4 py-2 rounded-xl font-semibold transition-all hover:bg-red-500/20 border border-red-500/30 text-red-400 shrink-0"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
