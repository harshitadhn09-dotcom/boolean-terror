'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeHero from '@/components/home/HomeHero';
import LoginPanel from '@/components/home/LoginPanel';
import PixelSnow from '@/components/PixelSnow';
import { findDemoCredential } from '@/lib/demoAuth';
import { setStoredUserId } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(): Promise<void> {
    setErr('');

    if (!email || !password) {
      setErr('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const demoCredential = findDemoCredential(email, password);
        if (demoCredential) {
          setStoredUserId(demoCredential.userId);
          router.push('/swipe');
          return;
        }

        setErr(error.message);
        return;
      }

      const accountEmail = authData.user.email;
      if (!accountEmail) {
        setErr('Login succeeded, but no email was returned.');
        return;
      }

      const response = await fetch(
        `/api/user?email=${encodeURIComponent(accountEmail)}`,
      );
      const data = await response.json();
      if (data?.id) {
        setStoredUserId(data.id);
        router.push('/swipe');
      } else {
        setErr('Account found, but profile setup is incomplete.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <PixelSnow
          color="#26a269"
          variant="round"
          brightness={3}
          flakeSize={0.022}
          pixelResolution={500}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <HomeHero />
        <LoginPanel
          email={email}
          password={password}
          err={err}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onGetStarted={() => router.push('/setup')}
          onLogin={() => {
            void handleLogin();
          }}
        />
      </div>
    </main>
  );
}
