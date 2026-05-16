'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiOutlineLightBulb, HiOutlineBookOpen, HiOutlinePencilSquare, HiOutlineCamera, HiOutlineFilm, HiOutlineScissors } from 'react-icons/hi2';

const steps = [
  { icon: HiOutlineLightBulb, label: 'Idea', color: '#F59E0B' },
  { icon: HiOutlineBookOpen, label: 'Story', color: '#8B5CF6' },
  { icon: HiOutlinePencilSquare, label: 'Screenplay', color: '#3B82F6' },
  { icon: HiOutlineCamera, label: 'Storyboard', color: '#10B981' },
  { icon: HiOutlineFilm, label: 'Shoot', color: '#EF4444' },
  { icon: HiOutlineScissors, label: 'Edit', color: '#EC4899' },
];

export default function WorkflowSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="workflow" className="py-24 md:py-32" style={{ background: 'var(--vd-bg-s)' }}>
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 block" style={{ color: 'var(--vd-accent)' }}>Workflow</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ color: 'var(--vd-text)' }}>From spark to screen</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--vd-text-s)' }}>Follow the filmmaker&apos;s journey — VisionDraft supports every stage of creation.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, i) => (
            <motion.div key={step.label} className="flex items-center" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.12 }}>
              <div className="flex flex-col items-center group">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}
                  whileHover={{ y: -4 }}
                >
                  <step.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: step.color }} />
                </motion.div>
                <span className="text-sm font-medium" style={{ color: 'var(--vd-text)' }}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block w-12 lg:w-20 h-[2px] mx-2" style={{ background: `linear-gradient(90deg, ${step.color}40, ${steps[i + 1].color}40)` }} />
              )}
              {i < steps.length - 1 && (
                <div className="md:hidden w-[2px] h-8 my-1" style={{ background: `linear-gradient(180deg, ${step.color}40, ${steps[i + 1].color}40)` }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
