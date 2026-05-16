'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineDocumentArrowDown, HiOutlineXMark,
  HiOutlinePencilSquare, HiOutlineCamera,
  HiOutlineClock, HiOutlineCheck,
} from 'react-icons/hi2';
import { generateScreenplayPdf, ExportData, ExportOptions } from '@/lib/exportPdf';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  data: ExportData;
}

export default function ExportPdfModal({ open, onClose, data }: Props) {
  const [options, setOptions] = useState<ExportOptions>({
    includeDirectorNotes: true,
    includeShotPlanning: true,
    includeTimeline: true,
  });
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState({ step: '', pct: 0 });

  const toggle = (key: keyof ExportOptions) =>
    setOptions(o => ({ ...o, [key]: !o[key] }));

  const handleExport = async () => {
    setExporting(true);
    setProgress({ step: 'Starting…', pct: 0 });

    try {
      await generateScreenplayPdf(data, options, (step, pct) => {
        setProgress({ step, pct });
      });
      toast.success(`"${data.title}" exported as PDF`);
      onClose();
    } catch (e) {
      console.error(e);
      toast.error('Export failed. Please try again.');
    }
    setExporting(false);
  };

  const toggleItems = [
    { key: 'includeDirectorNotes' as const, label: 'Director Notes', desc: 'Camera, pacing, emotion, sound, lighting', icon: HiOutlinePencilSquare, color: '#6366f1' },
    { key: 'includeShotPlanning' as const, label: 'Shot Planning', desc: 'Shot types, angles, movements per scene', icon: HiOutlineCamera, color: '#ec4899' },
    { key: 'includeTimeline' as const, label: 'Timeline', desc: 'Story progression milestones', icon: HiOutlineClock, color: '#f59e0b' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #6366f1, transparent 60%)' }}
                />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                      <HiOutlineDocumentArrowDown className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold" style={{ color: 'var(--vd-text)' }}>Export Screenplay</h2>
                      <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{data.title} • PDF</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg transition-colors hover:bg-[var(--vd-bg)]"
                    style={{ color: 'var(--vd-text-m)' }}
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content included */}
              <div className="px-6 pb-2">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>
                  Always included
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {['Cover Page', 'Synopsis', 'Act Structure', 'Full Screenplay'].map(item => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                      style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}
                    >
                      <HiOutlineCheck className="w-3 h-3" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggle options */}
              <div className="px-6 pb-4">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>
                  Optional sections
                </p>
                <div className="space-y-2">
                  {toggleItems.map(item => (
                    <button
                      key={item.key}
                      onClick={() => toggle(item.key)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm"
                      style={{
                        borderColor: options[item.key] ? `${item.color}50` : 'var(--vd-border)',
                        background: options[item.key] ? `${item.color}08` : 'var(--vd-bg)',
                      }}
                    >
                      <item.icon className="w-4 h-4 shrink-0" style={{ color: item.color }} />
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>{item.label}</p>
                        <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{item.desc}</p>
                      </div>
                      {/* Toggle switch */}
                      <div
                        className="w-9 h-5 rounded-full relative transition-colors shrink-0"
                        style={{ background: options[item.key] ? item.color : 'var(--vd-border)' }}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                          style={{ left: options[item.key] ? '18px' : '2px' }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export button / progress */}
              <div className="px-6 pb-6 pt-2">
                {exporting ? (
                  <div className="space-y-2">
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--vd-border)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress.pct}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-center" style={{ color: 'var(--vd-text-m)' }}>
                      {progress.step}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                  >
                    <HiOutlineDocumentArrowDown className="w-4.5 h-4.5" />
                    Export as PDF
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
