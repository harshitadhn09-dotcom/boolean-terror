'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MatchUser {
  id: string;
  name: string;
  university: string;
  compatibilityScore: number;
  linkedin?: string;
  email?: string;
  github_verified?: boolean;
}

interface MatchModalProps {
  user: MatchUser;
  onClose: () => void;
}

export default function MatchModal({ user, onClose }: MatchModalProps) {
  const router = useRouter();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111111',
          border: '1px solid #222222',
          borderRadius: '24px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '360px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            color: '#ffffff',
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
          }}
        >
          It&apos;s a Match! 🎉
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center' }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#52a447',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            You
          </div>

          <span style={{ color: '#52a447', fontSize: '24px' }}>♥</span>

          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '700',
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0,
            }}
          >
            {user.name}
          </p>
          <p style={{ color: '#aaaaaa', fontSize: '14px', margin: '4px 0 0' }}>
            {user.university}
          </p>

          {user.github_verified && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#1a1a1a',
                border: '1px solid #b8860b',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '12px',
                color: '#ffd700',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                width: 'fit-content',
                marginTop: '8px',
              }}
            >
              GITHUB VERIFIED
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          style={{
            background: '#1a1a1a',
            border: '1px solid #333333',
            borderRadius: '12px',
            padding: '12px 32px',
          }}
        >
          <p
            style={{
              color: '#52a447',
              fontSize: '36px',
              fontWeight: '700',
              margin: 0,
            }}
          >
            {user.compatibilityScore}%
          </p>
          <p style={{ color: '#aaaaaa', fontSize: '13px', margin: '4px 0 0' }}>
            compatibility
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          {user.linkedin ? (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                background: '#0077b5',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Open LinkedIn
            </a>
          ) : null}

          {user.email ? (
            <a
              href={`mailto:${user.email}`}
              style={{
                display: 'block',
                background: '#52a447',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Send Email
            </a>
          ) : null}

          <button
            onClick={() => router.push('/matches')}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333333',
              color: '#aaaaaa',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '15px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            View All Matches
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#555555',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            Keep Swiping
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
