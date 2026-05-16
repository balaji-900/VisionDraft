'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineXMark, HiOutlineLightBulb, HiOutlineMicrophone, HiOutlineStop } from 'react-icons/hi2';

export default function QuickCapture() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const save = async () => {
    if (!user || !text.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'ideaVault'), {
        userId: user.uid,
        title: text.trim().slice(0, 50) + (text.length > 50 ? '...' : ''),
        type: 'Dialogue',
        mood: 'Inspirational',
        tags: ['quick-capture'],
        description: text.trim(),
        isFavorite: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success('Idea captured! ✨');
      setText('');
      setOpen(false);
    } catch {
      toast.error('Failed to save');
    }
    setSaving(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (e) => audioChunks.current.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        toast.success('Voice note recorded! (Audio upload coming soon)');
      };
      recorder.start();
      mediaRecorder.current = recorder;
      setRecording(true);
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--vd-accent)', color: '#fff' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: open ? 45 : 0 }}
      >
        {open ? <HiOutlineXMark className="w-6 h-6" /> : <HiOutlinePlus className="w-6 h-6" />}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-40 w-80 card-vd !p-4"
            style={{ background: 'var(--vd-bg-s)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="w-4 h-4" style={{ color: 'var(--vd-accent)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>Quick Capture</span>
              <span className="text-xs" style={{ color: 'var(--vd-text-m)' }}>— before it disappears</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Scene idea, dialogue snippet, visual moment..."
              rows={3}
              autoFocus
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none resize-none mb-3 focus:border-[var(--vd-accent)]"
              style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) save(); }}
            />
            <div className="flex items-center justify-between">
              <button
                onClick={recording ? stopRecording : startRecording}
                className="p-2 rounded-lg transition-colors"
                style={{ background: recording ? '#EF444420' : 'var(--vd-accent-soft)', color: recording ? '#EF4444' : 'var(--vd-accent)' }}
              >
                {recording ? <HiOutlineStop className="w-4 h-4" /> : <HiOutlineMicrophone className="w-4 h-4" />}
              </button>
              <button onClick={save} disabled={saving || !text.trim()} className="btn-primary text-xs !py-2 !px-4 disabled:opacity-50">
                {saving ? 'Saving...' : 'Capture ⌘↵'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
