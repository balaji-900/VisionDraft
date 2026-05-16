'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { HiOutlineClock, HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiOutlinePencilSquare } from 'react-icons/hi2';

const PHASES = ['Pre-Production','Principal Photography','Post-Production','Sound Design','Color Grading','Visual Effects','Final Delivery'];
const STATUS_OPTS = ['Planned','In Progress','Completed','Delayed'];
const STATUS_COLORS: Record<string, string> = {
  'Planned': 'var(--vd-text-m)',
  'In Progress': '#3b82f6',
  'Completed': '#22c55e',
  'Delayed': '#ef4444',
};

interface Milestone { id: string; phase: string; title: string; dueDate: string; status: string; notes: string; order: number; }
interface Props { projectId: string; }

export default function TimelinePanel({ projectId }: Props) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const empty = { phase: 'Pre-Production', title: '', dueDate: '', status: 'Planned', notes: '' };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'projects', projectId, 'milestones'), orderBy('order'));
      const snap = await getDocs(q);
      setMilestones(snap.docs.map(d => ({ id: d.id, ...d.data() } as Milestone)));
      setLoading(false);
    };
    load();
  }, [projectId]);

  const openAdd = () => { setEditingId(null); setForm(empty); setShowForm(true); };
  const openEdit = (m: Milestone) => { setEditingId(m.id); setForm({ phase: m.phase, title: m.title, dueDate: m.dueDate, status: m.status, notes: m.notes }); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    const payload = { projectId, ...form, order: editingId ? (milestones.find(m => m.id === editingId)?.order ?? milestones.length) : milestones.length };
    if (editingId) {
      await updateDoc(doc(db, 'projects', projectId, 'milestones', editingId), payload);
      setMilestones(prev => prev.map(m => m.id === editingId ? { id: editingId, ...payload } : m));
      toast.success('Milestone updated');
    } else {
      const ref = await addDoc(collection(db, 'projects', projectId, 'milestones'), { ...payload, createdAt: serverTimestamp() });
      setMilestones(prev => [...prev, { id: ref.id, ...payload }]);
      toast.success('Milestone added');
    }
    cancel();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this milestone?')) return;
    await deleteDoc(doc(db, 'projects', projectId, 'milestones', id));
    setMilestones(prev => prev.filter(m => m.id !== id));
    toast.success('Deleted');
  };

  const quickStatus = async (m: Milestone, status: string) => {
    await updateDoc(doc(db, 'projects', projectId, 'milestones', m.id), { status });
    setMilestones(prev => prev.map(x => x.id === m.id ? { ...x, status } : x));
  };

  const fieldClass = "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors";
  const fieldStyle = { background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' };

  // Group by phase
  const grouped = PHASES.map(phase => ({ phase, items: milestones.filter(m => m.phase === phase) })).filter(g => g.items.length > 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
          <HiOutlineClock className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />
          Production Timeline
          <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{milestones.length} milestones</span>
        </h2>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><HiOutlinePlus className="w-4 h-4" /> Add Milestone</button>
      </div>

      {showForm && (
        <div className="card-vd mb-6 border" style={{ borderColor: 'var(--vd-accent)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--vd-text)' }}>{editingId ? 'Edit Milestone' : 'New Milestone'}</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Title *</label>
              <input className={fieldClass} style={fieldStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Milestone name..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Phase</label>
              <select className={fieldClass} style={fieldStyle} value={form.phase} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}>
                {PHASES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Due Date</label>
              <input type="date" className={fieldClass} style={fieldStyle} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Status</label>
              <select className={fieldClass} style={fieldStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Notes</label>
            <textarea rows={2} className={`${fieldClass} resize-none`} style={fieldStyle} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes..." />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancel} className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--vd-bg)] transition-colors" style={{ color: 'var(--vd-text-m)' }}>Cancel</button>
            <button onClick={save} className="btn-primary text-sm flex items-center gap-2"><HiOutlineCheck className="w-4 h-4" /> {editingId ? 'Save' : 'Add'}</button>
          </div>
        </div>
      )}

      {milestones.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center card-vd border-dashed" style={{ borderColor: 'var(--vd-border)' }}>
          <HiOutlineClock className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--vd-text-m)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--vd-text)' }}>No milestones yet</p>
          <p className="text-xs mb-4" style={{ color: 'var(--vd-text-s)' }}>Track your production phases from pre-production to final delivery</p>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto"><HiOutlinePlus className="w-4 h-4" /> Add Milestone</button>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.phase}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>{group.phase}</h3>
              <div className="relative pl-4 space-y-3">
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ background: 'var(--vd-border)' }} />
                {group.items.map(m => (
                  <div key={m.id} className="relative group">
                    <div className="absolute -left-[1.35rem] top-3.5 w-3 h-3 rounded-full border-2 z-10" style={{ borderColor: STATUS_COLORS[m.status], background: 'var(--vd-bg-s)' }} />
                    <div className="card-vd ml-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>{m.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${STATUS_COLORS[m.status]}20`, color: STATUS_COLORS[m.status] }}>{m.status}</span>
                            {m.dueDate && <span className="text-xs" style={{ color: 'var(--vd-text-s)' }}>Due {m.dueDate}</span>}
                          </div>
                          {m.notes && <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>{m.notes}</p>}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {STATUS_OPTS.filter(s => s !== m.status).map(s => (
                              <button key={s} onClick={() => quickStatus(m, s)} className="text-xs px-2 py-0.5 rounded-full transition-colors hover:opacity-80" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text-s)', border: '1px solid var(--vd-border)' }}>
                                → {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-[var(--vd-accent-soft)] transition-colors" style={{ color: 'var(--vd-accent)' }}><HiOutlinePencilSquare className="w-3.5 h-3.5" /></button>
                          <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
