'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Scene } from '@/types';
import Sidebar from '@/components/layout/Sidebar';
import ScreenplayEditor from '@/components/editor/ScreenplayEditor';
import SceneBuilder from '@/components/editor/SceneBuilder';
import DirectorNotesPanel from '@/components/editor/DirectorNotesPanel';
import CharactersPanel from '@/components/editor/CharactersPanel';
import ShotPlanningPanel from '@/components/editor/ShotPlanningPanel';
import SceneShotPlanner from '@/components/editor/SceneShotPlanner';
import TimelinePanel from '@/components/editor/TimelinePanel';
import ExportPdfModal from '@/components/editor/ExportPdfModal';
import toast from 'react-hot-toast';
import {
  HiOutlineLightBulb, HiOutlineDocumentText, HiOutlineUserGroup,
  HiOutlineGlobeAlt, HiOutlineQueueList, HiOutlineFilm,
  HiOutlineClock, HiOutlinePlus, HiOutlineTrash, HiOutlineDocumentArrowDown,
} from 'react-icons/hi2';

const tabs = [
  { id: 'story',      label: 'Story Idea',    icon: HiOutlineLightBulb },
  { id: 'synopsis',   label: 'Synopsis',       icon: HiOutlineDocumentText },
  { id: 'characters', label: 'Characters',     icon: HiOutlineUserGroup },
  { id: 'world',      label: 'World Building', icon: HiOutlineGlobeAlt },
  { id: 'acts',       label: 'Act Structure',  icon: HiOutlineQueueList },
  { id: 'scenes',     label: 'Screenplay',     icon: HiOutlineFilm },
  { id: 'timeline',   label: 'Timeline',       icon: HiOutlineClock },
];

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<(Project & Record<string, string>) | null>(null);
  const [activeTab, setActiveTab] = useState('story');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [textContent, setTextContent] = useState<Record<string, string>>({});
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [activeScene, setActiveScene] = useState<Scene | null>(null);
  const [showExport, setShowExport] = useState(false);

  /* ── Load project ── */
  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      const snap = await getDoc(doc(db, 'projects', id));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Project & Record<string, string>;
        setProject(data);
        setTextContent({
          story: data.storyIdea || '',
          synopsis: data.synopsis || '',
          world: data.worldBuilding || '',
        });
      }
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  /* ── Load scenes when on screenplay tab ── */
  useEffect(() => {
    if (activeTab !== 'scenes' || !id) return;
    const fetchScenes = async () => {
      const q = query(collection(db, 'projects', id, 'scenes'), orderBy('order'));
      const snap = await getDocs(q);
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Scene));
      setScenes(loaded);
      if (loaded.length > 0 && !activeScene) setActiveScene(loaded[0]);
    };
    fetchScenes();
  }, [activeTab, id]);

  /* ── Auto-save text tabs ── */
  useEffect(() => {
    if (!['story', 'synopsis', 'world'].includes(activeTab)) return;
    const timer = setTimeout(async () => {
      if (!id || !project) return;
      setSaving(true);
      const map: Record<string, string> = { story: 'storyIdea', synopsis: 'synopsis', world: 'worldBuilding' };
      try {
        await updateDoc(doc(db, 'projects', id), {
          [map[activeTab]]: textContent[activeTab] || '',
          updatedAt: serverTimestamp(),
        });
      } catch { /* silent */ }
      setSaving(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [textContent, activeTab]);

  /* ── Scene helpers ── */
  const addScene = async () => {
    if (!id) return;
    const newScene = {
      projectId: id,
      sceneNumber: scenes.length + 1,
      type: 'Intro Scene' as const,
      intExt: 'INT' as const,
      dayNight: 'DAY' as const,
      mood: '',
      location: '',
      content: '',
      order: scenes.length,
      directorNotes: { camera: '', pacing: '', emotion: '', soundtrack: '', lighting: '' },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, 'projects', id, 'scenes'), newScene);
    const scene = { id: ref.id, ...newScene, createdAt: new Date(), updatedAt: new Date() } as Scene;
    setScenes([...scenes, scene]);
    setActiveScene(scene);
    toast.success('Scene added');
  };

  const saveScene = async (scene: Scene) => {
    if (!id) return;
    setSaving(true);
    try {
      const { id: sid, ...data } = scene;
      await updateDoc(doc(db, 'projects', id, 'scenes', sid), { ...data, updatedAt: serverTimestamp() });
    } catch { toast.error('Save failed'); }
    setSaving(false);
  };

  const updateActiveScene = (updates: Partial<Scene>) => {
    if (!activeScene) return;
    const updated = { ...activeScene, ...updates };
    setActiveScene(updated);
    setScenes((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    const timer = setTimeout(() => saveScene(updated), 2000);
    return () => clearTimeout(timer);
  };

  const deleteScene = async (sceneId: string) => {
    if (!id || !confirm('Delete this scene?')) return;
    await deleteDoc(doc(db, 'projects', id, 'scenes', sceneId));
    const next = scenes.filter((s) => s.id !== sceneId);
    setScenes(next);
    setActiveScene(next[0] ?? null);
    toast.success('Scene deleted');
  };

  /* ── Render text tab ── */
  const renderTextTab = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--vd-text)' }}>
          {tab && <tab.icon className="w-5 h-5" style={{ color: 'var(--vd-accent)' }} />}
          {tab?.label}
        </h2>
        <textarea
          value={textContent[tabId] || ''}
          onChange={(e) => setTextContent({ ...textContent, [tabId]: e.target.value })}
          placeholder={`Write your ${tab?.label?.toLowerCase()} here...`}
          className="w-full min-h-[480px] p-6 rounded-xl border outline-none resize-y text-sm leading-relaxed focus:border-[var(--vd-accent)] transition-colors"
          style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
        />
      </div>
    );
  };

  /* ── Render act structure ── */
  const renderActs = () => {
    // If project has populated acts data (e.g. from demo), render them richly
    const projectActs = (project as any)?.acts as Array<{ act: number; title: string; description: string; beats: string[] }> | undefined;

    const defaultActs = [
      { num: 1, label: 'Act One — Setup', hint: 'Introduce the world, protagonist, and central conflict. Hook in the first 10 pages.' },
      { num: 2, label: 'Act Two — Confrontation', hint: 'Rising stakes, obstacles, midpoint twist, character growth.' },
      { num: 3, label: 'Act Three — Resolution', hint: 'Climax, aftermath, emotional payoff. Every thread resolves.' },
    ];

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--vd-text)' }}>Three-Act Structure</h2>
        {(projectActs && projectActs.length > 0) ? (
          projectActs.map((act) => (
            <div key={act.act} className="card-vd !p-0 overflow-hidden">
              <div className="px-5 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg)' }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--vd-accent)' }}>{act.act}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>Act {act.act} — {act.title}</p>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--vd-text)' }}>{act.description}</p>
                {act.beats && act.beats.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--vd-text-m)' }}>Beats</p>
                    {act.beats.map((beat, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5" style={{ background: 'var(--vd-accent)' }}>{i + 1}</span>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>{beat}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          defaultActs.map((act) => (
            <div key={act.num} className="card-vd !p-0 overflow-hidden">
              <div className="px-5 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg)' }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'var(--vd-accent)' }}>{act.num}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>{act.label}</p>
                  <p className="text-xs" style={{ color: 'var(--vd-text-m)' }}>{act.hint}</p>
                </div>
              </div>
              <textarea
                placeholder={`Describe Act ${act.num}...`}
                rows={4}
                className="w-full p-4 text-sm outline-none resize-none"
                style={{ background: 'var(--vd-bg-s)', color: 'var(--vd-text)' }}
              />
            </div>
          ))
        )}
      </div>
    );
  };

  /* ── Render screenplay scenes ──
     FIX: scene list items are now <div role="button"> instead of <button>
     to avoid nested <button> hydration error (delete icon is a button inside) */
  const renderScenes = () => (
    <div className="flex gap-4 h-full" style={{ minHeight: '70vh' }}>
      {/* Scene list sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <button onClick={addScene} className="btn-primary text-xs !py-2 !px-3 flex items-center justify-center gap-1.5 rounded-lg">
          <HiOutlinePlus className="w-3.5 h-3.5" /> New Scene
        </button>
        <div className="flex flex-col gap-1 overflow-y-auto">
          {scenes.map((s) => (
            /* Use div+role instead of button to allow button children (delete) */
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveScene(s)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveScene(s)}
              className={`group w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all relative cursor-pointer select-none ${activeScene?.id === s.id ? 'glass-strong' : 'hover:bg-[var(--vd-accent-soft)]'}`}
              style={{ color: activeScene?.id === s.id ? 'var(--vd-accent)' : 'var(--vd-text-s)' }}
            >
              <span className="font-semibold block">Scene {s.sceneNumber}</span>
              <span className="block truncate">{s.intExt}. {s.location || '—'} • {s.dayNight}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteScene(s.id); }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-400 transition-opacity"
              >
                <HiOutlineTrash className="w-3 h-3" />
              </button>
            </div>
          ))}
          {scenes.length === 0 && (
            <p className="text-xs text-center py-6" style={{ color: 'var(--vd-text-m)' }}>No scenes yet</p>
          )}
        </div>
      </div>

      {/* Scene editor */}
      <div className="flex-1 overflow-y-auto">
        {activeScene ? (
          <div className="space-y-4">
            <SceneBuilder scene={activeScene} onChange={(updates) => updateActiveScene(updates)} />
            <ScreenplayEditor content={activeScene.content || ''} onChange={(html) => updateActiveScene({ content: html })} />
            <DirectorNotesPanel notes={activeScene.directorNotes || {}} onChange={(notes) => updateActiveScene({ directorNotes: notes as Scene['directorNotes'] })} />
            <SceneShotPlanner
              sceneId={activeScene.id}
              sceneNumber={activeScene.sceneNumber}
              initialShots={(activeScene as any).shots || []}
              onShotsChange={(shots) => updateActiveScene({ shots } as any)}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <HiOutlineFilm className="w-12 h-12 mb-3" style={{ color: 'var(--vd-text-m)' }} />
            <p className="text-sm" style={{ color: 'var(--vd-text-s)' }}>Add a scene to start writing</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'story':
      case 'synopsis':
      case 'world':      return renderTextTab(activeTab);
      case 'acts':       return renderActs();
      case 'characters': return id ? <CharactersPanel projectId={id} /> : null;
      case 'scenes':     return renderScenes();
      case 'timeline':   return id ? <TimelinePanel projectId={id} /> : null;
      default:           return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
        <Sidebar />
        <main className="flex-1 lg:ml-[260px] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--vd-accent)', borderTopColor: 'transparent' }} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--vd-bg)' }}>
      <Sidebar />
      <main className="flex-1 lg:ml-[260px] pt-16 lg:pt-0 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between shrink-0" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--vd-text)' }}>{project?.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
                {project?.genre || 'Draft'}
              </span>
              {saving && (
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--vd-text-m)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> Saving…
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        {/* Tab Bar */}
        <div className="border-b overflow-x-auto shrink-0" style={{ borderColor: 'var(--vd-border)', background: 'var(--vd-bg-s)' }}>
          <div className="flex px-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'border-[var(--vd-accent)]' : 'border-transparent hover:border-[var(--vd-border)]'
                }`}
                style={{ color: activeTab === tab.id ? 'var(--vd-accent)' : 'var(--vd-text-s)' }}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Export PDF Modal */}
        <ExportPdfModal
          open={showExport}
          onClose={() => setShowExport(false)}
          data={{
            title: project?.title || 'Untitled',
            genre: project?.genre || '',
            synopsis: project?.synopsis || textContent['synopsis'] || '',
            acts: (project as any)?.acts || [],
            scenes: scenes.map(s => ({
              sceneNumber: s.sceneNumber,
              intExt: s.intExt,
              dayNight: s.dayNight,
              location: s.location || '',
              content: s.content || '',
              directorNotes: s.directorNotes,
              shots: (s as any).shots,
            })),
          }}
        />
      </main>
    </div>
  );
}
