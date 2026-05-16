'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HiOutlinePlay, HiOutlineSparkles } from 'react-icons/hi2';

const taglines = [
  'Capture stories before they disappear.',
  'Where scenes become cinema.',
  'Your cinematic second brain.',
];

export default function HeroSection() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden film-grain">
      {/* Gradient Background */}
      <div className="absolute inset-0" style={{ background: 'var(--vd-hero-gradient)' }} />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--vd-accent) 0%, transparent 70%)', top: '10%', right: '-10%' }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--vd-accent) 0%, transparent 70%)', bottom: '10%', left: '-5%' }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating screenplay elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[15%] left-[8%] card-vd p-4 max-w-[220px] opacity-60"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--vd-accent)' }}>INT. COFFEE SHOP — NIGHT</p>
          <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>The rain beats against the window. A single lamp flickers.</p>
        </motion.div>

        <motion.div
          className="absolute top-[25%] right-[6%] card-vd p-4 max-w-[200px] opacity-50 hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--vd-accent)' }}>CHARACTER</p>
          <p className="text-xs text-center" style={{ color: 'var(--vd-text-s)' }}>Sometimes the silence says more than words ever could.</p>
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] right-[12%] card-vd p-4 max-w-[180px] opacity-40 hidden md:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        >
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--vd-text-m)' }}>🎬 Director Note</p>
          <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>Slow dolly in. Hold on the eyes.</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <HiOutlineSparkles className="w-3.5 h-3.5" />
            AI-Powered Cinematic Workspace
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]" style={{ color: 'var(--vd-text)' }}>
            Vision<span style={{ color: 'var(--vd-accent)' }}>Draft</span>
          </h1>

          {/* Rotating Taglines */}
          <div className="h-10 md:h-12 flex items-center justify-center mb-8 overflow-hidden">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-2xl font-light"
              style={{ color: 'var(--vd-text-s)' }}
            >
              {taglines[taglineIndex]}
            </motion.p>
          </div>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base md:text-lg mb-10 leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>
            The professional cinematic workspace for directors and storytellers.
            Write screenplays, capture ideas, and let AI amplify your creative vision.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.button
                className="btn-primary text-base !px-8 !py-3.5 flex items-center gap-2.5 rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <HiOutlinePlay className="w-5 h-5" />
                Start Creating — Free
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                className="btn-secondary text-base !px-8 !py-3.5 rounded-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Features
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: 'var(--vd-border)' }}>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--vd-accent)' }}
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
