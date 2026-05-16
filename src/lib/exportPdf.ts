'use client';

/**
 * Screenplay PDF Export — Zero Dependencies
 * Uses the browser's built-in print API with a hidden iframe
 * and professional screenplay CSS to generate print-quality PDFs.
 */

/* ── Types ──────────────────────────────────────────── */
interface ExportScene {
  sceneNumber: number;
  intExt: string;
  dayNight: string;
  location: string;
  content: string;
  directorNotes?: {
    camera?: string;
    pacing?: string;
    emotion?: string;
    soundtrack?: string;
    lighting?: string;
  };
  shots?: Array<{
    shotType: string;
    angle: string;
    movement: string;
    lens?: string;
    mood?: string;
    description: string;
  }>;
}

interface ExportAct {
  act: number;
  title: string;
  description: string;
  beats?: string[];
}

export interface ExportOptions {
  includeDirectorNotes: boolean;
  includeShotPlanning: boolean;
  includeTimeline: boolean;
}

export interface ExportData {
  title: string;
  genre: string;
  synopsis: string;
  acts: ExportAct[];
  scenes: ExportScene[];
  timeline?: Array<{ phase: string; milestone: string; description: string }>;
}

/* ── Helpers ────────────────────────────────────────── */
function stripHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ── Screenplay CSS ─────────────────────────────────── */
const SCREENPLAY_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  @page {
    size: letter;
    margin: 1in 1in 1in 1.5in;
  }

  body {
    font-family: 'Courier Prime', 'Courier New', Courier, monospace;
    font-size: 12pt;
    line-height: 1.4;
    color: #1a1a1a;
    background: white;
  }

  /* ── Cover Page ── */
  .cover-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    page-break-after: always;
    text-align: center;
    padding: 2in 1in;
  }
  .cover-title {
    font-size: 28pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 24pt;
    line-height: 1.2;
  }
  .cover-divider {
    width: 80px;
    height: 2px;
    background: #6366f1;
    margin: 0 auto 20pt;
  }
  .cover-genre {
    font-size: 14pt;
    color: #555;
    margin-bottom: 12pt;
  }
  .cover-date {
    font-size: 10pt;
    color: #888;
    margin-bottom: 40pt;
  }
  .cover-credit {
    font-size: 8pt;
    color: #aaa;
    position: absolute;
    bottom: 1in;
    left: 50%;
    transform: translateX(-50%);
  }

  /* ── Section Headers ── */
  .section-header {
    font-size: 14pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 6pt;
    color: #1a1a1a;
    page-break-after: avoid;
  }
  .section-line {
    width: 50px;
    height: 1.5px;
    background: #6366f1;
    margin-bottom: 18pt;
  }
  .section-break {
    page-break-before: always;
  }

  /* ── Synopsis ── */
  .synopsis-text {
    font-size: 11pt;
    line-height: 1.6;
    margin-bottom: 12pt;
    text-align: justify;
  }

  /* ── Acts ── */
  .act-block {
    margin-bottom: 24pt;
    page-break-inside: avoid;
  }
  .act-heading {
    font-size: 12pt;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 8pt;
  }
  .act-desc {
    font-size: 10pt;
    line-height: 1.5;
    margin-bottom: 8pt;
    color: #333;
  }
  .beat-list {
    list-style: none;
    padding-left: 16pt;
  }
  .beat-list li {
    font-size: 9pt;
    line-height: 1.5;
    color: #555;
    margin-bottom: 3pt;
  }
  .beat-list li::before {
    content: "•";
    color: #6366f1;
    font-weight: bold;
    display: inline-block;
    width: 12pt;
    margin-left: -12pt;
  }

  /* ── Screenplay ── */
  .scene-block {
    margin-bottom: 24pt;
    page-break-inside: avoid;
  }
  .slug-line {
    font-weight: 700;
    font-size: 12pt;
    text-transform: uppercase;
    margin-bottom: 12pt;
    page-break-after: avoid;
  }
  .action-line {
    font-size: 12pt;
    line-height: 1.4;
    margin-bottom: 10pt;
  }
  .character-name {
    font-weight: 700;
    font-size: 12pt;
    text-transform: uppercase;
    text-align: center;
    margin-top: 14pt;
    margin-bottom: 2pt;
    page-break-after: avoid;
  }
  .dialogue {
    font-size: 12pt;
    line-height: 1.4;
    margin: 0 auto 10pt;
    max-width: 70%;
    text-align: left;
  }
  .parenthetical {
    font-size: 11pt;
    font-style: italic;
    text-align: center;
    color: #555;
    margin-bottom: 2pt;
  }
  .scene-separator {
    border: none;
    border-top: 1px solid #ddd;
    margin: 20pt 0;
  }

  /* ── Director Notes ── */
  .notes-block {
    margin: 12pt 0 16pt 12pt;
    padding: 10pt 14pt;
    border-left: 3px solid #6366f1;
    background: #f8f8ff;
    page-break-inside: avoid;
  }
  .notes-title {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #6366f1;
    margin-bottom: 8pt;
  }
  .note-entry {
    font-size: 9pt;
    line-height: 1.4;
    margin-bottom: 5pt;
    color: #444;
  }
  .note-entry strong {
    color: #333;
  }

  /* ── Shot Planning ── */
  .shots-block {
    margin: 8pt 0 16pt 12pt;
    padding: 10pt 14pt;
    border-left: 3px solid #ec4899;
    background: #fef7fb;
    page-break-inside: avoid;
  }
  .shots-title {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #ec4899;
    margin-bottom: 8pt;
  }
  .shot-entry {
    font-size: 9pt;
    line-height: 1.4;
    margin-bottom: 6pt;
    color: #444;
  }
  .shot-entry strong {
    color: #333;
  }

  /* ── Timeline ── */
  .timeline-item {
    margin-bottom: 14pt;
    page-break-inside: avoid;
  }
  .timeline-milestone {
    font-size: 11pt;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 3pt;
  }
  .timeline-desc {
    font-size: 9pt;
    color: #555;
    line-height: 1.4;
    padding-left: 14pt;
  }

  /* ── Footer ── */
  @media print {
    .page-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 7pt;
      color: #bbb;
      padding: 6pt 0;
    }
  }
