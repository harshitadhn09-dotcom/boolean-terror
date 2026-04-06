import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // get all matches where user is user1 or user2
  const { data: matchRows, error } = await supabase
    .from('matches')
    .select('user1, user2')
    .or(`user1.eq.${userId},user2.eq.${userId}`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // get the other person's id from each match
  const otherIds = matchRows.map((m) =>
    m.user1 === userId ? m.user2 : m.user1
  );

  if (otherIds.length === 0) return NextResponse.json([]);

  // fetch their profiles
  const { data: users } = await supabase
    .from('users')
    .select('id, name, university, skills, level, linkedin, email')
    .in('id', otherIds);

  return NextResponse.json(users ?? []);
}