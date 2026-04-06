import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { LikeRequestBody } from '@/types/user';

async function insertLike(userId: string | null, targetId: string) {
  return supabase.from('likes').insert([{ user_id: userId, target_id: targetId }]);
}

async function findReverseLike(userId: string | null, targetId: string) {
  return supabase
    .from('likes')
    .select('id')
    .eq('user_id', targetId)
    .eq('target_id', userId)
    .single();
}

async function insertMatch(userId: string | null, targetId: string) {
  return supabase.from('matches').insert([{ user1: userId, user2: targetId }]);
}

export async function POST(req: Request) {
  const { userId, targetId } = (await req.json()) as LikeRequestBody;
  await insertLike(userId, targetId);

  const { data: reverse } = await findReverseLike(userId, targetId);
  if (reverse) {
    await insertMatch(userId, targetId);
    return NextResponse.json({ matched: true });
  }

  return NextResponse.json({ matched: false });
}
