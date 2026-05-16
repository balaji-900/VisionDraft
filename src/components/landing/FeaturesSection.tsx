'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiOutlinePencilSquare, HiOutlineLightBulb, HiOutlineFilm, HiOutlineSparkles, HiOutlineFolderOpen, HiOutlineMicrophone } from 'react-icons/hi2';

const features = [
  { icon: HiOutlinePencilSquare, title: 'Screenplay Editor', description: 'Professional screenplay formatting with auto-complete for scene headings, dialogue blocks, and action lines.' },
  { icon: HiOutlineLightBulb, title: 'Idea Vault', description: 'Save random cinematic ideas — emotional scenes, twists, dialogue fragments — before they disappear.' },
  { icon: HiOutlineSparkles, title: 'AI Scene Expansion', description: 'Enter a brief concept and watch AI generate full cinematic scenes with atmosphere, dialogue, and pacing.' },
  { icon: HiOutlineFilm, title: 'Director Mode', description: 'Add camera notes, lighting cues, soundtrack ideas, and emotional direction to every scene.' },
  { icon: HiOutlineFolderOpen, title: 'Project Workspace', description: 'Organize stories with act structures, character designs, world-building, and scene breakdowns.' },
  { icon: HiOutlineMicrophone, title: 'Quick Capture', description: 'Floating capture button for instant text or voice notes. Never lose a fleeting idea again.' },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="py-24 md:py-32" style={{ background: 'var(--vd-bg-s)' }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block" style={{ color: 'var(--vd-accent)' }}>Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--vd-text)' }}>Everything a filmmaker needs</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--vd-text-s)' }}>From first idea to final draft — a complete cinematic toolkit built for the way directors think.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} className="card-vd group cursor-default" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--vd-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
