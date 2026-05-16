# 🎬 VisionDraft

**AI-Powered Cinematic Screenplay Workspace**

VisionDraft is a professional-grade screenplay management platform built for writers, directors, and filmmakers. It combines rich-text editing, AI-driven storytelling assistance, and a complete director's toolkit into one immersive dark-mode workspace.

---

## ✨ Features

### Screenplay Editor
- Rich-text screenplay formatting with scene management
- Scene-level Director Notes (camera, pacing, emotion, sound, lighting)
- Integrated Shot Planning per scene (shot type, angle, movement, lens, mood)
- Professional **Export as PDF** with industry-standard formatting

### Project Workspace
- **Story Idea** — capture and develop your narrative premise
- **Synopsis** — write full narrative breakdowns
- **Characters** — build detailed character profiles with backstory and traits
- **World Building** — design settings, visual tone, and atmosphere
- **Act Structure** — three-act breakdown with beats
- **Screenplay** — full scene editor with slug lines and dialogue
- **Timeline** — track story progression milestones

### AI Assistant
- Powered by **Google Gemini** for creative storytelling assistance
- Script analysis, dialogue generation, and brainstorming

### Director Toolkit
- Scene Shot Planner
- Director Notes Panel
- Visual workflow tools

### Built-in Demo Project
- **"Seven"** — a complete psychological thriller project pre-loaded for every new user
- Demonstrates all features: story, scenes, characters, acts, shot plans, and director notes
- Learn the platform instantly without tutorials

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI | Google Gemini API |
| Editor | Tiptap (rich text) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/balaji-900/VisionDraft.git
   cd VisionDraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local`**
   ```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC0cbCHAtKnIvQIABHlO3dW2NGmUMeulDc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vision-draft.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vision-draft
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vision-draft.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=101801619253
NEXT_PUBLIC_FIREBASE_APP_ID=1:101801619253:web:51f91e330d0ebc7fa9a67c
   # Google Gemini API
   GEMINI_API_KEY=your_gemini_key
   ```

4. **Run the dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Signup pages
│   ├── (protected)/     # Dashboard, Projects, Settings, AI, Idea Vault
│   └── api/ai/          # Gemini API route
├── components/
│   ├── editor/          # SceneBuilder, ScreenplayEditor, DirectorNotes,
│   │                      ShotPlanner, CharactersPanel, ExportPdfModal
│   ├── landing/         # Hero, Features, Workflow, CTA, Footer
│   ├── layout/          # Sidebar
│   └── settings/        # SettingSections
├── context/             # AuthContext
├── lib/                 # Firebase config, demo project data, PDF export
├── providers/           # Theme & app providers
└── types/               # TypeScript interfaces
```

---

## 🎬 Demo Project: "Seven"

Every new user gets a pre-seeded cinematic demo project featuring:

- **Genre:** Psychological Thriller
- **3 Screenplay Scenes** with full dialogue and action lines
- **3 Characters** — Arjun, Kiran, Maya (with backstories)
- **3-Act Structure** with detailed beats
- **12 Shot Plans** (4 per scene)
- **Director Notes** on every scene (camera, pacing, emotion, sound, lighting)
- **Timeline milestones** and **Idea Vault** entries

---

## 📄 License

This project is for personal and educational use.

---

<p align="center">
  <strong>Built with 🎬 by VisionDraft</strong>
</p>
