'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiOutlineSparkles, HiOutlineChatBubbleLeftRight, HiOutlineVideoCamera, HiOutlinePuzzlePiece, HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const aiFeatures = [
  { id: 'expand', icon: HiOutlineSparkles, title: 'Scene Expansion', desc: 'Turn a one-line concept into a full cinematic scene.', demo: { input: '"Hero enters abandoned factory."', output: 'INT. ABANDONED FACTORY — NIGHT\n\nDust particles float through shafts of moonlight. The HERO (30s, weathered coat) steps through the rusted doorway. Each footstep echoes.\n\nThe camera DOLLIES IN slowly as the Hero scans the darkness. A distant CLANG reverberates through the cavernous space.\n\nHERO\n(whispered)\nI know you\'re here.' } },
  { id: 'dialogue', icon: HiOutlineChatBubbleLeftRight, title: 'Dialogue Assistant', desc: 'Enhance conversations with emotional depth and realism.', demo: { input: '"Make this more tense:\nA: Where were you?\nB: Out."', output: 'A\n(controlled, barely holding back)\nWhere were you?\n\nA beat. B doesn\'t look up.\n\nB\n(too casual)\nOut.\n\nA steps closer. The silence is deafening.\n\nA\nDon\'t do that. Don\'t make me ask twice.' } },
  { id: 'director', icon: HiOutlineVideoCamera, title: 'Director Suggestions', desc: 'Get AI-powered camera, lighting, and pacing recommendations.', demo: { input: '"Suggest shots for a confrontation scene"', output: '📷 Open with wide establishing shot — show distance between characters\n\n🎬 Cut to OTS (over-the-shoulder) as tension builds\n\n💡 Lighting: low-key, single source from above\n\n🎵 Score: sparse piano, building strings\n\n⏱️ Pacing: let silences breathe — 3-beat pauses between lines' } },
  { id: 'connect', icon: HiOutlinePuzzlePiece, title: 'Idea Connector', desc: 'AI analyzes your saved ideas and finds hidden story connections.', demo: { input: '"Analyze my idea vault fragments"', output: '🔍 Pattern detected across 4 fragments:\n\n→ "Rooftop confession" + "Rain motif" + "Broken watch" + "Old photograph"\n\nSuggestion: These fragments share themes of time, regret, and unspoken love. They could form the emotional backbone of a slow-burn romantic drama.' } },
  { id: 'structure', icon: HiOutlineAdjustmentsHorizontal, title: 'Story Structure', desc: 'Build and refine your three-act structure with AI guidance.', demo: { input: '"Help structure my thriller about a missing witness"', output: 'ACT 1 — Setup (pg 1-25)\n• Introduce detective protagonist\n• Establish the case and missing witness\n• Inciting incident: witness\'s apartment found ransacked\n\nACT 2 — Confrontation (pg 25-75)\n• Rising stakes as more witnesses disappear\n• Midpoint twist: the detective knows the witness\n\nACT 3 — Resolution (pg 75-100)\n• Final confrontation\n• Theme: truth has a cost' } },
];

export default function AIShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState(0);

  return (
    <section id="ai" className="py-24 md:py-32" style={{ background: 'var(--vd-bg)' }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block" style={{ color: 'var(--vd-accent)' }}>AI-Powered</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--vd-text)' }}>Your AI creative partner</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--vd-text-s)' }}>Powered by Google Gemini — expand scenes, refine dialogue, and structure stories with intelligent assistance.</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-6" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* Tab buttons */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {aiFeatures.map((f, i) => (
              <button key={f.id} onClick={() => setActive(i)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all whitespace-nowrap ${active === i ? 'glass-strong' : 'hover:bg-[var(--vd-accent-soft)]'}`} style={active === i ? { borderColor: 'var(--vd-accent)', color: 'var(--vd-accent)' } : { color: 'var(--vd-text-s)' }}>
                <f.icon className="w-5 h-5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium" style={{ color: active === i ? 'var(--vd-text)' : undefined }}>{f.title}</div>
                  <div className="text-xs hidden lg:block truncate">{f.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Demo area */}
          <div className="lg:col-span-8 card-vd !p-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="p-6 flex flex-col" style={{ borderRight: '1px solid var(--vd-border)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--vd-accent)' }}>Input</span>
                <div className="flex-1 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text-s)' }}>
                  {aiFeatures[active].demo.input}
                </div>
              </div>
              <div className="p-6 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--vd-accent)' }}>AI Output</span>
                <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="flex-1 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap leading-relaxed" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text)' }}>
                  {aiFeatures[active].demo.output}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
