'use client';

import { useEffect, useState } from 'react';
import type { ParsedQuizRating, QuizMessage, QuizRating } from '@/types/user';
import {
  buildRatingsMap,
  hasParsedRating,
  parseQuizRatingMessage,
} from '@/components/quiz/utils';

const FORCE_RATING_MESSAGE =
  'Please now provide your rating as JSON only: {"rating": <1-5>, "feedback": "<one sentence>"}';

interface UseQuizFlowOptions {
  skills: string[];
  onDone: (ratings: QuizRating[]) => void;
}

interface UseQuizFlowReturn {
  currentSkillIdx: number;
  history: QuizMessage[];
  input: string;
  loading: boolean;
  ratings: QuizRating[];
  done: boolean;
  setInput: (value: string) => void;
  sendAnswer: () => Promise<void>;
}

async function fetchQuizMessage(
  skill: string,
  history: QuizMessage[],
): Promise<string> {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skill, history }),
  });
  const data = await response.json();
  return data.message;
}

export function useQuizFlow({
  skills,
  onDone,
}: UseQuizFlowOptions): UseQuizFlowReturn {
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [history, setHistory] = useState<QuizMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<QuizRating[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);

  async function startSkill(skill: string, skillHistory: QuizMessage[]) {
    setLoading(true);
    setHistory(skillHistory);
    setQuestionCount(0);
    const message = await fetchQuizMessage(skill, skillHistory);
    setHistory([{ role: 'assistant', content: message }]);
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (skills.length > 0) {
        void startSkill(skills[0], []);
      } else {
        setDone(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [skills]);

  function handleRatingSuccess(
    parsed: ParsedQuizRating,
    nextHistory: QuizMessage[],
  ): void {
    const nextRatings = [
      ...ratings,
      {
        skill: skills[currentSkillIdx],
        rating: parsed.rating,
        feedback: parsed.feedback,
      },
    ];

    setRatings(nextRatings);
    setHistory([
      ...nextHistory,
      {
        role: 'assistant',
        content: `Rating: ${parsed.rating}/5 — ${parsed.feedback}`,
      },
    ]);

    window.setTimeout(() => {
      const nextIdx = currentSkillIdx + 1;
      if (nextIdx < skills.length) {
        setCurrentSkillIdx(nextIdx);
        void startSkill(skills[nextIdx], []);
      } else {
        setDone(true);
        onDone(nextRatings);
      }
    }, 2000);

    setLoading(false);
  }

  async function sendAnswer(): Promise<void> {
    if (!input.trim() || loading) {
      return;
    }

    const nextHistory: QuizMessage[] = [...history, { role: 'user', content: input }];
    setHistory(nextHistory);
    setInput('');
    setLoading(true);

    const nextQuestionCount = questionCount + 1;
    setQuestionCount(nextQuestionCount);

    const message = await fetchQuizMessage(skills[currentSkillIdx], nextHistory);
    const parsed = parseQuizRatingMessage(message);

    if (hasParsedRating(parsed)) {
      handleRatingSuccess(parsed, nextHistory);
      return;
    }

    if (nextQuestionCount >= 2) {
      const forcedMessage = await fetchQuizMessage(skills[currentSkillIdx], [
        ...nextHistory,
        { role: 'user', content: FORCE_RATING_MESSAGE },
      ]);
      const forcedParsed = parseQuizRatingMessage(forcedMessage);

      if (hasParsedRating(forcedParsed)) {
        handleRatingSuccess(forcedParsed, nextHistory);
        return;
      }
    }

    setHistory((previousHistory) => [
      ...previousHistory,
      { role: 'assistant', content: message },
    ]);
    setLoading(false);
  }

  return {
    currentSkillIdx,
    history,
    input,
    loading,
    ratings,
    done,
    setInput,
    sendAnswer,
  };
}

export { buildRatingsMap };
