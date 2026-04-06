'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyGithub } from '@/lib/verifyGithub';
import { supabase } from '@/lib/supabase';
import SlidingNav from '@/components/SlidingNav';

const SKILLS = [
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'TypeScript',
  'Go',
  'Rust',
  'Flutter',
  'ML/AI',
  'DevOps',
  'Figma',
  'SQL',
];
const INTERESTS = [
  'Web3',
  'AI/ML',
  'Open Source',
  'Gaming',
  'FinTech',
  'HealthTech',
  'EdTech',
  'SaaS',
];

const NAV_STEPS = [
  { label: 'Basics' },
  { label: 'Skills' },
  { label: 'Quiz' },
  { label: 'Interests' },
];

export default function ProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [finalRatings, setFinalRatings] = useState<Record<string, number>>({});
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    name: '',
    gender: '',
    university: '',
    skills: [] as string[],
    level: '',
    interests: [] as string[],
    linkedin: '',
    email: '',
    github: '',
    password: '',
    confirmPassword: '',
  });

  function handleNavChange(idx: number) {
    if (
      idx > 0 &&
      (!form.name ||
        !form.email ||
        !form.level ||
        !form.password ||
        !form.confirmPassword)
    ) {
      alert('Please fill in all required basic info first.');
      return;
    }
    if (idx > 0 && form.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (idx > 0 && form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (idx > 1 && form.skills.length === 0) {
      alert('Please select at least one skill.');
      return;
    }
    setStep(idx);
  }

  async function handleFinalSubmit() {
    setSubmitError('');

    if (form.password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
          },
        },
      });

      if (signUpError) {
        setSubmitError(signUpError.message);
        return;
      }

      let github_verified = false;
      if (form.github) {
        github_verified = await verifyGithub(form.github);
      }

      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          password: undefined,
          confirmPassword: undefined,
          github_verified,
        }),
      });
      const data = await res.json();

      if (data.id) {
        localStorage.setItem('userId', data.id);

        if (Object.keys(finalRatings).length > 0) {
          await fetch('/api/quiz/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.id,
              skill_ratings: finalRatings,
            }),
          });
        }
        router.push('/swipe');
      } else {
        setSubmitError(data.error || 'Something went wrong. Try again.');
      }
    } catch {
      setSubmitError('Network error. Try again.');
    } finally {
      setLoadingSubmit(false);
    }
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: step === 2 ? '540px' : '480px',
        margin: '0 auto',
        transition: 'max-width 0.3s',
      }}
    >
      <SlidingNav
        items={NAV_STEPS}
        activeIndex={step}
        onChange={handleNavChange}
      />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        {/* STEP 0: BASICS */}
        {step === 0 && (
          <>
            <h2 style={headerStyle}>The Basics</h2>
            <label style={labelStyle}>Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <label style={labelStyle}>Email *</label>
            <input
              style={inputStyle}
              type="text"
              inputMode="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <label style={labelStyle}>Password *</label>
            <input
              style={inputStyle}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <label style={labelStyle}>Confirm Password *</label>
            <input
              style={inputStyle}
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
            <p style={{ color: '#888', fontSize: '12px', margin: '-6px 0 8px' }}>
              Use at least 6 characters.
            </p>

            <label style={labelStyle}>Experience Level *</label>
            <select
              style={inputStyle}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <label style={labelStyle}>University</label>
            <input
              style={inputStyle}
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
            />

            <label style={labelStyle}>Gender</label>
            <select
              style={inputStyle}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
              <option>Prefer not to say</option>
            </select>

            <label style={labelStyle}>LinkedIn URL</label>
            <input
              style={inputStyle}
              placeholder="https://linkedin.com/in/you"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
            />

            <label style={labelStyle}>GitHub Username</label>
            <input
              style={inputStyle}
              placeholder="username"
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />

            <button onClick={() => handleNavChange(1)} style={buttonStyle}>
              Next: Skills →
            </button>
          </>
        )}

        {/* STEP 1: SKILLS */}
        {step === 1 && (
          <>
            <h2 style={headerStyle}>Your Skills</h2>
            <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 16px' }}>
              Select up to 3 core skills for your AI assessment.
            </p>
            <div style={chipContainerStyle}>
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    if (form.skills.includes(skill)) {
                      setForm({
                        ...form,
                        skills: form.skills.filter((s) => s !== skill),
                      });
                    } else if (form.skills.length < 3) {
                      setForm({ ...form, skills: [...form.skills, skill] });
                    }
                  }}
                  style={chipStyle(form.skills.includes(skill))}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div style={buttonRowStyle}>
              <button
                onClick={() => handleNavChange(0)}
                style={backButtonStyle}
              >
                ← Back
              </button>
              <button
                onClick={() => handleNavChange(2)}
                style={nextButtonStyle}
              >
                Start Assessment →
              </button>
            </div>
          </>
        )}

        {/* STEP 2: QUIZ */}
        {step === 2 && (
          <QuizStep
            skills={form.skills.slice(0, 3)}
            onBack={() => handleNavChange(1)}
            onComplete={(ratings) => {
              setFinalRatings(ratings);
              handleNavChange(3);
            }}
          />
        )}

        {/* STEP 3: INTERESTS */}
        {step === 3 && (
          <>
            <h2 style={headerStyle}>Your Interests</h2>
            <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 16px' }}>
              What do you want to build?
            </p>
            <div style={chipContainerStyle}>
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    setForm({
                      ...form,
                      interests: form.interests.includes(interest)
                        ? form.interests.filter((i) => i !== interest)
                        : [...form.interests, interest],
                    });
                  }}
                  style={chipStyle(form.interests.includes(interest))}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div style={buttonRowStyle}>
              <button
                onClick={() => handleNavChange(2)}
                style={backButtonStyle}
              >
                ← Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={loadingSubmit}
                style={nextButtonStyle}
              >
                {loadingSubmit ? 'Saving Profile...' : 'Finish Profile →'}
              </button>
            </div>
            {submitError && (
              <p style={{ color: '#ff8d8d', fontSize: '13px', marginTop: '14px' }}>
                {submitError}
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}

// --- Embedded Quiz Step Component ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
interface Rating {
  skill: string;
  rating: number;
  feedback: string;
}

interface ParsedQuizRating {
  rating: number;
  feedback: string;
}

function QuizStep({
  skills,
  onComplete,
  onBack,
}: {
  skills: string[];
  onComplete: (ratings: Record<string, number>) => void;
  onBack: () => void;
}) {
  const [currentSkillIdx, setCurrentSkillIdx] = useState(0);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);

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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (skills.length > 0) {
        startSkill(skills[0], []);
      } else {
        setDone(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [skills]);

  async function sendAnswer() {
    if (!input.trim() || loading) return;
    const newHistory: Message[] = [
      ...history,
      { role: 'user', content: input },
    ];
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
    const cleaned = msg.replace(/```json|```/g, '').trim();

    let parsed = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*"rating"[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {}
      }
    }

    if (parsed?.rating) {
      handleRatingSuccess(parsed, newHistory);
      return;
    }

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
          handleRatingSuccess(forceParsed, newHistory);
          return;
        }
      } catch {}
    }

    setHistory((prev) => [...prev, { role: 'assistant', content: msg }]);
    setLoading(false);
  }

  function handleRatingSuccess(
    parsed: ParsedQuizRating,
    newHistory: Message[],
  ) {
    const newRatings = [
      ...ratings,
      {
        skill: skills[currentSkillIdx],
        rating: parsed.rating,
        feedback: parsed.feedback,
      },
    ];
    setRatings(newRatings);
    setHistory([
      ...newHistory,
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
        setDone(true);
      }
    }, 2000);
    setLoading(false);
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <h2 style={headerStyle}>Assessment Complete 🎉</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '24px',
            marginBottom: '24px',
          }}
        >
          {ratings.map((r) => (
            <div
              key={r.skill}
              style={{
                background: '#1a1a1a',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}
              >
                <strong style={{ color: '#fff' }}>{r.skill}</strong>
                <span style={{ color: '#52a447' }}>{r.rating} / 5 ★</span>
              </div>
              <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
                {r.feedback}
              </p>
            </div>
          ))}
        </div>
        <div style={buttonRowStyle}>
          <button onClick={onBack} style={backButtonStyle}>
            ← Back
          </button>
          <button
            onClick={() => {
              const finalMap: Record<string, number> = {};
              ratings.forEach((r) => {
                finalMap[r.skill] = r.rating;
              });
              onComplete(finalMap);
            }}
            style={nextButtonStyle}
          >
            Next: Interests →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          height: '320px',
          overflowY: 'auto',
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
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  background: msg.role === 'user' ? '#52a447' : '#1a1a1a',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  maxWidth: '85%',
                  lineHeight: '1.5',
                }}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div style={{ color: '#555', fontSize: '13px', padding: '4px' }}>
            AI is thinking...
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{ ...inputStyle, flex: 1 }}
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
            padding: '0 20px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
      {/* Show back button during quiz so they can bail out if needed */}
      <div style={{ display: 'flex', marginTop: '24px' }}>
        <button
          onClick={onBack}
          style={{ ...backButtonStyle, flex: 'none', padding: '12px 24px' }}
        >
          ← Back
        </button>
      </div>
    </>
  );
}

