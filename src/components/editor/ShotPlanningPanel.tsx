'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { HiOutlineCamera, HiOutlinePlus, HiOutlineTrash, HiOutlineCheck, HiOutlinePencilSquare } from 'react-icons/hi2';

const SHOT_TYPES = ['Establishing','Wide','Medium','Close-Up','Extreme Close-Up','Over-the-Shoulder','POV','Two-Shot','Insert'];
const ANGLES = ['Eye Level','High Angle','Low Angle','Dutch Angle','Bird\'s Eye','Worm\'s Eye'];
const MOVEMENTS = ['Static','Pan','Tilt','Dolly In','Dolly Out','Tracking','Handheld','Crane','Steadicam'];

interface Shot { id: string; shotType: string; angle: string; movement: string; lens: string; description: string; sceneRef: string; order: number; }
interface Props { projectId: string; }

export default function ShotPlanningPanel({ projectId }: Props) {
  const [shots, setShots] = useState<Shot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const empty = { shotType: 'Wide', angle: 'Eye Level', movement: 'Static', lens: '', description: '', sceneRef: '' };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'projects', projectId, 'shots'), orderBy('order'));
      const snap = await getDocs(q);
      setShots(snap.docs.map(d => ({ id: d.id, ...d.data() } as Shot)));
      setLoading(false);
    };
    load();
  }, [projectId]);

  const openAdd = () => { setEditingId(null); setForm(empty); setShowForm(true); };
  const openEdit = (s: Shot) => { setEditingId(s.id); setForm({ shotType: s.shotType, angle: s.angle, movement: s.movement, lens: s.lens, description: s.description, sceneRef: s.sceneRef }); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    const payload = { projectId, ...form, order: editingId ? (shots.find(s => s.id === editingId)?.order ?? shots.length) : shots.length };
    if (editingId) {
      await updateDoc(doc(db, 'projects', projectId, 'shots', editingId), payload);
      setShots(prev => prev.map(s => s.id === editingId ? { id: editingId, ...payload } : s));
      toast.success('Shot updated');
    } else {
      const ref = await addDoc(collection(db, 'projects', projectId, 'shots'), { ...payload, createdAt: serverTimestamp() });
      setShots(prev => [...prev, { id: ref.id, ...payload }]);
      toast.success('Shot added');
    }
    cancel();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this shot?')) return;
    await deleteDoc(doc(db, 'projects', projectId, 'shots', id));
    setShots(prev => prev.filter(s => s.id !== id));
    toast.success('Shot deleted');
  };

  const fieldClass = "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors";
  const fieldStyle = { background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
          <HiOutlineCamera className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />
          Shot Planning
          <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{shots.length} shots</span>
        </h2>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2"><HiOutlinePlus className="w-4 h-4" /> Add Shot</button>
      </div>

      {showForm && (
        <div className="card-vd mb-6 border" style={{ borderColor: 'var(--vd-accent)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--vd-text)' }}>{editingId ? 'Edit Shot' : 'New Shot'}</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Shot Type</label>
              <select className={fieldClass} style={fieldStyle} value={form.shotType} onChange={e => setForm(f => ({ ...f, shotType: e.target.value }))}>
                {SHOT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Angle</label>
              <select className={fieldClass} style={fieldStyle} value={form.angle} onChange={e => setForm(f => ({ ...f, angle: e.target.value }))}>
                {ANGLES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Movement</label>
              <select className={fieldClass} style={fieldStyle} value={form.movement} onChange={e => setForm(f => ({ ...f, movement: e.target.value }))}>
                {MOVEMENTS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Lens</label>
              <input className={fieldClass} style={fieldStyle} value={form.lens} onChange={e => setForm(f => ({ ...f, lens: e.target.value }))} placeholder="e.g. 35mm, 85mm..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Scene Reference</label>
              <input className={fieldClass} style={fieldStyle} value={form.sceneRef} onChange={e => setForm(f => ({ ...f, sceneRef: e.target.value }))} placeholder="e.g. Scene 3..." />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Description *</label>
            <textarea rows={3} className={`${fieldClass} resize-none`} style={fieldStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What does this shot capture..." />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancel} className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--vd-bg)] transition-colors" style={{ color: 'var(--vd-text-m)' }}>Cancel</button>
            <button onClick={save} className="btn-primary text-sm flex items-center gap-2"><HiOutlineCheck className="w-4 h-4" /> {editingId ? 'Save' : 'Add Shot'}</button>
          </div>
        </div>
      )}

      {shots.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center card-vd border-dashed" style={{ borderColor: 'var(--vd-border)' }}>
          <HiOutlineCamera className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--vd-text-m)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--vd-text)' }}>No shots planned yet</p>
          <p className="text-xs mb-4" style={{ color: 'var(--vd-text-s)' }}>Plan your camera shots with type, angle, movement and lens details</p>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto"><HiOutlinePlus className="w-4 h-4" /> Add Shot</button>
        </div>
      ) : (
        <div className="space-y-3">
          {shots.map((s, i) => (
            <div key={s.id} className="card-vd group relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--vd-accent)' }}>{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {[s.shotType, s.angle, s.movement].map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>{tag}</span>
                    ))}
                    {s.lens && <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>{s.lens}</span>}
                    {s.sceneRef && <span className="text-xs px-2.5 py-0.5 rounded-full" style={{ background: 'var(--vd-bg)', color: 'var(--vd-text-m)', border: '1px solid var(--vd-border)' }}>{s.sceneRef}</span>}
                  </div>
                  <p className="text-sm" style={{ color: 'var(--vd-text)' }}>{s.description}</p>
                </div>
              </div>
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-[var(--vd-accent-soft)] transition-colors" style={{ color: 'var(--vd-accent)' }}><HiOutlinePencilSquare className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
