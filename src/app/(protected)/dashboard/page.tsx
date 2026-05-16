'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Idea } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import {
  HiOutlinePlus, HiOutlineLightBulb, HiOutlinePencilSquare,
  HiOutlineFolderOpen, HiOutlineAcademicCap, HiOutlineArrowRight,
  HiOutlineFilm, HiOutlineUserGroup, HiOutlineCamera,
} from 'react-icons/hi2';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoProjectId, setDemoProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const pq = query(collection(db, 'projects'), where('userId', '==', user.uid));
        const ps = await getDocs(pq);
        const projectDocs = ps.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        projectDocs.sort((a, b) => ((b as any).updatedAt?.seconds ?? 0) - ((a as any).updatedAt?.seconds ?? 0));
        setProjects(projectDocs.slice(0, 4));

        // Find the demo project by isDemo flag (reliable across renames)
        const demo = projectDocs.find(p => (p as any).isDemo === true);
        if (demo) setDemoProjectId(demo.id);

        const iq = query(collection(db, 'ideaVault'), where('userId', '==', user.uid));
        const is_ = await getDocs(iq);
        const ideaDocs = is_.docs.map(d => ({ id: d.id, ...d.data() } as Idea));
        ideaDocs.sort((a, b) => ((b as any).createdAt?.seconds ?? 0) - ((a as any).createdAt?.seconds ?? 0));
        setIdeas(ideaDocs.slice(0, 4));
      } catch (e) { console.error('Dashboard fetch error:', e); }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const SkeletonCard = () => (
    <div className="card-vd animate-shimmer h-28 rounded-xl" />
  );

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 pt-16 lg:pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--vd-text)' }}>
            Welcome back, {user?.displayName?.split(' ')[0] || 'Filmmaker'} 🎬
          </h1>
          <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Your cinematic workspace is ready.</p>
        </motion.div>

        {/* ── Director Toolkit Banner ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-10"
        >
          <Link href="/director-toolkit" className="block group">
            <div
              className="relative overflow-hidden rounded-2xl border p-6 md:p-8 transition-all hover:shadow-xl hover:shadow-[var(--vd-accent)]/5 hover:-translate-y-0.5"
              style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}
            >
              {/* Ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, #6366f1 0%, transparent 55%), radial-gradient(circle at 85% 30%, #ec4899 0%, transparent 45%)' }}
              />

              <div className="relative flex items-center gap-5 flex-wrap">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
                >
                  <HiOutlineAcademicCap className="w-7 h-7 text-white" />
                </div>

                {/* Copy */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--vd-accent)' }}>
                    Learning Hub
                  </p>
                  <h2 className="text-base md:text-lg font-bold mb-1" style={{ color: 'var(--vd-text)' }}>
                    Want to learn directing?
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text-m)' }}>
                    Explore the Director Toolkit for screenplay structure, camera shots, cinematic sound design, and storytelling techniques used by professional filmmakers.
                  </p>
                </div>

                {/* CTA */}
                <div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all group-hover:gap-3 group-hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Open Director Toolkit
                  <HiOutlineArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ── Hollow Men Reference Card ───────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineFilm className="w-5 h-5" style={{ color: '#ef4444' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--vd-text)' }}>Reference Project</h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#ef444420', color: '#ef4444' }}>Demo</span>
          </div>

          <Link href={demoProjectId ? `/projects/${demoProjectId}` : '/projects'} className="block group">
            <div
              className="relative overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                borderColor: 'var(--vd-border)',
                background: 'var(--vd-bg-s)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef444450'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--vd-border)'; }}
            >
              {/* Cinematic gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: 'radial-gradient(ellipse at 0% 100%, #ef4444 0%, transparent 60%), radial-gradient(ellipse at 100% 0%, #6366f1 0%, transparent 55%)' }}
              />

              <div className="relative p-5 md:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: '#ef444418', color: '#ef4444' }}>Psychological Thriller</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>in-progress</span>
                    </div>
                    <h3 className="text-xl font-black mb-1" style={{ color: 'var(--vd-text)' }}>Seven</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text-m)' }}>
                      A sleep-deprived office worker discovers an underground fight club where broken people release their emotional pain through violence — until he realizes the charismatic leader may be another side of himself.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shrink-0 group-hover:gap-2.5 transition-all" style={{ background: 'linear-gradient(135deg, #ef4444, #6366f1)' }}>
                    Open <HiOutlineArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <HiOutlineFilm className="w-4 h-4" style={{ color: 'var(--vd-text-s)' }} />
                    <span className="text-xs" style={{ color: 'var(--vd-text-s)' }}>3 Screenplay Scenes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineUserGroup className="w-4 h-4" style={{ color: 'var(--vd-text-s)' }} />
                    <span className="text-xs" style={{ color: 'var(--vd-text-s)' }}>3 Characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineCamera className="w-4 h-4" style={{ color: 'var(--vd-text-s)' }} />
                    <span className="text-xs" style={{ color: 'var(--vd-text-s)' }}>Shot Plans + Director Notes</span>
                  </div>
                  <span className="ml-auto text-xs" style={{ color: 'var(--vd-text-s)' }}>Explore to learn the workflow →</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* ── Continue Writing ────────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
              <HiOutlinePencilSquare className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} /> Continue Writing
            </h2>
            <Link href="/projects" className="text-xs font-medium hover:underline" style={{ color: 'var(--vd-accent)' }}>View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
            ) : projects.length > 0 ? (
              projects.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div className="card-vd cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      <HiOutlineFolderOpen className="w-4 h-4" style={{ color: 'var(--vd-accent)' }} />
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{p.genre || 'Draft'}</span>
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text)' }}>{p.title}</h3>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--vd-text-s)' }}>{p.logline || 'No logline yet'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <Link href="/projects">
                <div className="card-vd cursor-pointer border-dashed flex flex-col items-center justify-center py-8 hover:border-[var(--vd-accent)] transition-colors" style={{ borderColor: 'var(--vd-border)' }}>
                  <HiOutlinePlus className="w-8 h-8 mb-2" style={{ color: 'var(--vd-text-m)' }} />
                  <span className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Create your first project</span>
                </div>
              </Link>
            )}
          </div>
        </motion.section>

        {/* ── Idea Vault Preview ──────────────────────── */}
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
              <HiOutlineLightBulb className="w-5 h-5" style={{ color: '#F59E0B' }} /> Idea Vault
            </h2>
            <Link href="/idea-vault" className="text-xs font-medium hover:underline" style={{ color: 'var(--vd-accent)' }}>View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : ideas.length > 0 ? (
              ideas.map((idea) => (
                <div key={idea.id} className="card-vd">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{idea.type}</span>
                    <span className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{idea.mood}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--vd-text)' }}>{idea.title}</h3>
                  <p className="text-xs line-clamp-2" style={{ color: 'var(--vd-text-s)' }}>{idea.description}</p>
                </div>
              ))
            ) : (
              <Link href="/idea-vault">
                <div className="card-vd cursor-pointer border-dashed flex flex-col items-center justify-center py-8 hover:border-[var(--vd-accent)] transition-colors" style={{ borderColor: 'var(--vd-border)' }}>
                  <HiOutlineLightBulb className="w-8 h-8 mb-2" style={{ color: 'var(--vd-text-m)' }} />
                  <span className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Save your first idea</span>
                </div>
              </Link>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
