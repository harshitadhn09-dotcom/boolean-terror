import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateMatch } from '@/lib/matching';
import { User } from '@/types/user';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // get current user
  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError || !currentUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // get users already liked by current user
  const { data: likes } = await supabase
    .from('likes')
    .select('target_id')
    .eq('user_id', userId);

  const likedIds = (likes ?? []).map((l: { target_id: string }) => l.target_id);
  likedIds.push(userId); // exclude self

  // get all other users not yet liked
  const { data: candidates, error: candError } = await supabase
    .from('users')
    .select('*')
    .not('id', 'in', `(${likedIds.join(',')})`);

  if (candError || !candidates) {
    return NextResponse.json([]);
  }

  // calculate compatibility for each
  const results = candidates.map((candidate: User) => {
    const { score, reasons } = calculateMatch(currentUser as User, candidate);
    return {
      id: candidate.id,
      name: candidate.name,
      university: candidate.university,
      skills: candidate.skills,
      level: candidate.level,
      compatibilityScore: score,
      reasons,
    };
  });

  // sort by best match first
  results.sort((a: { compatibilityScore: number }, b: { compatibilityScore: number }) => b.compatibilityScore - a.compatibilityScore);

  return NextResponse.json(results);
}