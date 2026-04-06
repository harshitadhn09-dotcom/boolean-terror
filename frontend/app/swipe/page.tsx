'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MatchModal from '@/components/MatchModal';
import MatchStack from '@/components/match/MatchStack';
import Navbar from '@/components/Navbar';
import { getStoredUserId } from '@/lib/storage';
import type { MatchUser } from '@/types/user';

export default function SwipePage() {
  const router = useRouter();
  const [users, setUsers] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState<MatchUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchMatches(): Promise<void> {
      try {
        const userId = getStoredUserId();
        if (!userId) {
          router.push('/setup');
          return;
        }

        const response = await fetch(`/api/match?userId=${userId}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch matches', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchMatches();
  }, [router]);

  async function handleLike(targetId: string): Promise<void> {
    const userId = getStoredUserId();
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId }),
      });
      const data = await response.json();
      if (data.matched) {
        const matched = users.find((user) => user.id === targetId);
        if (matched) {
          setMatchedUser(matched);
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Like failed', error);
    }

    removeUser(targetId);
  }

  function handlePass(targetId: string): void {
    removeUser(targetId);
  }

  function removeUser(id: string): void {
    setUsers((previousUsers) => previousUsers.filter((user) => user.id !== id));
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
          Match<span style={{ color: '#52a447' }}>a</span>
        </h1>
      </div>

      <MatchStack users={users} onLike={handleLike} onPass={handlePass} />

      {showModal && matchedUser ? (
        <MatchModal user={matchedUser} onClose={() => setShowModal(false)} />
      ) : null}
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
