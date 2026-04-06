'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SlidingNav from '@/components/SlidingNav';
import BasicsStep from '@/components/profile-form/BasicsStep';
import InterestsStep from '@/components/profile-form/InterestsStep';
import SkillsStep from '@/components/profile-form/SkillsStep';
import { NAV_STEPS } from '@/components/profile-form/constants';
import {
  cardStyle,
  backButtonStyle,
  buttonRowStyle,
  headerStyle,
  inputStyle,
  nextButtonStyle,
} from '@/components/profile-form/styles';
import { buildRatingsMap, useQuizFlow } from '@/components/quiz/useQuizFlow';
import QuizChat from '@/components/quiz/QuizChat';
import QuizInput from '@/components/quiz/QuizInput';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizSummary from '@/components/quiz/QuizSummary';
import { saveDemoCredential } from '@/lib/demoAuth';
import { setStoredUserId } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { verifyGithub } from '@/lib/verifyGithub';
import type { ProfileFormState, QuizRating } from '@/types/user';

const INITIAL_FORM: ProfileFormState = {
  name: '',
  gender: '',
  university: '',
  skills: [],
  level: '',
  interests: [],
  linkedin: '',
  email: '',
  github: '',
  password: '',
  confirmPassword: '',
};

function EmbeddedQuizStep({
  skills,
  onBack,
  onComplete,
}: {
  skills: string[];
  onBack: () => void;
  onComplete: (ratings: Record<string, number>) => void;
}) {
  const [completedRatings, setCompletedRatings] = useState<QuizRating[]>([]);
  const { currentSkillIdx, done, history, input, loading, ratings, sendAnswer, setInput } =
    useQuizFlow({
      skills,
      onDone: (nextRatings) => {
        setCompletedRatings(nextRatings);
      },
    });

  if (done) {
    const summaryRatings = completedRatings.length > 0 ? completedRatings : ratings;

    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <h2 style={headerStyle}>Assessment Complete 🎉</h2>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <QuizSummary
            ratings={summaryRatings}
            title=""
            showNumericRating
          />
        </div>
        <div style={buttonRowStyle}>
          <button onClick={onBack} style={backButtonStyle}>
            ← Back
          </button>
          <button
            onClick={() => onComplete(buildRatingsMap(summaryRatings))}
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
      <QuizProgress
        currentSkillIdx={currentSkillIdx}
        skills={skills}
        marginBottom="16px"
      />
      <QuizChat
        history={history}
        loading={loading}
        loadingLabel="AI is thinking..."
        containerStyle={{
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
      />
      <QuizInput
        input={input}
        loading={loading}
        onInputChange={setInput}
        onSubmit={() => {
          void sendAnswer();
        }}
        inputStyle={{ ...inputStyle, flex: 1 }}
        buttonStyle={{
          background: '#52a447',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '0 20px',
          fontWeight: '600',
          cursor: 'pointer',
          opacity: loading ? 0.5 : 1,
        }}
      />
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

export default function ProfileForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [finalRatings, setFinalRatings] = useState<Record<string, number>>({});
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState<ProfileFormState>(INITIAL_FORM);

  function updateFormField<K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ): void {
    setForm((previousForm) => ({ ...previousForm, [key]: value }));
  }

  function toggleSkill(skill: string): void {
    if (form.skills.includes(skill)) {
      updateFormField(
        'skills',
        form.skills.filter((selectedSkill) => selectedSkill !== skill),
      );
      return;
    }

    if (form.skills.length < 3) {
      updateFormField('skills', [...form.skills, skill]);
    }
  }

  function toggleInterest(interest: string): void {
    updateFormField(
      'interests',
      form.interests.includes(interest)
        ? form.interests.filter(
            (selectedInterest) => selectedInterest !== interest,
          )
        : [...form.interests, interest],
    );
  }

  function handleNavChange(index: number): void {
    if (
      index > 0 &&
      (!form.name ||
        !form.email ||
        !form.level ||
        !form.password ||
        !form.confirmPassword)
    ) {
      alert('Please fill in all required basic info first.');
      return;
    }
    if (index > 0 && form.password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    if (index > 0 && form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (index > 1 && form.skills.length === 0) {
      alert('Please select at least one skill.');
      return;
    }
    setStep(index);
  }

  async function handleFinalSubmit(): Promise<void> {
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
      let usingDemoAuthFallback = false;
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
        const lowerMessage = signUpError.message.toLowerCase();
        if (lowerMessage.includes('rate limit')) {
          usingDemoAuthFallback = true;
        } else {
          setSubmitError(signUpError.message);
          return;
        }
      }

      let github_verified = false;
      if (form.github) {
        github_verified = await verifyGithub(form.github);
      }

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          password: undefined,
          confirmPassword: undefined,
          github_verified,
        }),
      });
      const data = await response.json();

      if (data.id) {
        if (usingDemoAuthFallback) {
          saveDemoCredential(form.email, form.password, data.id);
        }
        setStoredUserId(data.id);

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
        items={NAV_STEPS.map((item) => ({ label: item.label }))}
        activeIndex={step}
        onChange={handleNavChange}
      />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={cardStyle}
      >
        {step === 0 && (
          <BasicsStep
            form={form}
            onFieldChange={updateFormField}
            onNext={() => handleNavChange(1)}
          />
        )}

        {step === 1 && (
          <SkillsStep
            selectedSkills={form.skills}
            onToggleSkill={toggleSkill}
            onBack={() => handleNavChange(0)}
            onNext={() => handleNavChange(2)}
          />
        )}

        {step === 2 && (
          <EmbeddedQuizStep
            skills={form.skills.slice(0, 3)}
            onBack={() => handleNavChange(1)}
            onComplete={(ratings) => {
              setFinalRatings(ratings);
              handleNavChange(3);
            }}
          />
        )}

        {step === 3 && (
          <InterestsStep
            selectedInterests={form.interests}
            loadingSubmit={loadingSubmit}
            submitError={submitError}
            onToggleInterest={toggleInterest}
            onBack={() => handleNavChange(2)}
            onSubmit={() => {
              void handleFinalSubmit();
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
