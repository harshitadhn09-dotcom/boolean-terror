'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PixelSnow from '@/components/PixelSnow'; // <-- Import PixelSnow

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
      {/* React Bits Pixel Snow Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <PixelSnow
          color="#26a269"
          variant="round"
          brightness={3}
          flakeSize={0.022}
          pixelResolution={500}
        />
      </div>

      {/* Main Content */}
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
        {/* GREEN 'A' MATCHA LOGO */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '84px',
            fontWeight: '900',
            margin: 0,
            letterSpacing: '-3px',
            textAlign: 'center',
          }}
        >
          {/* Note: Keeping these on the same line prevents weird spacing! */}
          <span
            style={{
              color: '#ffffff',
              textShadow:
                '0px 4px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.2)',
            }}
          >
            Match
          </span>
          <span
            style={{
              color: '#52a447',
              textShadow:
                '0px 4px 8px rgba(0,0,0,0.9), 0 0 20px rgba(82,164,71,0.4)',
            }}
          >
            a
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            color: '#e0e0e0',
            fontSize: '18px',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
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
            background: '#52a447',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(82,164,71,0.6)',
          }}
        >
          Get Started
        </motion.button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: '#aaa',
              fontSize: '13px',
              marginTop: '16px',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Already have a profile?
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                color: '#fff',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '14px',
                width: '220px',
                outline: 'none',
              }}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleLogin}
              style={{
                background: 'rgba(10, 10, 10, 0.8)',
                border: '1px solid #52a447',
                color: '#52a447',
                borderRadius: '10px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Login
            </button>
          </div>
          {err && (
            <p
              style={{
                color: '#8dfc7c',
                fontSize: '13px',
                marginTop: '12px',
                fontWeight: '600',
              }}
            >
              {err}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
