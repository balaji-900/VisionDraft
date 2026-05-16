'use client';

import { useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, deleteDoc, updateDoc,
  doc, serverTimestamp, query, where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Character } from '@/types';
import toast from 'react-hot-toast';
import {
  HiOutlineUserGroup, HiOutlinePlus, HiOutlineTrash,
  HiOutlinePencilSquare, HiOutlineCheck, HiOutlineXMark,
  HiOutlineUser,
} from 'react-icons/hi2';

const ROLES = ['Protagonist', 'Antagonist', 'Supporting', 'Mentor', 'Love Interest', 'Comic Relief', 'Other'];

interface Props { projectId: string; }

export default function CharactersPanel({ projectId }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeCharId, setActiveCharId] = useState<string | null>(null);
  const [traitInput, setTraitInput] = useState('');

  const emptyForm = { name: '', role: 'Protagonist', description: '', backstory: '', traits: [] as string[] };
  const [form, setForm] = useState(emptyForm);

  /* ── Load ── */
  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'projects', projectId, 'characters'));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Character));
      setCharacters(list);
      if (list.length > 0) setActiveCharId(list[0].id);
      setLoading(false);
    };
    load();
  }, [projectId]);

  /* ── Helpers ── */
  const addTrait = () => {
    const t = traitInput.trim();
    if (!t || form.traits.includes(t)) return;
    setForm(f => ({ ...f, traits: [...f.traits, t] }));
    setTraitInput('');
  };

  const removeTrait = (t: string) =>
    setForm(f => ({ ...f, traits: f.traits.filter(x => x !== t) }));

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTraitInput('');
    setShowForm(true);
  };

  const openEdit = (char: Character) => {
    setEditingId(char.id);
    setForm({
      name: char.name,
      role: char.role,
      description: char.description,
      backstory: char.backstory,
      traits: [...char.traits],
    });
    setTraitInput('');
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setForm(emptyForm); };

  const saveCharacter = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    const payload = {
      projectId,
      name: form.name.trim(),
      role: form.role,
      description: form.description.trim(),
      backstory: form.backstory.trim(),
      traits: form.traits,
    };
    if (editingId) {
      await updateDoc(doc(db, 'projects', projectId, 'characters', editingId), payload);
      setCharacters(prev => prev.map(c => c.id === editingId ? { id: editingId, ...payload } as Character : c));
      toast.success('Character updated');
    } else {
      const ref = await addDoc(collection(db, 'projects', projectId, 'characters'), {
        ...payload, createdAt: serverTimestamp(),
      });
      const newChar = { id: ref.id, ...payload } as Character;
      setCharacters(prev => [...prev, newChar]);
      setActiveCharId(ref.id);
      toast.success('Character added');
    }
    cancelForm();
  };

  const deleteCharacter = async (id: string) => {
    if (!confirm('Delete this character?')) return;
    await deleteDoc(doc(db, 'projects', projectId, 'characters', id));
    const next = characters.filter(c => c.id !== id);
    setCharacters(next);
    setActiveCharId(next[0]?.id ?? null);
    toast.success('Character deleted');
  };

  const activeChar = characters.find(c => c.id === activeCharId) ?? null;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
          <HiOutlineUserGroup className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />
          Characters
          <span className="text-xs px-2 py-0.5 rounded-full ml-1" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
            {characters.length}
          </span>
        </h2>
        <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Character
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card-vd mb-6 border" style={{ borderColor: 'var(--vd-accent)', boxShadow: '0 0 0 1px var(--vd-accent)20' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--vd-text)' }}>
            {editingId ? 'Edit Character' : 'New Character'}
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Name *</label>
              <input
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
                style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Character name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Role</label>
              <select
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
                style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Description</label>
            <textarea
              rows={2}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief physical and personality description…"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Backstory</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              value={form.backstory}
              onChange={e => setForm(f => ({ ...f, backstory: e.target.value }))}
              placeholder="Character's past, motivations, and arc…"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--vd-text-m)' }}>Traits</label>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
                style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
                value={traitInput}
                onChange={e => setTraitInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTrait())}
                placeholder="e.g. Brave, Witty, Stubborn… (press Enter)"
              />
              <button
                onClick={addTrait}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}
              >
                Add
              </button>
            </div>
            {form.traits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.traits.map(t => (
                  <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                    {t}
                    <button onClick={() => removeTrait(t)} className="hover:opacity-70 transition-opacity">
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={cancelForm} className="px-4 py-2 text-sm rounded-lg transition-colors hover:bg-[var(--vd-bg)]" style={{ color: 'var(--vd-text-m)' }}>
              Cancel
            </button>
            <button onClick={saveCharacter} className="btn-primary text-sm flex items-center gap-2">
              <HiOutlineCheck className="w-4 h-4" /> {editingId ? 'Save Changes' : 'Create Character'}
            </button>
          </div>
        </div>
      )}

      {/* Characters Layout */}
      {characters.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-20 text-center card-vd border-dashed" style={{ borderColor: 'var(--vd-border)' }}>
          <HiOutlineUserGroup className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--vd-text-m)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--vd-text)' }}>No characters yet</p>
          <p className="text-xs mb-4" style={{ color: 'var(--vd-text-s)' }}>Create character profiles with backstory, traits, and arc</p>
          <button onClick={openAdd} className="btn-primary text-sm flex items-center gap-2 mx-auto">
            <HiOutlinePlus className="w-4 h-4" /> Add Character
          </button>
        </div>
      ) : characters.length > 0 && (
        <div className="flex gap-4" style={{ minHeight: '50vh' }}>
          {/* Sidebar list */}
          <div className="w-44 shrink-0 flex flex-col gap-1.5">
            {characters.map(c => (
              <div
                key={c.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveCharId(c.id)}
                onKeyDown={e => e.key === 'Enter' && setActiveCharId(c.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${activeCharId === c.id ? 'glass-strong' : 'hover:bg-[var(--vd-accent-soft)]'}`}
                style={{ color: activeCharId === c.id ? 'var(--vd-accent)' : 'var(--vd-text-s)' }}
              >
                <span className="font-semibold block truncate">{c.name}</span>
                <span className="block truncate opacity-70">{c.role}</span>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {activeChar && (
            <div className="flex-1 card-vd">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--vd-accent-soft)' }}>
                    <HiOutlineUser className="w-6 h-6" style={{ color: 'var(--vd-accent)' }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--vd-text)' }}>{activeChar.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                      {activeChar.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(activeChar)}
                    className="p-2 rounded-lg transition-colors hover:bg-[var(--vd-accent-soft)]"
                    style={{ color: 'var(--vd-accent)' }}
                    title="Edit"
                  >
                    <HiOutlinePencilSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCharacter(activeChar.id)}
                    className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                    style={{ color: 'var(--vd-text-m)' }}
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {activeChar.description && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--vd-text-m)' }}>Description</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text)' }}>{activeChar.description}</p>
                </div>
              )}

              {activeChar.backstory && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--vd-text-m)' }}>Backstory</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text)' }}>{activeChar.backstory}</p>
                </div>
              )}

              {activeChar.traits && activeChar.traits.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--vd-text-m)' }}>Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {activeChar.traits.map(t => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!activeChar.description && !activeChar.backstory && (!activeChar.traits || activeChar.traits.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>No details yet — click Edit to add a description, backstory, and traits.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
