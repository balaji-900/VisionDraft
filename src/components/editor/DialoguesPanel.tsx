'use client';

import { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, updateDoc,
  doc, serverTimestamp, orderBy, query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import {
  HiOutlineChatBubbleLeftRight, HiOutlinePlus, HiOutlineTrash,
  HiOutlineCheck, HiOutlinePencilSquare,
} from 'react-icons/hi2';

interface DialogueLine {
  id: string;
  character: string;
  line: string;
  subtext: string;
  order: number;
}

interface Props { projectId: string; }

export default function DialoguesPanel({ projectId }: Props) {
  const [lines, setLines] = useState<DialogueLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ character: '', line: '', subtext: '' });

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'projects', projectId, 'dialogues'), orderBy('order'));
      const snap = await getDocs(q);
      setLines(snap.docs.map(d => ({ id: d.id, ...d.data() } as DialogueLine)));
      setLoading(false);
    };
    load();
  }, [projectId]);

  const openAdd = () => { setEditingId(null); setForm({ character: '', line: '', subtext: '' }); setShowForm(true); };
  const openEdit = (l: DialogueLine) => { setEditingId(l.id); setForm({ character: l.character, line: l.line, subtext: l.subtext }); setShowForm(true); };
  const cancel = () => { setShowForm(false); setEditingId(null); };

  const save = async () => {
    if (!form.character.trim() || !form.line.trim()) { toast.error('Character and line are required'); return; }
    const payload = {
      projectId,
      character: form.character.trim(),
      line: form.line.trim(),
      subtext: form.subtext.trim(),
      order: editingId ? (lines.find(l => l.id === editingId)?.order ?? lines.length) : lines.length,
    };
    if (editingId) {
      await updateDoc(doc(db, 'projects', projectId, 'dialogues', editingId), payload);
      setLines(prev => prev.map(l => l.id === editingId ? { id: editingId, ...payload } : l));
      toast.success('Dialogue updated');
    } else {
      const ref = await addDoc(collection(db, 'projects', projectId, 'dialogues'), { ...payload, createdAt: serverTimestamp() });
      setLines(prev => [...prev, { id: ref.id, ...payload }]);
      toast.success('Dialogue added');
    }
    cancel();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this dialogue line?')) return;
    await deleteDoc(doc(db, 'projects', projectId, 'dialogues', id));
    setLines(prev => prev.filter(l => l.id !== id));
    toast.success('Deleted');
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
          <HiOutlineChatBubbleLeftRight className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />
          Dialogues
          <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
            {lines.length}
          </span>
        </h2>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Dialogue
        </button>
      </div>

      {showForm && (
        <div className="card-vd mb-6 border" style={{ borderColor: 'var(--vd-accent)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--vd-text)' }}>
            {editingId ? 'Edit Dialogue' : 'New Dialogue Line'}
          </h3>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Character *</label>
            <input
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              value={form.character}
              onChange={e => setForm(f => ({ ...f, character: e.target.value }))}
              placeholder="Character name"
            />
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Dialogue Line *</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              value={form.line}
              onChange={e => setForm(f => ({ ...f, line: e.target.value }))}
              placeholder="What does the character say?"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Subtext / Acting Note</label>
            <input
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              value={form.subtext}
              onChange={e => setForm(f => ({ ...f, subtext: e.target.value }))}
              placeholder="Underlying emotion or intent…"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancel} className="px-4 py-2 text-sm rounded-lg hover:bg-[var(--vd-bg)] transition-colors" style={{ color: 'var(--vd-text-m)' }}>
              Cancel
            </button>
            <button onClick={save} className="btn-primary text-sm flex items-center gap-2">
              <HiOutlineCheck className="w-4 h-4" /> {editingId ? 'Save' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {lines.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center card-vd border-dashed" style={{ borderColor: 'var(--vd-border)' }}>
          <HiOutlineChatBubbleLeftRight className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--vd-text-m)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--vd-text)' }}>No dialogues yet</p>
          <p className="text-xs mb-4" style={{ color: 'var(--vd-text-s)' }}>Capture key dialogue lines with character voices and subtext</p>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto">
            <HiOutlinePlus className="w-4 h-4" /> Add Dialogue
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {lines.map((l, i) => (
            <div key={l.id} className="card-vd group relative">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--vd-accent)' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--vd-accent)' }}>{l.character}</p>
                  <p className="text-sm italic leading-relaxed" style={{ color: 'var(--vd-text)' }}>&ldquo;{l.line}&rdquo;</p>
                  {l.subtext && (
                    <p className="text-xs mt-1.5" style={{ color: 'var(--vd-text-s)' }}>({l.subtext})</p>
                  )}
                </div>
              </div>
              <div className="absolute right-3 top-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(l)}
                  className="p-1.5 rounded-lg hover:bg-[var(--vd-accent-soft)] transition-colors"
                  style={{ color: 'var(--vd-accent)' }}
                >
                  <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(l.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
