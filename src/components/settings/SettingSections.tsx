'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  SectionCard, SettingRow, Toggle, SliderRow,
  SelectRow, PillSelect, DangerRow,
} from './SettingRow';
import {
  HiOutlineUser, HiOutlineSwatch, HiOutlinePencilSquare,
  HiOutlineSparkles, HiOutlineLightBulb, HiOutlineBell,
  HiOutlineArrowUpTray, HiOutlineShieldCheck, HiOutlineCodeBracket,
} from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ACCENT = '#6366f1';
const GENRES = ['Thriller','Sci-Fi','Action','Romance','Horror','Drama','Psychological','Crime','Adventure'];

/* ────────────────────────────────────── 1. PROFILE */
function ProfileSection() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState<string[]>(['Thriller']);

  return (
    <>
      <SectionCard title="Profile" subtitle="Your director identity" icon={HiOutlineUser} accent={ACCENT}>
        {/* Avatar */}
        <div className="px-6 py-5 flex items-center gap-5">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #ec4899)` }}>
              {name?.[0]?.toUpperCase() || 'D'}
            </div>
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-1 font-medium" style={{ color: 'var(--vd-text-m)' }}>Display Name</p>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:border-[var(--vd-accent)] transition-colors"
              style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
              placeholder="Your name"
            />
            <p className="text-xs mt-1" style={{ color: 'var(--vd-text-s)' }}>{user?.email}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--vd-border)' }}>
          <p className="text-xs mb-2 font-medium" style={{ color: 'var(--vd-text-m)' }}>Director's Bio</p>
          <textarea
            value={bio} onChange={e => setBio(e.target.value)}
            rows={3} placeholder="Tell the world your cinematic vision…"
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:border-[var(--vd-accent)] transition-colors leading-relaxed"
            style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)', color: 'var(--vd-text)' }}
          />
        </div>

        {/* Genre */}
        <div className="border-t" style={{ borderColor: 'var(--vd-border)' }}>
          <PillSelect
            label="Favorite Genres"
            description="Select all genres that define your storytelling"
            options={GENRES}
            selected={genres}
            onChange={setGenres}
            accent={ACCENT}
          />
        </div>

        {/* Save */}
        <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: 'var(--vd-border)' }}>
          <button
            onClick={() => toast.success('Profile saved!')}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)` }}
          >
            Save Profile
          </button>
        </div>
      </SectionCard>
    </>
  );
}

/* ─────────────────────────────────── 2. APPEARANCE */
function AppearanceSection() {
  const [fontSize, setFontSize] = useState(15);
  const [editorWidth, setEditorWidth] = useState(720);
  const [focusMode, setFocusMode] = useState(false);
  const [typewriter, setTypewriter] = useState(false);

  const themes = [
    { id: 'dark', label: 'Dark Cinematic', bg: '#0a0a0f', accent: '#6366f1' },
    { id: 'light', label: 'Light Minimal', bg: '#F4F7F6', accent: '#007BFF' },
    { id: 'midnight', label: 'Midnight Blue', bg: '#0f1629', accent: '#3b82f6' },
    { id: 'classic', label: 'Classic Script', bg: '#fafaf5', accent: '#78716c' },
  ];
  const [activeTheme, setActiveTheme] = useState('dark');

  return (
    <SectionCard title="Appearance" subtitle="Your visual workspace" icon={HiOutlineSwatch} accent="#ec4899">
      {/* Theme cards */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>Theme</p>
        <div className="grid grid-cols-2 gap-3">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              className="relative p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02]"
              style={{
                borderColor: activeTheme === t.id ? t.accent : 'var(--vd-border)',
                background: 'var(--vd-bg)',
                boxShadow: activeTheme === t.id ? `0 0 16px ${t.accent}30` : 'none',
              }}
            >
              {/* Preview swatch */}
              <div className="w-full h-10 rounded-lg mb-2 flex items-end px-2 pb-1.5" style={{ background: t.bg }}>
                <div className="w-8 h-1.5 rounded-full" style={{ background: t.accent }} />
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--vd-text)' }}>{t.label}</p>
              {activeTheme === t.id && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: t.accent }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: 'var(--vd-border)' }}>
        <SliderRow label="Font Size" description="Editor reading size" min={12} max={22} value={fontSize} onChange={setFontSize} unit="px" accent="#ec4899" />
      </div>
      <div className="border-t" style={{ borderColor: 'var(--vd-border)' }}>
        <SliderRow label="Editor Width" description="Content column width" min={600} max={1000} value={editorWidth} onChange={setEditorWidth} unit="px" accent="#ec4899" />
      </div>
      <SettingRow label="Focus Mode" description="Hide all UI while writing">
        <Toggle checked={focusMode} onChange={setFocusMode} accent="#ec4899" />
      </SettingRow>
      <SettingRow label="Typewriter Mode" description="Keep cursor centered on screen">
        <Toggle checked={typewriter} onChange={setTypewriter} accent="#ec4899" />
      </SettingRow>
    </SectionCard>
  );
}

/* ──────────────────────────── 3. WRITING PREFERENCES */
function WritingSection() {
  const [autoSave, setAutoSave] = useState(true);
  const [sceneNum, setSceneNum] = useState(true);
  const [smartIndent, setSmartIndent] = useState(true);
  const [formatStyle, setFormatStyle] = useState('standard');
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);

  return (
    <SectionCard title="Writing Preferences" subtitle="Screenplay authoring defaults" icon={HiOutlinePencilSquare} accent="#f59e0b">
      <SettingRow label="Auto Save" description="Automatically save while writing">
        <Toggle checked={autoSave} onChange={setAutoSave} accent="#f59e0b" />
      </SettingRow>
      <SettingRow label="Auto Scene Numbering" description="Number scenes sequentially">
        <Toggle checked={sceneNum} onChange={setSceneNum} accent="#f59e0b" />
      </SettingRow>
      <SettingRow label="Smart Indentation" description="Auto-indent screenplay elements">
        <Toggle checked={smartIndent} onChange={setSmartIndent} accent="#f59e0b" />
      </SettingRow>
      <div className="border-t" style={{ borderColor: 'var(--vd-border)' }}>
        <SliderRow label="Auto Save Interval" min={10} max={120} value={autoSaveInterval} onChange={setAutoSaveInterval} unit="s" accent="#f59e0b" />
      </div>
      <SelectRow
        label="Screenplay Format"
        description="Industry formatting standard"
        value={formatStyle}
        onChange={setFormatStyle}
        options={[
          { value: 'standard', label: 'Standard Hollywood' },
          { value: 'bbc', label: 'BBC Format' },
          { value: 'european', label: 'European Format' },
          { value: 'stage', label: 'Stage Play Format' },
        ]}
      />
    </SectionCard>
  );
}

/* ──────────────────────────────── 4. AI ASSISTANT */
function AISection() {
  const [dialogSuggestions, setDialogSuggestions] = useState(true);
  const [sceneContinuation, setSceneContinuation] = useState(true);
  const [moodEnhance, setMoodEnhance] = useState(false);
  const [personality, setPersonality] = useState('cinematic');

  const personalities = [
    { id: 'cinematic', label: 'Cinematic', desc: 'Visual, atmospheric writing', color: '#6366f1' },
    { id: 'emotional', label: 'Emotional', desc: 'Deep character-driven output', color: '#ec4899' },
    { id: 'thriller', label: 'Thriller', desc: 'Tension, pacing, suspense', color: '#ef4444' },
    { id: 'commercial', label: 'Commercial', desc: 'Mass-market appeal', color: '#f59e0b' },
    { id: 'minimal', label: 'Minimalist', desc: 'Clean, sparse storytelling', color: '#6b7280' },
  ];

  return (
    <SectionCard title="AI Assistant" subtitle="Tune your creative AI partner" icon={HiOutlineSparkles} accent="#6366f1">
      {/* AI Status pill */}
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ background: '#10b98115', borderColor: '#10b98140' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-emerald-400">AI Online — gemini-1.5-flash</span>
        </div>
      </div>

      {/* Personality */}
      <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--vd-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>AI Personality Mode</p>
        <div className="grid grid-cols-1 gap-2">
          {personalities.map(p => (
            <button
              key={p.id}
              onClick={() => setPersonality(p.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:scale-[1.01]"
              style={{
                borderColor: personality === p.id ? p.color : 'var(--vd-border)',
                background: personality === p.id ? `${p.color}10` : 'var(--vd-bg)',
                boxShadow: personality === p.id ? `0 0 12px ${p.color}20` : 'none',
              }}
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--vd-text)' }}>{p.label}</p>
                <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>{p.desc}</p>
              </div>
              {personality === p.id && (
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>Active</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <SettingRow label="Dialogue Suggestions" description="AI suggests next dialogue lines">
        <Toggle checked={dialogSuggestions} onChange={setDialogSuggestions} accent="#6366f1" />
      </SettingRow>
      <SettingRow label="Scene Continuation" description="AI expands incomplete scenes">
        <Toggle checked={sceneContinuation} onChange={setSceneContinuation} accent="#6366f1" />
      </SettingRow>
      <SettingRow label="Mood Enhancement" description="Rewrite scenes with emotional depth">
        <Toggle checked={moodEnhance} onChange={setMoodEnhance} accent="#6366f1" />
      </SettingRow>
    </SectionCard>
  );
}

/* ───────────────────────────────── 5. IDEA VAULT */
function IdeaVaultSection() {
  const [autoCat, setAutoCat] = useState(true);
  const [smartTag, setSmartTag] = useState(true);
  const [dupDetect, setDupDetect] = useState(false);
  const [sort, setSort] = useState('recent');

  return (
    <SectionCard title="Idea Vault" subtitle="Manage your creative capture settings" icon={HiOutlineLightBulb} accent="#10b981">
      <SettingRow label="AI Auto-Categorization" description="Automatically tag and sort ideas by genre">
        <Toggle checked={autoCat} onChange={setAutoCat} accent="#10b981" />
      </SettingRow>
      <SettingRow label="Smart Tagging" description="AI assigns mood and type labels">
        <Toggle checked={smartTag} onChange={setSmartTag} accent="#10b981" />
      </SettingRow>
      <SettingRow label="Duplicate Detection" description="Alert when a similar idea exists">
        <Toggle checked={dupDetect} onChange={setDupDetect} accent="#10b981" />
      </SettingRow>
      <SelectRow
        label="Default Sort Order"
        value={sort}
        onChange={setSort}
        options={[
          { value: 'recent', label: 'Most Recent' },
          { value: 'favorites', label: 'Favorites First' },
          { value: 'mood', label: 'By Mood' },
          { value: 'genre', label: 'By Genre' },
        ]}
      />
    </SectionCard>
  );
}

/* ─────────────────────────────── 6. NOTIFICATIONS */
function NotificationsSection() {
  const [writing, setWriting] = useState(true);
  const [ideaRevisit, setIdeaRevisit] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(false);
  const [email, setEmail] = useState(false);

  return (
    <SectionCard title="Notifications" subtitle="Stay inspired, never miss a creative spark" icon={HiOutlineBell} accent="#f59e0b">
      {/* Preview notification */}
      <div className="mx-6 my-4 p-4 rounded-xl border" style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)' }}>
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--vd-text)' }}>Idea Revisit Reminder</p>
            <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>
              You saved a revenge dialogue idea 4 months ago. It might fit your new thriller project.
            </p>
          </div>
        </div>
      </div>

      <SettingRow label="Daily Writing Reminders" description="Nudge to write every day at your preferred time">
        <Toggle checked={writing} onChange={setWriting} accent="#f59e0b" />
      </SettingRow>
      <SettingRow label="Idea Revisit Reminders" description="Surface old ideas before they're forgotten">
        <Toggle checked={ideaRevisit} onChange={setIdeaRevisit} accent="#f59e0b" />
      </SettingRow>
      <SettingRow label="Weekly Creative Insights" description="Summary of your writing habits and patterns">
        <Toggle checked={weeklyInsights} onChange={setWeeklyInsights} accent="#f59e0b" />
      </SettingRow>
      <SettingRow label="Email Notifications" description="Receive summaries in your inbox">
        <Toggle checked={email} onChange={setEmail} accent="#f59e0b" />
      </SettingRow>
    </SectionCard>
  );
}

/* ──────────────────────────── 7. BACKUP & EXPORT */
function BackupSection() {
  const [cloudSync, setCloudSync] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const exportFormats = [
    { fmt: 'PDF', icon: '📄', desc: 'Print-ready screenplay' },
    { fmt: 'DOCX', icon: '📝', desc: 'Editable document' },
    { fmt: 'TXT', icon: '📃', desc: 'Plain text' },
    { fmt: 'FDX', icon: '🎬', desc: 'Final Draft format' },
  ];

  return (
    <SectionCard title="Backup & Export" subtitle="Keep your work safe and portable" icon={HiOutlineArrowUpTray} accent="#3b82f6">
      <SettingRow label="Cloud Sync" description="Automatically sync to cloud (coming soon)">
        <Toggle checked={cloudSync} onChange={setCloudSync} accent="#3b82f6" />
      </SettingRow>
      <SettingRow label="Auto Backup" description="Back up your work every 24 hours">
        <Toggle checked={autoBackup} onChange={setAutoBackup} accent="#3b82f6" />
      </SettingRow>

      {/* Export buttons */}
      <div className="px-6 py-5 border-t" style={{ borderColor: 'var(--vd-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>Export Format</p>
        <div className="grid grid-cols-2 gap-2">
          {exportFormats.map(e => (
            <button
              key={e.fmt}
              onClick={() => toast.success(`Exporting as ${e.fmt}…`)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all hover:border-[#3b82f6] hover:bg-[#3b82f610] group"
              style={{ background: 'var(--vd-bg)', borderColor: 'var(--vd-border)' }}
            >
              <span className="text-xl">{e.icon}</span>
              <div>
                <p className="text-sm font-bold group-hover:text-[#3b82f6] transition-colors" style={{ color: 'var(--vd-text)' }}>{e.fmt}</p>
                <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>{e.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

/* ──────────────────────────── 8. PRIVACY & SECURITY */
function PrivacySection() {
  const { signOut } = useAuth();

  return (
    <SectionCard title="Privacy & Security" subtitle="Your account protection" icon={HiOutlineShieldCheck} accent="#ef4444">
      <SettingRow label="Change Password" description="Update your account password">
        <button
          onClick={() => toast('Password reset email sent')}
          className="text-xs px-4 py-2 rounded-xl font-semibold border transition-all hover:bg-[var(--vd-accent-soft)]"
          style={{ borderColor: 'var(--vd-border)', color: 'var(--vd-text-m)' }}
        >
          Send Reset Email
        </button>
      </SettingRow>

      <SettingRow label="Active Sessions" description="Manage devices logged in">
        <button
          onClick={() => toast.success('All other sessions signed out')}
          className="text-xs px-4 py-2 rounded-xl font-semibold border transition-all hover:bg-[var(--vd-accent-soft)]"
          style={{ borderColor: 'var(--vd-border)', color: 'var(--vd-text-m)' }}
        >
          Sign Out All Devices
        </button>
      </SettingRow>

      <DangerRow
        label="Sign Out"
        description="Sign out of your current session"
        buttonLabel="Sign Out"
        onClick={signOut}
      />

      <DangerRow
        label="Delete Account"
        description="Permanently delete your account and all data. This cannot be undone."
        buttonLabel="Delete Account"
        onClick={() => toast.error('Please contact support to delete your account')}
      />
    </SectionCard>
  );
}

/* ──────────────────────────── AUTHOR / DEVELOPER */
function AuthorSection() {
  const socials = [
    {
      label: 'GitHub',
      handle: '@balaji-900',
      url: 'https://github.com/balaji-900',
      icon: FaGithub,
      color: '#6e7681',
      hoverColor: '#e6edf3',
    },
    {
      label: 'LinkedIn',
      handle: 'balaji2005',
      url: 'https://www.linkedin.com/in/balaji2005',
      icon: FaLinkedin,
      color: '#0a66c2',
      hoverColor: '#e8f0fe',
    },
    {
      label: 'Instagram',
      handle: '@balaji_02005',
      url: 'https://www.instagram.com/balaji_02005',
      icon: FaInstagram,
      color: '#e1306c',
      hoverColor: '#fce4ec',
    },
  ];

  return (
    <SectionCard
      title="Author & Developer"
      subtitle="The person behind VisionDraft"
      icon={HiOutlineCodeBracket}
      accent="#6366f1"
    >
      {/* Profile row */}
      <div className="px-6 py-6 flex items-center gap-5">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}
        >
          B
        </div>
        <div>
          <p className="text-base font-bold" style={{ color: 'var(--vd-text)' }}>Balaji Soundararajan</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--vd-accent)' }}>Creator of VisionDraft</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--vd-text-s)' }}>
            Building tools for storytellers who think in frames.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: 'var(--vd-border)' }} />

      {/* Social links */}
      <div className="px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--vd-text-m)' }}>Connect</p>
        <div className="flex flex-col gap-2">
          {socials.map(s => (
            <a
              key={s.label}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:scale-[1.01] hover:shadow-md"
              style={{
                background: 'var(--vd-bg)',
                borderColor: 'var(--vd-border)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = s.color;
                (e.currentTarget as HTMLElement).style.background = `${s.color}08`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--vd-border)';
                (e.currentTarget as HTMLElement).style.background = 'var(--vd-bg)';
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                style={{ background: `${s.color}15` }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--vd-text)' }}>{s.label}</p>
                <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>{s.handle}</p>
              </div>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--vd-border)' }}>
        <p className="text-xs" style={{ color: 'var(--vd-text-s)' }}>VisionDraft · v0.1.0</p>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'var(--vd-accent-soft)', color: 'var(--vd-accent)' }}>
          Made with 🎬
        </span>
      </div>
    </SectionCard>
  );
}

/* ── Export map ────────────────────────────────────── */
export const settingSections: Record<string, React.FC> = {
  profile: ProfileSection,
  appearance: AppearanceSection,
  writing: WritingSection,
  ai: AISection,
  vault: IdeaVaultSection,
  notifications: NotificationsSection,
  backup: BackupSection,
  privacy: PrivacySection,
  author: AuthorSection,
};
