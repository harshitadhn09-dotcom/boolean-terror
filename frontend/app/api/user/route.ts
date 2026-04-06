import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type UserProfilePayload = Record<string, unknown>;

function sanitizeProfile(body: UserProfilePayload): UserProfilePayload {
  // remove passwords before passing payload
  const profile = { ...body };
  delete profile.password;
  delete profile.confirmPassword;
  return profile;
}

async function findExistingUserId(email: unknown): Promise<string | null> {
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  return existingUser?.id ?? null;
}

async function updateExistingUser(id: string, profile: UserProfilePayload) {
  return supabase.from('users').update(profile).eq('id', id).select().single();
}

async function insertUserProfile(profile: UserProfilePayload) {
  return supabase.from('users').insert([profile]).select().single();
}

export async function POST(req: Request) {
  const body = (await req.json()) as UserProfilePayload;
  const profile = sanitizeProfile(body);
  const existingUserId = await findExistingUserId(profile.email);

  if (existingUserId) {
    const { data, error } = await updateExistingUser(existingUserId, profile);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await insertUserProfile(profile);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  return NextResponse.json(data ?? {});
}
