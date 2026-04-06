import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId, targetId } = await req.json();

  // insert the like
  await supabase.from('likes').insert([{ user_id: userId, target_id: targetId }]);

  // check if target already liked userId back
  const { data: reverse } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', targetId)
    .eq('target_id', userId)
    .single();

  if (reverse) {
    // it's a match! insert into matches
    await supabase.from('matches').insert([{ user1: userId, user2: targetId }]);
    return NextResponse.json({ matched: true });
  }

  return NextResponse.json({ matched: false });
}