// --- Shared Styles ---
const cardStyle: React.CSSProperties = {
  background: '#111111',
  border: '1px solid #222222',
  borderRadius: '20px',
  padding: '36px 32px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const headerStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '22px',
  fontWeight: '700',
  marginBottom: '8px',
};

const labelStyle: React.CSSProperties = {
  color: '#aaaaaa',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginTop: '12px',
};

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '10px',
  color: '#ffffff',
  padding: '12px 14px',
  fontSize: '15px',
  width: '100%',
  outline: 'none',
};

const chipContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '6px',
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#52a447' : '#1a1a1a',
  border: `1px solid ${active ? '#52a447' : '#333'}`,
  color: '#ffffff',
  borderRadius: '20px',
  padding: '6px 14px',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.15s',
});

// --- Button Styles ---
const buttonStyle: React.CSSProperties = {
  marginTop: '24px',
  background: '#52a447',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(82,164,71,0.2)',
  width: '100%',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginTop: '24px',
};

const backButtonStyle: React.CSSProperties = {
  flex: 1,
  background: '#1a1a1a',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
};

const nextButtonStyle: React.CSSProperties = {
  flex: 2,
  background: '#52a447',
  border: 'none',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  boxShadow: '0 0 20px rgba(82,164,71,0.2)',
};
