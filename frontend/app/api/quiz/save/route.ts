import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { userId, skill_ratings } = await req.json();

  const { error } = await supabase
    .from('users')
    .update({ skill_ratings })
    .eq('id', userId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
