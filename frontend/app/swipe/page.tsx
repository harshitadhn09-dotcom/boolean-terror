'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import MatchModal from '@/components/MatchModal';
import Navbar from '@/components/Navbar';

interface MatchUser {
  id: string;
  name: string;
  university: string;
  skills: string[];
  level: string;
  compatibilityScore: number;
  reasons: string[];
}

export default function SwipePage() {
  const router = useRouter();
  const [users, setUsers] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState<MatchUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          router.push('/setup');
          return;
        }
        const res = await fetch(`/api/match?userId=${userId}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  async function handleLike(targetId: string) {
    const userId = localStorage.getItem('userId');
    try {
      const res = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId }),
      });
      const data = await res.json();
      if (data.matched) {
        const matched = users.find((u) => u.id === targetId);
        if (matched) {
          setMatchedUser(matched);
          setShowModal(true);
        }
      }
    } catch (err) {
      console.error('Like failed', err);
    }
    removeUser(targetId);
  }

  function handlePass(targetId: string) {
    removeUser(targetId);
  }

  function removeUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) {
    return (
      <main style={mainStyle}>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ color: '#aaaaaa', fontSize: '16px' }}
        >
          Finding your matches...
        </motion.p>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <Navbar />
      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}
        >
          Dev<span style={{ color: '#52a447' }}>Match</span>
        </h1>
      </div>

      {/* Card Stack */}
      <div style={{ position: 'relative', width: '340px', height: '560px' }}>
        <AnimatePresence>
          {users.length > 0 ? (
            users.slice(0, 3).map((user, i) => (
              <motion.div
                key={user.id}
                style={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: 3 - i,
                  top: `${i * 8}px`,
                  scale: 1 - i * 0.03,
                  pointerEvents: i === 0 ? 'auto' : 'none',
                }}
                animate={{ scale: 1 - i * 0.03, top: i * 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {i === 0 ? (
                  <SwipeCard
                    user={user}
                    onLike={handleLike}
                    onPass={handlePass}
                  />
                ) : (
                  <div
                    style={{
                      background: '#111111',
                      border: '1px solid #222222',
                      borderRadius: '20px',
                      height: '480px',
                      width: '340px',
                    }}
                  />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '12px',
              }}
            >
              <p
                style={{
                  color: '#ffffff',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                You&apos;re all caught up!
              </p>
              <p style={{ color: '#aaaaaa', fontSize: '14px' }}>
                No more matches right now.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Match Modal */}
      {showModal && matchedUser && (
        <MatchModal user={matchedUser} onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}

const mainStyle: React.CSSProperties = {
  paddingTop: '72px',
  minHeight: '100vh',
  background: '#0a0a0a',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'sans-serif',
  position: 'relative',
};
