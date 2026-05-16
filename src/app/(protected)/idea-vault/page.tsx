'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Idea, IdeaType, IdeaMood } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineLightBulb, HiOutlineXMark, HiOutlineHeart, HiOutlineMagnifyingGlass, HiOutlineTrash, HiOutlineFunnel } from 'react-icons/hi2';
import { HiHeart } from 'react-icons/hi2';

const ideaTypes: IdeaType[] = ['Emotional', 'Thriller', 'Action', 'Romance', 'Horror', 'Comedy', 'Dialogue', 'Climax', 'Character Intro'];
const ideaMoods: IdeaMood[] = ['Dark', 'Emotional', 'Suspenseful', 'Intense', 'Inspirational', 'Mass'];
const moodColors: Record<string, string> = { Dark: '#6366F1', Emotional: '#EC4899', Suspenseful: '#F59E0B', Intense: '#EF4444', Inspirational: '#10B981', Mass: '#8B5CF6' };

export default function IdeaVaultPage() {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterMood, setFilterMood] = useState<string>('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<IdeaType>('Emotional');
  const [mood, setMood] = useState<IdeaMood>('Inspirational');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  const fetchIdeas = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'ideaVault'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Idea));
      // Sort client-side to avoid composite Firestore index
      docs.sort((a, b) => ((b as any).createdAt?.seconds ?? 0) - ((a as any).createdAt?.seconds ?? 0));
      setIdeas(docs);
    } catch (err) {
      console.error('fetchIdeas error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchIdeas(); }, [user]);

  const createIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim()) return;
    try {
      await addDoc(collection(db, 'ideaVault'), {
        userId: user.uid, title: title.trim(), type, mood,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        description, isFavorite: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      toast.success('Idea saved!');
      setShowCreate(false); setTitle(''); setDescription(''); setTags('');
      fetchIdeas();
    } catch { toast.error('Failed to save idea'); }
  };

  const toggleFavorite = async (idea: Idea) => {
    try {
      await updateDoc(doc(db, 'ideaVault', idea.id), { isFavorite: !idea.isFavorite });
      setIdeas(ideas.map(i => i.id === idea.id ? { ...i, isFavorite: !i.isFavorite } : i));
    } catch { toast.error('Failed to update'); }
  };

  const deleteIdea = async (id: string) => {
    if (!confirm('Delete this idea?')) return;
    try {
      await deleteDoc(doc(db, 'ideaVault', id));
      toast.success('Idea deleted');
      fetchIdeas();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = ideas.filter(i => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && i.type !== filterType) return false;
    if (filterMood && i.mood !== filterMood) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] p-6 md:p-8 pt-16 lg:pt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--vd-text)' }}>Idea Vault 💡</h1>
              <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Capture ideas before they disappear</p>
            </div>
            <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 text-sm">
              <HiOutlinePlus className="w-4 h-4" /> New Idea
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
              <option value="">All Types</option>
              {ideaTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterMood} onChange={(e) => setFilterMood(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
              <option value="">All Moods</option>
              {ideaMoods.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Ideas Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="card-vd animate-shimmer h-40" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((idea, i) => (
                <motion.div key={idea.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-vd group relative">
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleFavorite(idea)} className="p-1.5 rounded-lg hover:bg-[var(--vd-accent-soft)] transition-colors">
                      {idea.isFavorite ? <HiHeart className="w-4 h-4 text-red-500" /> : <HiOutlineHeart className="w-4 h-4" style={{ color: 'var(--vd-text-m)' }} />}
                    </button>
                    <button onClick={() => deleteIdea(idea.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400">
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                  {idea.isFavorite && <HiHeart className="absolute top-3 right-3 w-4 h-4 text-red-500 group-hover:opacity-0 transition-opacity" />}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{idea.type}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: moodColors[idea.mood] || 'var(--vd-accent)' }} />
                    <span className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{idea.mood}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--vd-text)' }}>{idea.title}</h3>
                  <p className="text-xs line-clamp-3 mb-3" style={{ color: 'var(--vd-text-s)' }}>{idea.description}</p>
                  {idea.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-bg-t)', color: 'var(--vd-text-m)' }}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <HiOutlineLightBulb className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--vd-text-m)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--vd-text)' }}>{search || filterType || filterMood ? 'No matching ideas' : 'Your vault is empty'}</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--vd-text-s)' }}>Start capturing those fleeting cinematic moments.</p>
              {!search && <button onClick={() => setShowCreate(true)} className="btn-primary">Save Your First Idea</button>}
            </div>
          )}
        </motion.div>

        {/* Create Modal */}
        <AnimatePresence>
          {showCreate && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCreate(false)} />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="card-vd !p-6 w-full max-w-lg" style={{ background: 'var(--vd-bg-s)' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--vd-text)' }}>New Idea</h2>
                    <button onClick={() => setShowCreate(false)} style={{ color: 'var(--vd-text-s)' }}><HiOutlineXMark className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={createIdea} className="space-y-4">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Idea title" required className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
                    <div className="grid grid-cols-2 gap-3">
                      <select value={type} onChange={(e) => setType(e.target.value as IdeaType)} className="px-4 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
                        {ideaTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <select value={mood} onChange={(e) => setMood(e.target.value as IdeaMood)} className="px-4 py-2.5 rounded-xl text-sm border outline-none" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}>
                        {ideaMoods.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your idea..." rows={4} className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none resize-none focus:border-[var(--vd-accent)]" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }} />
                    <button type="submit" className="btn-primary w-full text-sm">Save Idea</button>
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
