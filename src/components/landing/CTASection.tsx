'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export default function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: 'var(--vd-bg)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, var(--vd-accent) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--vd-text)' }}>
            Your cinematic second brain<br /><span style={{ color: 'var(--vd-accent)' }}>awaits.</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--vd-text-s)' }}>
            Start capturing stories, writing screenplays, and building worlds — all in one beautiful workspace.
          </p>
          <Link href="/signup">
            <motion.button className="btn-primary text-lg !px-10 !py-4 rounded-xl inline-flex items-center gap-3" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              Start Creating — Free
              <HiOutlineArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
