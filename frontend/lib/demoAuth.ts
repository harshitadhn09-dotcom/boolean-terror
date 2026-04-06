import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

const STORAGE_KEY = LOCAL_STORAGE_KEYS.demoAuthCredentials;

interface DemoCredential {
  identifier: string;
  password: string;
  userId: string;
}

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Reads demo-auth credentials from localStorage and returns a safe array.
 */
function readCredentials(): DemoCredential[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCredentials(credentials: DemoCredential[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

/**
 * Stores a fallback demo credential for local-only login recovery.
 */
export function saveDemoCredential(
  identifier: string,
  password: string,
  userId: string,
): void {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized || !password || !userId) return;

  const credentials = readCredentials().filter(
    (entry) => entry.identifier !== normalized,
  );

  credentials.push({
    identifier: normalized,
    password,
    userId,
  });

  writeCredentials(credentials);
}

/**
 * Looks up a demo credential using normalized identifier and exact password match.
 */
export function findDemoCredential(
  identifier: string,
  password: string,
): DemoCredential | undefined {
  const normalized = normalizeIdentifier(identifier);
  return readCredentials().find(
    (entry) => entry.identifier === normalized && entry.password === password,
  );
}
