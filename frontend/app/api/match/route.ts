import { NextResponse } from 'next/server';
import { calculateMatch } from '@/lib/matching';
import { User } from '@/types/user';

// --- MOCK USERS (TEMP) ---
const users: User[] = [
  {
    id: '1',
    name: 'Anirudh',
    gender: 'male',
    university: 'CU',
    skills: ['react', 'node', 'ml'],
    level: 'intermediate',
    interests: ['ai', 'web'],
    linkedin: '',
    email: '',
  },
  {
    id: '2',
    name: 'Harshit',
    gender: 'male',
    university: 'CU',
    skills: ['react', 'python', 'ml'],
    level: 'intermediate',
    interests: ['ai', 'blockchain'],
    linkedin: '',
    email: '',
  },
  {
    id: '3',
    name: 'Riya',
    gender: 'female',
    university: 'DU',
    skills: ['design', 'figma', 'ui'],
    level: 'beginner',
    interests: ['design', 'frontend'],
    linkedin: '',
    email: '',
  },
];

// --- API ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const currentUser = users.find((u) => u.id === userId);

  if (!currentUser) {
    return NextResponse.json([]);
  }

  const results = users
    .filter((u) => u.id !== userId)
    .map((u) => {
      const { score, reasons } = calculateMatch(currentUser, u);

      return {
        id: u.id,
        name: u.name,
        university: u.university,
        skills: u.skills,
        level: u.level,
        compatibilityScore: score,
        reasons,
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  return NextResponse.json(results);
}
