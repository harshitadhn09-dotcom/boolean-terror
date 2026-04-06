import { NextResponse } from 'next/server';
import type { QuizRouteRequestBody, QuizRouteResponseBody } from '@/types/user';

function buildQuizMessages(body: QuizRouteRequestBody) {
  return [
    {
      role: 'system',
      content: `You are a technical interviewer assessing a developer's skill in ${body.skill}. 
Ask exactly one short practical question at a time (max 2 sentences). 
After 2 questions and answers, respond with ONLY this JSON and nothing else:
{"rating": <1-5>, "feedback": "<one sentence>"}
Rating guide: 1=no knowledge, 2=basic, 3=competent, 4=strong, 5=expert.
Be strict but fair.`,
    },
    ...body.history,
  ];
}

/**
 * Calls the local Ollama chat endpoint with the existing non-streaming contract.
 */
async function requestQuizResponse(body: QuizRouteRequestBody): Promise<string> {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'qwen2.5-coder:7b',
      messages: buildQuizMessages(body),
      stream: false,
    }),
  });

  const data: { message?: { content?: string }; response?: string } =
    await response.json();
  return data?.message?.content ?? data?.response ?? '';
}

export async function POST(req: Request) {
  const body = (await req.json()) as QuizRouteRequestBody;
  const content = await requestQuizResponse(body);

  if (!content) {
    return NextResponse.json(
      { error: 'No response from model' },
      { status: 500 },
    );
  }

  const responseBody: QuizRouteResponseBody = { message: content };
  return NextResponse.json(responseBody);
}
