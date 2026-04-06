import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function getMatchRows(userId: string) {
  return supabase
    .from('matches')
    .select('*')
    .or(`user1.eq.${userId},user2.eq.${userId}`);
}

function getOtherUserIds(
  matches: Array<{ user1: string; user2: string }>,
  userId: string,
): string[] {
  return matches.map((match) => (match.user1 === userId ? match.user2 : match.user1));
}

async function getMatchedUsers(otherIds: string[]) {
  return supabase
    .from('users')
    .select(
      'id, name, university, skills, level, linkedin, email, skill_ratings, github_verified',
    )
    .in('id', otherIds);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const { data: matches, error } = await getMatchRows(userId);
  if (error || !matches) {
    return NextResponse.json([]);
  }

  const otherIds = getOtherUserIds(
    matches as Array<{ user1: string; user2: string }>,
    userId,
  );
  if (otherIds.length === 0) {
    return NextResponse.json([]);
  }

  const { data: users } = await getMatchedUsers(otherIds);
  return NextResponse.json(users ?? []);
}
