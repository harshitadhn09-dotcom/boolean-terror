'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  async function handleLogin() {
    const res = await fetch(`/api/user?email=${email}`);
    const data = await res.json();
    if (data?.id) {
      localStorage.setItem('userId', data.id);
      router.push('/swipe');
    } else {
      setErr('No account found.');
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        fontFamily: 'sans-serif',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          fontSize: '64px',
          fontWeight: '700',
          color: '#ffffff',
          margin: 0,
          letterSpacing: '-2px',
        }}
      >
        Dev<span style={{ color: '#ff2e88' }}>Match</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ color: '#aaaaaa', fontSize: '18px', margin: 0 }}
      >
        Find your perfect hackathon teammate
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push('/setup')}
        style={{
          marginTop: '16px',
          padding: '14px 40px',
          background: '#ff2e88',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 0 24px rgba(255,46,136,0.4)',
        }}
      >
        Get Started
      </motion.button>

      <p style={{ color: '#555', fontSize: '13px', marginTop: '16px' }}>
        Already have a profile?
      </p>
      <input
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          color: '#fff',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '14px',
          width: '260px',
          outline: 'none',
        }}
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleLogin}
        style={{
          background: 'transparent',
          border: '1px solid #ff2e88',
          color: '#ff2e88',
          borderRadius: '10px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Login
      </button>
      {err && <p style={{ color: '#ff2e88', fontSize: '13px' }}>{err}</p>}
    </main>
  );
}
