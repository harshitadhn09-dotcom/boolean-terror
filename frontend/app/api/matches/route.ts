import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const { data: matches, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1.eq.${userId},user2.eq.${userId}`);

  if (error || !matches) return NextResponse.json([]);

  const otherIds = matches.map((m) => (m.user1 === userId ? m.user2 : m.user1));

  if (otherIds.length === 0) return NextResponse.json([]);

  const { data: users } = await supabase
    .from('users')
    .select(
      'id, name, university, skills, level, linkedin, email, skill_ratings, github_verified',
    )
    .in('id', otherIds);

  return NextResponse.json(users ?? []);
}
