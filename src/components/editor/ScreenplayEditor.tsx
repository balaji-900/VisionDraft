'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import {
  HiOutlineBars3BottomLeft,
  HiOutlineBars3,
  HiOutlineBars3CenterLeft,
  HiOutlineBold,
  HiOutlineUnderline,
} from 'react-icons/hi2';

interface ScreenplayEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const toolbarBtns = (editor: ReturnType<typeof useEditor>) => [
  {
    label: 'Scene Heading',
    action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    active: editor?.isActive('heading', { level: 2 }),
    icon: HiOutlineBars3BottomLeft,
    tip: 'INT./EXT. LOCATION — TIME',
  },
  {
    label: 'Action',
    action: () => editor?.chain().focus().setParagraph().setTextAlign('left').run(),
    active: editor?.isActive('paragraph') && editor?.isActive({ textAlign: 'left' }),
    icon: HiOutlineBars3,
    tip: 'Action / scene description',
  },
  {
    label: 'Character',
    action: () => editor?.chain().focus().setParagraph().setTextAlign('center').run(),
    active: editor?.isActive('paragraph') && editor?.isActive({ textAlign: 'center' }),
    icon: HiOutlineBars3CenterLeft,
    tip: 'Character name',
  },
  {
    label: 'Bold',
    action: () => editor?.chain().focus().toggleBold().run(),
    active: editor?.isActive('bold'),
    icon: HiOutlineBold,
    tip: 'Bold text',
  },
  {
    label: 'Underline',
    action: () => editor?.chain().focus().toggleUnderline().run(),
    active: editor?.isActive('underline'),
    icon: HiOutlineUnderline,
    tip: 'Underline',
  },
];

export default function ScreenplayEditor({
  content,
  onChange,
  placeholder = 'INT. LOCATION — TIME\n\nBegin writing your scene...',
  readOnly = false,
}: ScreenplayEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Underline,
    ],
    content,
    immediatelyRender: false,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes (e.g. after loading from Firestore)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  if (!editor) return null;

  const buttons = toolbarBtns(editor);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: 'var(--vd-border)' }}
    >
      {/* Toolbar */}
      {!readOnly && (
        <div
          className="flex items-center gap-1 px-3 py-2 border-b flex-wrap"
          style={{ background: 'var(--vd-bg-s)', borderColor: 'var(--vd-border)' }}
        >
          {buttons.map((btn) => (
            <button
              key={btn.label}
              title={btn.tip}
              onClick={btn.action}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                btn.active ? 'text-white' : 'hover:bg-[var(--vd-accent-soft)]'
              }`}
              style={{
                background: btn.active ? 'var(--vd-accent)' : 'transparent',
                color: btn.active ? '#fff' : 'var(--vd-text-s)',
              }}
            >
              <btn.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{btn.label}</span>
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-xs hidden md:block" style={{ color: 'var(--vd-text-m)' }}>
            Courier Prime • Screenplay Format
          </span>
        </div>
      )}

      {/* Editor area */}
      <div
        className="min-h-[500px] p-6 md:p-10 screenplay"
        style={{ background: 'var(--vd-bg-s)', color: 'var(--vd-text)' }}
      >
        <style>{`
          .ProseMirror { outline: none; min-height: 460px; font-family: var(--font-courier-prime, 'Courier New', monospace); font-size: 12pt; line-height: 1.6; }
          .ProseMirror h2 { text-transform: uppercase; font-weight: 700; font-size: 12pt; margin-top: 2em; margin-bottom: 0.5em; letter-spacing: 0.05em; }
          .ProseMirror p { margin: 0.5em 0; }
          .ProseMirror p[style*="text-align: center"] { margin-left: auto; margin-right: auto; max-width: 60%; }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: var(--vd-text-m); pointer-events: none; height: 0; font-style: italic; }
          .ProseMirror .highlight { background: var(--vd-accent-soft); border-radius: 3px; padding: 0 2px; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </motion.div>
  );
}
