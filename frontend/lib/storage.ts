import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function readString(key: string): string | null {
  return getLocalStorage()?.getItem(key) ?? null;
}

function writeString(key: string, value: string): void {
  getLocalStorage()?.setItem(key, value);
}

function removeValue(key: string): void {
  getLocalStorage()?.removeItem(key);
}

export function getStoredUserId(): string | null {
  return readString(LOCAL_STORAGE_KEYS.userId);
}

export function setStoredUserId(userId: string): void {
  writeString(LOCAL_STORAGE_KEYS.userId, userId);
}

export function getStoredQuizSkills(): string[] | null {
  const raw = readString(LOCAL_STORAGE_KEYS.quizSkills);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredQuizSkills(skills: string[]): void {
  writeString(LOCAL_STORAGE_KEYS.quizSkills, JSON.stringify(skills));
}

export function clearStoredQuizSkills(): void {
  removeValue(LOCAL_STORAGE_KEYS.quizSkills);
}
