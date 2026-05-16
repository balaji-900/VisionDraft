'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineVideoCamera, HiOutlineChatBubbleLeftRight, HiOutlinePuzzlePiece, HiOutlineAdjustmentsHorizontal, HiOutlineFilm } from 'react-icons/hi2';

const modes = [
  { id: 'expand', label: 'Scene Expansion', icon: HiOutlineSparkles, placeholder: 'Describe a scene briefly... e.g. "Hero enters abandoned factory at night"' },
  { id: 'dialogue', label: 'Dialogue Assistant', icon: HiOutlineChatBubbleLeftRight, placeholder: 'Paste dialogue to enhance, or describe the conversation...' },
  { id: 'director', label: 'Director Suggestions', icon: HiOutlineVideoCamera, placeholder: 'Describe your scene for camera, lighting, and pacing suggestions...' },
  { id: 'connector', label: 'Idea Connector', icon: HiOutlinePuzzlePiece, placeholder: 'Paste your idea fragments and I\'ll find story connections...' },
  { id: 'structure', label: 'Story Structure', icon: HiOutlineAdjustmentsHorizontal, placeholder: 'Describe your story concept for act structure guidance...' },
];

const styles = ['Emotional', 'Suspense', 'Psychological', 'Grounded Realism', 'Commercial Action', 'Slow-Burn Thriller'];

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState('expand');
  const [style, setStyle] = useState('Emotional');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string }[]>([]);

  const generate = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: activeMode, style, input: input.trim(), userId: user?.uid }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.output);
      setHistory(prev => [{ input: input.trim(), output: data.output }, ...prev.slice(0, 9)]);
    } catch (err: any) {
      toast.error(err.message || 'AI generation failed');
      setOutput('AI generation failed. Please check your Gemini API key in .env.local');
    }
    setLoading(false);
  };

  const mode = modes.find(m => m.id === activeMode)!;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 flex flex-col h-screen">
        {/* Header */}
        <div className="border-b px-6 py-4" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
          <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
            <HiOutlineSparkles className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} /> AI Creative Assistant
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--vd-text-s)' }}>Powered by Google Gemini</p>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Modes Panel */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r p-4 overflow-x-auto lg:overflow-y-auto flex lg:flex-col gap-2" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2 hidden lg:block" style={{ color: 'var(--vd-text-m)' }}>AI Modes</div>
            {modes.map(m => (
              <button key={m.id} onClick={() => setActiveMode(m.id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeMode === m.id ? 'glass-strong' : 'hover:bg-[var(--vd-accent-soft)]'}`} style={{ color: activeMode === m.id ? 'var(--vd-accent)' : 'var(--vd-text-s)' }}>
                <m.icon className="w-4 h-4 shrink-0" /> {m.label}
              </button>
            ))}
            <div className="hidden lg:block mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--vd-text-m)' }}>Style</div>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm border outline-none" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
                {styles.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Output */}
            <div className="flex-1 overflow-y-auto p-6">
              {output ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
                  <div className="card-vd !p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <HiOutlineSparkles className="w-4 h-4" style={{ color: 'var(--vd-accent)' }} />
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--vd-accent)' }}>AI Output — {mode.label}</span>
                    </div>
                    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--vd-text)' }}>{output}</div>
                  </div>
                </motion.div>
              ) : loading ? (
                <div className="max-w-3xl mx-auto">
                  <div className="card-vd !p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} />
                      <span className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Generating cinematic magic...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto text-center py-20">
                  <HiOutlineFilm className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: 'var(--vd-text-m)' }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--vd-text)' }}>{mode.label}</h3>
                  <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Enter your prompt below and let AI expand your creative vision.</p>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-4" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
              <div className="max-w-3xl mx-auto flex gap-3">
                <textarea
                  value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); generate(); } }}
                  placeholder={mode.placeholder} rows={2}
                  className="flex-1 px-4 py-3 rounded-xl text-sm border outline-none resize-none focus:border-[var(--vd-accent)]"
                  style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                />
                <button onClick={generate} disabled={loading || !input.trim()} className="btn-primary self-end !px-4 !py-3 rounded-xl disabled:opacity-50">
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
