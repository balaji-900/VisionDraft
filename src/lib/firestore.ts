import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { Project, Idea, UserProfile } from '@/types';

// ─── Users ──────────────────────────────────────────────────────────────────
export const getUser = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const updateUser = async (uid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const getProjects = async (userId: string): Promise<Project[]> => {
  const q = query(
    collection(db, 'projects'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
};

export const getProject = async (id: string): Promise<Project | null> => {
  const snap = await getDoc(doc(db, 'projects', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null;
};

export const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'projects'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  await updateDoc(doc(db, 'projects', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteProject = async (id: string) => {
  await deleteDoc(doc(db, 'projects', id));
};

// ─── Ideas ────────────────────────────────────────────────────────────────────
export const getIdeas = async (userId: string): Promise<Idea[]> => {
  const q = query(
    collection(db, 'ideaVault'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Idea));
};

export const createIdea = async (data: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) => {
  return addDoc(collection(db, 'ideaVault'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateIdea = async (id: string, data: Partial<Idea>) => {
  await updateDoc(doc(db, 'ideaVault', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteIdea = async (id: string) => {
  await deleteDoc(doc(db, 'ideaVault', id));
};

export const toggleFavorite = async (id: string, current: boolean) => {
  await updateDoc(doc(db, 'ideaVault', id), { isFavorite: !current });
};