`;

/* ── Build HTML ─────────────────────────────────────── */
function buildHtml(data: ExportData, options: ExportOptions): string {
  const parts: string[] = [];

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Cover page
  parts.push(`
    <div class="cover-page">
      <div class="cover-title">${escapeHtml(data.title)}</div>
      <div class="cover-divider"></div>
      <div class="cover-genre">${escapeHtml(data.genre || 'Screenplay')}</div>
      <div class="cover-date">${dateStr}</div>
      <div class="cover-credit">Created with VisionDraft</div>
    </div>
  `);

  // Synopsis
  if (data.synopsis) {
    const paragraphs = data.synopsis.split('\n').filter(p => p.trim());
    parts.push(`<div class="section-break"></div>`);
    parts.push(`<div class="section-header">Synopsis</div><div class="section-line"></div>`);
    paragraphs.forEach(p => {
      parts.push(`<p class="synopsis-text">${escapeHtml(p.trim())}</p>`);
    });
  }

  // Act Structure
  if (data.acts && data.acts.length > 0) {
    parts.push(`<div class="section-break"></div>`);
    parts.push(`<div class="section-header">Act Structure</div><div class="section-line"></div>`);
    data.acts.forEach(act => {
      parts.push(`<div class="act-block">`);
      parts.push(`<div class="act-heading">Act ${act.act} — ${escapeHtml(act.title)}</div>`);
      parts.push(`<div class="act-desc">${escapeHtml(act.description)}</div>`);
      if (act.beats && act.beats.length > 0) {
        parts.push(`<ul class="beat-list">`);
        act.beats.forEach(b => parts.push(`<li>${escapeHtml(b)}</li>`));
        parts.push(`</ul>`);
      }
      parts.push(`</div>`);
    });
  }

  // Screenplay
  if (data.scenes.length > 0) {
    parts.push(`<div class="section-break"></div>`);
    parts.push(`<div class="section-header">Screenplay</div><div class="section-line"></div>`);

    data.scenes.forEach(scene => {
      const slug = `${scene.intExt}. ${scene.location.toUpperCase()} — ${scene.dayNight}`;
      parts.push(`<div class="scene-block">`);
      parts.push(`<div class="slug-line">${escapeHtml(slug)}</div>`);

      // Parse scene content
      const plain = stripHtml(scene.content || '');
      const lines = plain.split('\n').filter(l => l.trim());

      lines.forEach(line => {
        const trimmed = line.trim();
        const isCharName = /^[A-Z][A-Z\s().'']+$/.test(trimmed) && trimmed.length < 45;
        const isParenthetical = /^\(.*\)$/.test(trimmed);

        if (isCharName) {
          parts.push(`<div class="character-name">${escapeHtml(trimmed)}</div>`);
        } else if (isParenthetical) {
          parts.push(`<div class="parenthetical">${escapeHtml(trimmed)}</div>`);
        } else {
          parts.push(`<p class="action-line">${escapeHtml(trimmed)}</p>`);
        }
      });

      // Director Notes
      if (options.includeDirectorNotes && scene.directorNotes) {
        const entries = [
          { label: 'Camera', value: scene.directorNotes.camera },
          { label: 'Pacing', value: scene.directorNotes.pacing },
          { label: 'Emotion', value: scene.directorNotes.emotion },
          { label: 'Sound', value: scene.directorNotes.soundtrack },
          { label: 'Lighting', value: scene.directorNotes.lighting },
        ].filter(e => e.value);

        if (entries.length > 0) {
          parts.push(`<div class="notes-block">`);
          parts.push(`<div class="notes-title">Director Notes</div>`);
          entries.forEach(e => {
            parts.push(`<div class="note-entry"><strong>${e.label}:</strong> ${escapeHtml(e.value!)}</div>`);
          });
          parts.push(`</div>`);
        }
      }

      // Shot Planning
      if (options.includeShotPlanning && scene.shots && scene.shots.length > 0) {
        parts.push(`<div class="shots-block">`);
        parts.push(`<div class="shots-title">Shot Planning</div>`);
        scene.shots.forEach((shot, i) => {
          parts.push(`<div class="shot-entry"><strong>Shot ${i + 1}:</strong> ${escapeHtml(shot.shotType)} — ${escapeHtml(shot.angle)} — ${escapeHtml(shot.movement)}${shot.lens ? ` — ${escapeHtml(shot.lens)}` : ''}</div>`);
          if (shot.description) {
            parts.push(`<div class="shot-entry" style="padding-left:14pt;color:#666;">${escapeHtml(shot.description)}</div>`);
          }
        });
        parts.push(`</div>`);
      }

      parts.push(`<hr class="scene-separator" />`);
      parts.push(`</div>`);
    });
  }

  // Timeline
  if (options.includeTimeline && data.timeline && data.timeline.length > 0) {
    parts.push(`<div class="section-break"></div>`);
    parts.push(`<div class="section-header">Timeline</div><div class="section-line"></div>`);
    data.timeline.forEach((item, i) => {
      parts.push(`<div class="timeline-item">`);
      parts.push(`<div class="timeline-milestone">${i + 1}. ${escapeHtml(item.milestone)}</div>`);
      parts.push(`<div class="timeline-desc">${escapeHtml(item.description)}</div>`);
      parts.push(`</div>`);
    });
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(data.title)} — Screenplay</title>
      <style>${SCREENPLAY_CSS}</style>
    </head>
    <body>
      ${parts.join('\n')}
      <div class="page-footer">Created with VisionDraft</div>
    </body>
    </html>
  `;
}

/* ── Main Export Function ───────────────────────────── */
export async function generateScreenplayPdf(
  data: ExportData,
  options: ExportOptions,
  onProgress?: (step: string, pct: number) => void,
): Promise<void> {
  onProgress?.('Building screenplay document…', 20);

  const html = buildHtml(data, options);

  onProgress?.('Preparing print view…', 50);

  // Create a hidden iframe for clean printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '-9999px';
  iframe.style.width = '8.5in';
  iframe.style.height = '11in';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error('Could not create print document');
  }

  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for fonts to load
  onProgress?.('Loading fonts…', 70);
  await new Promise(resolve => setTimeout(resolve, 1500));

  onProgress?.('Opening print dialog…', 90);

  // Print the iframe content (user saves as PDF from browser dialog)
  iframe.contentWindow?.print();

  onProgress?.('Done!', 100);

  // Clean up after a delay
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 3000);
}
