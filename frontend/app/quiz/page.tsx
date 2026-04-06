'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import QuizChat from '@/components/quiz/QuizChat';
import QuizInput from '@/components/quiz/QuizInput';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizSummary from '@/components/quiz/QuizSummary';
import { buildRatingsMap, useQuizFlow } from '@/components/quiz/useQuizFlow';
import {
  clearStoredQuizSkills,
  getStoredQuizSkills,
  getStoredUserId,
} from '@/lib/storage';
import type { QuizRating } from '@/types/user';

export default function QuizPage() {
  const router = useRouter();
  const [skills] = useState<string[]>(() => {
    return getStoredQuizSkills()?.slice(0, 3) ?? [];
  });
  const [doneRatings, setDoneRatings] = useState<QuizRating[]>([]);
  const { currentSkillIdx, done, history, input, loading, ratings, sendAnswer, setInput } =
    useQuizFlow({
      skills,
      onDone: (finalRatings) => {
        void saveRatings(finalRatings);
      },
    });

  useEffect(() => {
    if (skills.length === 0) {
      router.push('/setup');
    }
  }, [router, skills.length]);

  async function saveRatings(finalRatings: QuizRating[]): Promise<void> {
    const userId = getStoredUserId();
    const skill_ratings = buildRatingsMap(finalRatings);

    await fetch('/api/quiz/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skill_ratings }),
    });

    clearStoredQuizSkills();
    setDoneRatings(finalRatings);
  }

  if (done) {
    return (
      <main style={mainStyle}>
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#111',
            border: '1px solid #222',
            borderRadius: '20px',
            padding: '40px 32px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <QuizSummary
            ratings={doneRatings.length > 0 ? doneRatings : ratings}
            title="Quiz Complete 🎉"
            subtitle="Here's how you rated"
          />
          <button
            onClick={() => router.push('/swipe')}
            style={{
              background: '#52a447',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '13px 32px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Start Swiping →
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: '540px' }}>
        <QuizProgress
          currentSkillIdx={currentSkillIdx}
          skills={skills}
          marginBottom="24px"
        />
        <QuizChat
          history={history}
          loading={loading}
          loadingLabel="thinking..."
          containerStyle={{
            background: '#111',
            border: '1px solid #222',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '320px',
            marginBottom: '16px',
          }}
        />
        <QuizInput
          input={input}
          loading={loading}
          onInputChange={setInput}
          onSubmit={() => {
            void sendAnswer();
          }}
          inputStyle={{
            flex: 1,
            background: '#111',
            border: '1px solid #333',
            borderRadius: '10px',
            color: '#fff',
            padding: '12px 14px',
            fontSize: '14px',
            outline: 'none',
          }}
          buttonStyle={{
            background: '#52a447',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        />
      </div>
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0a0a0a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
  padding: '80px 24px 32px',
  position: 'relative',
};
