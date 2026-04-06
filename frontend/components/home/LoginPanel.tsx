'use client';

import { motion } from 'framer-motion';

interface LoginPanelProps {
  email: string;
  password: string;
  err: string;
  loading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LoginPanel({
  email,
  password,
  err,
  loading,
  onEmailChange,
  onPasswordChange,
  onGetStarted,
  onLogin,
}: LoginPanelProps) {
  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onGetStarted}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
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
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </div>
          <button
            onClick={onLogin}
            disabled={loading}
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid #52a447',
              color: '#52a447',
              borderRadius: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging In...' : 'Login'}
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
    </>
  );
}
