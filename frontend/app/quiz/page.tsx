'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}
interface Rating {
  skill: string;
  rating: number;
  feedback: string;
}

export default function QuizPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [done, setDone] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('quizSkills');
    if (!stored) {
      router.push('/setup');
      return;
    }
    const parsed = JSON.parse(stored).slice(0, 3);
    setSkills(parsed);
    startSkill(parsed[0], []);
  }, []);

  async function startSkill(skill: string, hist: Message[]) {
    setLoading(true);
    setHistory(hist);
    setQuestionCount(0);
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill, history: hist }),
    });
    const data = await res.json();
    setHistory([{ role: 'assistant', content: data.message }]);
    setLoading(false);
  }

  async function sendAnswer() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skill: skills[currentSkillIdx],
        history: newHistory,
      }),
    });
    const data = await res.json();
    const msg = data.message;

    // strip markdown code blocks if model wraps JSON in ```
    const cleaned = msg.replace(/```json|```/g, '').trim();

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // not JSON, try extracting JSON from within the text
      const match = cleaned.match(/\{[\s\S]*"rating"[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {}
      }
    }

    if (parsed?.rating) {
      const newRatings = [
        ...ratings,
        {
          skill: skills[currentSkillIdx],
          rating: parsed.rating,
          feedback: parsed.feedback,
        },
      ];
      setRatings(newRatings);
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Rating: ${parsed.rating}/5 — ${parsed.feedback}`,
        },
      ]);

      setTimeout(() => {
        const nextIdx = currentSkillIdx + 1;
        if (nextIdx < skills.length) {
          setCurrentSkillIdx(nextIdx);
          startSkill(skills[nextIdx], []);
        } else {
          saveRatings(newRatings);
        }
      }, 2000);

      setLoading(false);
      return;
    }

    // if we've hit 2 answers and still no rating, force it
    if (newCount >= 2) {
      const forceRes = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: skills[currentSkillIdx],
          history: [
            ...newHistory,
            {
              role: 'user',
              content:
                'Please now provide your rating as JSON only: {"rating": <1-5>, "feedback": "<one sentence>"}',
            },
          ],
        }),
      });
      const forceData = await forceRes.json();
      const forceCleaned = forceData.message.replace(/```json|```/g, '').trim();
      try {
        const forceParsed = JSON.parse(forceCleaned);
        if (forceParsed?.rating) {
          const newRatings = [
            ...ratings,
            {
              skill: skills[currentSkillIdx],
              rating: forceParsed.rating,
              feedback: forceParsed.feedback,
            },
          ];
          setRatings(newRatings);
          setHistory((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `Rating: ${forceParsed.rating}/5 — ${forceParsed.feedback}`,
            },
          ]);
          setTimeout(() => {
            const nextIdx = currentSkillIdx + 1;
            if (nextIdx < skills.length) {
              setCurrentSkillIdx(nextIdx);
              startSkill(skills[nextIdx], []);
            } else {
              saveRatings(newRatings);
            }
          }, 2000);
          setLoading(false);
          return;
        }
      } catch {}
    }

    setHistory((prev) => [...prev, { role: 'assistant', content: msg }]);
    setLoading(false);
  }

  async function saveRatings(finalRatings: Rating[]) {
    const userId = localStorage.getItem('userId');
    const skill_ratings: Record<string, number> = {};
    finalRatings.forEach((r) => {
      skill_ratings[r.skill] = r.rating;
    });

    await fetch('/api/quiz/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skill_ratings }),
    });

    localStorage.removeItem('quizSkills');
    setDone(true);
  }

  function Stars({ rating }: { rating: number }) {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              color: i <= rating ? '#52a447' : '#333',
              fontSize: '18px',
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  if (done)
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
          <h2
            style={{
              color: '#fff',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px',
            }}
          >
            Quiz Complete 🎉
          </h2>
          <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 28px' }}>
            Here's how you rated
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {ratings.map((r) => (
              <div
                key={r.skill}
                style={{
                  background: '#1a1a1a',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: '600' }}>
                    {r.skill}
                  </span>
                  <Stars rating={r.rating} />
                </div>
                <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                  {r.feedback}
                </p>
              </div>
            ))}
          </div>
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

  return (
    <main style={mainStyle}>
      <Navbar />
      <div style={{ width: '100%', maxWidth: '540px' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {skills.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  height: '3px',
                  width: '100%',
                  background: i <= currentSkillIdx ? '#52a447' : '#222',
                  borderRadius: '2px',
                  transition: 'all 0.3s',
                }}
              />
              <span
                style={{
                  color: i === currentSkillIdx ? '#fff' : '#555',
                  fontSize: '12px',
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div
          style={{
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
        >
          <AnimatePresence>
            {history.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  justifyContent:
                    msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    background: msg.role === 'user' ? '#52a447' : '#1a1a1a',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    maxWidth: '80%',
                    lineHeight: '1.5',
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{ color: '#555', fontSize: '13px' }}
            >
              thinking...
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{
              flex: 1,
              background: '#111',
              border: '1px solid #333',
              borderRadius: '10px',
              color: '#fff',
              padding: '12px 14px',
              fontSize: '14px',
              outline: 'none',
            }}
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
            disabled={loading}
          />
          <button
            onClick={sendAnswer}
            disabled={loading}
            style={{
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
          >
            Send
          </button>
        </div>
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
