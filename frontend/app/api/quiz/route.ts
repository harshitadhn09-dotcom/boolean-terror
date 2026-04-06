import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { skill, history } = await req.json();

  const messages = [
    {
      role: 'system',
      content: `You are a technical interviewer assessing a developer's skill in ${skill}. 
Ask exactly one short practical question at a time (max 2 sentences). 
After 2 questions and answers, respond with ONLY this JSON and nothing else:
{"rating": <1-5>, "feedback": "<one sentence>"}
Rating guide: 1=no knowledge, 2=basic, 3=competent, 4=strong, 5=expert.
Be strict but fair.`,
    },
    ...history,
  ];

  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5-coder:7b',
      messages,
      stream: false,
    }),
  });

  const data = await res.json();
  console.log('Ollama response:', JSON.stringify(data, null, 2));

  const content = data?.message?.content ?? data?.response ?? '';

  if (!content) {
    return NextResponse.json(
      { error: 'No response from model' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: content });
}
