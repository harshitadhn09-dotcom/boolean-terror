import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { QuizSaveRequestBody } from '@/types/user';

/**
 * Saves the quiz skill-rating map onto the user profile row.
 */
async function persistSkillRatings({
  userId,
  skill_ratings,
}: QuizSaveRequestBody) {
  return supabase.from('users').update({ skill_ratings }).eq('id', userId);
}

export async function POST(req: Request) {
  const body = (await req.json()) as QuizSaveRequestBody;
  const { error } = await persistSkillRatings(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
