export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  genre: string;
  logline: string;
  synopsis: string;
  storyIdea: string;
  worldBuilding: string;
  status: 'draft' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  type: SceneType;
  intExt: 'INT' | 'EXT' | 'INT/EXT';
  dayNight: 'DAY' | 'NIGHT' | 'DAWN' | 'DUSK';
  mood: string;
  location: string;
  content: string;
  order: number;
  directorNotes: DirectorNotes;
  createdAt: Date;
  updatedAt: Date;
}

export type SceneType =
  | 'Intro Scene'
  | 'Emotional Scene'
  | 'Fight Scene'
  | 'Horror Scene'
  | 'Romance Scene'
  | 'Flashback'
  | 'Climax';

export interface DirectorNotes {
  camera: string;
  pacing: string;
  emotion: string;
  soundtrack: string;
  lighting: string;
}

export interface Character {
  id: string;
  projectId: string;
  name: string;
  role: string;
  description: string;
  backstory: string;
  traits: string[];
  imageURL?: string;
}

export interface Act {
  id: string;
  projectId: string;
  number: 1 | 2 | 3;
  title: string;
  description: string;
  sceneIds: string[];
}

export interface Idea {
  id: string;
  userId: string;
  title: string;
  type: IdeaType;
  mood: IdeaMood;
  tags: string[];
  description: string;
  imageURL?: string;
  voiceNoteURL?: string;
  isFavorite: boolean;
  linkedProjectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IdeaType =
  | 'Emotional'
  | 'Thriller'
  | 'Action'
  | 'Romance'
  | 'Horror'
  | 'Comedy'
  | 'Dialogue'
  | 'Climax'
  | 'Character Intro';

export type IdeaMood =
  | 'Dark'
  | 'Emotional'
  | 'Suspenseful'
  | 'Intense'
  | 'Inspirational'
  | 'Mass';

export interface AIHistoryEntry {
  id: string;
  userId: string;
  feature: AIFeature;
  input: string;
  output: string;
  styleMode: string;
  projectId?: string;
  createdAt: Date;
}

export type AIFeature =
  | 'scene-expansion'
  | 'dialogue-assistant'
  | 'director-suggestions'
  | 'idea-connector'
  | 'story-structure'
  | 'style-modes';
