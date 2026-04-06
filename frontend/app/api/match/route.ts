import { NextResponse } from 'next/server';
import { calculateMatch } from '@/lib/matching';
import { supabase } from '@/lib/supabase';
import type { MatchUser, User } from '@/types/user';

async function getCurrentUser(userId: string) {
  return supabase.from('users').select('*').eq('id', userId).single();
}

async function getLikedIds(userId: string): Promise<string[]> {
  const { data: likes } = await supabase
    .from('likes')
    .select('target_id')
    .eq('user_id', userId);

  const likedIds = (likes ?? []).map((like: { target_id: string }) => like.target_id);
  likedIds.push(userId);
  return likedIds;
}

/**
 * Loads candidate users using the existing comma-joined exclusion clause.
 */
async function getCandidateUsers(likedIds: string[]) {
  return supabase.from('users').select('*').not('id', 'in', `(${likedIds.join(',')})`);
}

function buildMatchResults(currentUser: User, candidates: User[]): MatchUser[] {
  return candidates
    .map((candidate) => {
      const { score, reasons } = calculateMatch(currentUser, candidate);
      return {
        id: candidate.id,
        name: candidate.name,
        university: candidate.university,
        skills: candidate.skills,
        level: candidate.level,
        skill_ratings: candidate.skill_ratings ?? {},
        compatibilityScore: score,
        reasons,
        github_verified: candidate.github_verified ?? false,
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .filter((result) => result.compatibilityScore >= 45);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const { data: currentUser, error: userError } = await getCurrentUser(userId);
  if (userError || !currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const likedIds = await getLikedIds(userId);
  const { data: candidates, error: candidateError } = await getCandidateUsers(likedIds);
  if (candidateError || !candidates) {
    return NextResponse.json([]);
  }

  return NextResponse.json(buildMatchResults(currentUser as User, candidates as User[]));
}
