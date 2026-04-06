import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json();

  const { data, error } = await supabase
    .from('users')
    .insert([body])
    .select()
    .single();

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
