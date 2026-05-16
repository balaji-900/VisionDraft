'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineFolderOpen, HiOutlineXMark, HiOutlineTrash } from 'react-icons/hi2';
import { DEMO_PROJECT, DEMO_SCENES, DEMO_CHARACTERS, DEMO_TIMELINE, DEMO_IDEAS } from '@/lib/demoProject';

// Guard so we never seed twice in one session
let demoPending = false;

const genres = ['Drama', 'Thriller', 'Action', 'Romance', 'Horror', 'Comedy', 'Sci-Fi', 'Mystery', 'Documentary'];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [logline, setLogline] = useState('');

  const seedDemo = async () => {
    if (!user || demoPending) return;
    demoPending = true;
    try {
      // Create main project with story, synopsis, world, acts
      const projRef = await addDoc(collection(db, 'projects'), {
        userId: user.uid,
        title: DEMO_PROJECT.title,
        genre: DEMO_PROJECT.genre,
        logline: DEMO_PROJECT.logline,
        storyIdea: DEMO_PROJECT.storyIdea,
        synopsis: DEMO_PROJECT.synopsis,
        worldBuilding: DEMO_PROJECT.worldBuilding,
        acts: DEMO_PROJECT.acts,
        status: 'in-progress',
        isDemo: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Scenes with director notes
      for (const scene of DEMO_SCENES) {
        await addDoc(collection(db, 'projects', projRef.id, 'scenes'), {
          projectId: projRef.id, ...scene,
          order: scene.sceneNumber - 1,
          createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        });
      }

      // Characters
      for (const char of DEMO_CHARACTERS) {
        await addDoc(collection(db, 'projects', projRef.id, 'characters'), {
          projectId: projRef.id, ...char, createdAt: serverTimestamp(),
        });
      }

      // Timeline milestones
      for (const [i, m] of DEMO_TIMELINE.entries()) {
        await addDoc(collection(db, 'projects', projRef.id, 'timeline'), {
          projectId: projRef.id, ...m, order: i, createdAt: serverTimestamp(),
        });
      }

      // Idea Vault entries
      for (const idea of DEMO_IDEAS) {
        await addDoc(collection(db, 'ideaVault'), {
          userId: user.uid, ...idea, createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error('Demo seed failed:', e);
      demoPending = false;
    }
  };

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      docs.sort((a, b) => ((b as any).updatedAt?.seconds ?? 0) - ((a as any).updatedAt?.seconds ?? 0));

      // Auto-seed demo for brand-new users — silent, no UI
      if (docs.length === 0 && !demoPending) {
        await seedDemo();
        // Re-fetch after seeding so the project card appears immediately
        const snap2 = await getDocs(q);
        const docs2 = snap2.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        docs2.sort((a, b) => ((b as any).updatedAt?.seconds ?? 0) - ((a as any).updatedAt?.seconds ?? 0));
        setProjects(docs2);
      } else {
        setProjects(docs);
      }
    } catch (err) {
      console.error('fetchProjects error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user]);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    try {
      await addDoc(collection(db, 'projects'), {
        userId: user.uid, title: title.trim(), genre, logline, synopsis: '', storyIdea: '', worldBuilding: '',
        status: 'draft', createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      toast.success('Project created!');
      setShowCreate(false); setTitle(''); setGenre(''); setLogline('');
      fetchProjects();
    } catch (e) { toast.error('Failed to create project'); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted');
      fetchProjects();
    } catch { toast.error('Failed to delete'); }
  };


  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 pt-16 lg:pt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--vd-text)' }}>Projects</h1>
            <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Your cinematic stories</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlinePlus className="w-4 h-4" /> New Project
          </button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="card-vd animate-shimmer h-40" />)}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/projects/${p.id}`}>
                  <div className="card-vd group cursor-pointer relative">
                    <button onClick={(e) => { e.preventDefault(); deleteProject(p.id); }} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-red-400">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 mb-3">
                      <HiOutlineFolderOpen className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{p.genre || 'Draft'}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: p.status === 'completed' ? '#10B98120' : 'var(--vd-bg-t)', color: p.status === 'completed' ? '#10B981' : 'var(--vd-text-m)' }}>{p.status}</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-[var(--vd-accent)] transition-colors" style={{ color: 'var(--vd-text)' }}>{p.title}</h3>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--vd-text-s)' }}>{p.logline || 'No logline yet...'}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <HiOutlineFolderOpen className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--vd-text-m)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--vd-text)' }}>No projects yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--vd-text-s)' }}>Every great film starts with a single idea.</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary">Create Your First Project</button>
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreate(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="card-vd !p-6 w-full max-w-lg" style={{ background: 'var(--vd-bg-s)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--vd-text)' }}>New Project</h2>
                    <button onClick={() => setShowCreate(false)} style={{ color: 'var(--vd-text-s)' }}><HiOutlineXMark className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={createProject} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--vd-text-s)' }}>Title</label>
                      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled Project" required className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--vd-text-s)' }}>Genre</label>
                      <select value={genre} onChange={(e) => setGenre(e.target.value)} className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
                        <option value="">Select genre</option>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--vd-text-s)' }}>Logline</label>
                      <textarea value={logline} onChange={(e) => setLogline(e.target.value)} placeholder="A one-sentence summary of your story..." rows={3} className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
                    </div>
                    <button type="submit" className="btn-primary w-full text-sm">Create Project</button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
