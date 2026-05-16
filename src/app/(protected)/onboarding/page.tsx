'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineFilm, HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineXMark, HiOutlineLightBulb, HiOutlineBookOpen, HiOutlineRocketLaunch } from 'react-icons/hi2';

const steps = [
  {
    title: 'What is a Screenplay?',
    icon: HiOutlineBookOpen,
    content: [
      { label: 'Scene Headings', desc: 'INT. COFFEE SHOP — NIGHT tells us we\'re inside, at a coffee shop, at night. INT = Interior, EXT = Exterior.' },
      { label: 'Action Lines', desc: 'Describe what the audience sees and hears. Written in present tense. "Rain hammers the window."' },
      { label: 'Character Names', desc: 'Centered and UPPERCASE when a character speaks. This tells us who is talking.' },
      { label: 'Dialogue', desc: 'The words characters speak, centered below their name. Parentheticals add tone: (whispering).' },
    ],
  },
  {
    title: 'How Directors Think',
    icon: HiOutlineLightBulb,
    content: [
      { label: 'Act 1 — Setup', desc: 'Introduce the world, the protagonist, and the central conflict. Hook the audience in the first 10 pages.' },
      { label: 'Act 2 — Confrontation', desc: 'Rising stakes, obstacles, and character growth. The longest act — the engine of your story.' },
      { label: 'Act 3 — Resolution', desc: 'The climax and aftermath. Every thread comes together. Leave the audience feeling something.' },
      { label: 'Emotional Pacing', desc: 'Alternate tension and release. Quiet moments make loud ones louder. Control the rhythm.' },
    ],
  },
  {
    title: 'Filmmaking Workflow',
    icon: HiOutlineFilm,
    steps: ['Idea', 'Story', 'Screenplay', 'Storyboard', 'Shoot', 'Edit'],
  },
  {
    title: 'Start Your First Project',
    icon: HiOutlineRocketLaunch,
    cta: true,
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  const completeOnboarding = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), { onboardingCompleted: true });
      } catch (e) { /* ignore if profile doesn't exist yet */ }
    }
    router.push('/dashboard');
  };

  const skip = () => completeOnboarding();
  const next = () => current < steps.length - 1 ? setCurrent(current + 1) : completeOnboarding();
  const prev = () => current > 0 && setCurrent(current - 1);

  const step = steps[current];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--vd-hero-gradient)' }}>
      <div className="w-full max-w-2xl">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <button onClick={skip} className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[var(--vd-accent-soft)] transition-colors" style={{ color: 'var(--vd-text-s)' }}>
            Skip <HiOutlineXMark className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500" style={{ background: i <= current ? 'var(--vd-accent)' : 'var(--vd-border)' }} />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} className="card-vd !p-8 md:!p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                <step.icon className="w-5 h-5" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--vd-text)' }}>{step.title}</h2>
            </div>

            {'content' in step && step.content && (
              <div className="space-y-4">
                {step.content.map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl" style={{ background: 'var(--vd-bg)' }}>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--vd-accent)' }}>{item.label}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {'steps' in step && step.steps && (
              <div className="flex flex-wrap items-center justify-center gap-3 py-8">
                {step.steps.map((s, i) => (
                  <motion.div key={s} className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
                    <div className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{s}</div>
                    {i < step.steps.length - 1 && <HiOutlineArrowRight className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />}
                  </motion.div>
                ))}
              </div>
            )}

            {'cta' in step && step.cta && (
              <div className="text-center py-8">
                <p className="mb-6 text-base" style={{ color: 'var(--vd-text-s)' }}>You&apos;re ready to create. Your cinematic workspace awaits.</p>
                <motion.button onClick={completeOnboarding} className="btn-primary text-base !px-8 !py-3.5 rounded-xl inline-flex items-center gap-2" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <HiOutlineRocketLaunch className="w-5 h-5" />
                  Create Your First Project
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button onClick={prev} disabled={current === 0} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all disabled:opacity-30 hover:bg-[var(--vd-accent-soft)]" style={{ color: 'var(--vd-text-s)' }}>
            <HiOutlineArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={next} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl btn-primary !py-2">
            {current === steps.length - 1 ? 'Finish' : 'Next'} <HiOutlineArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
