import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // TEMP: just return the same data
  return NextResponse.json({
    id: Date.now().toString(),
    ...body,
  });
}
