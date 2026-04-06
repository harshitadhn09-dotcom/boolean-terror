'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import MatchModal from '@/components/MatchModal';
import MatchStack from '@/components/match/MatchStack';
import Navbar from '@/components/Navbar';
import { getStoredUserId } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import type { MatchUser } from '@/types/user';

export default function SwipePage() {
  const router = useRouter();
  const [users, setUsers] = useState<MatchUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState<MatchUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrefsModal, setShowPrefsModal] = useState(false);
  const [prefsForm, setPrefsForm] = useState({ hackathon_type: '', availability: '', email: '' });

  useEffect(() => {
    async function initialize(): Promise<void> {
      try {
        const userId = getStoredUserId();
        if (!userId) {
          router.push('/setup');
          return;
        }

        const { data: user } = await supabase
          .from('users')
          .select('hackathon_type, availability, email')
          .eq('id', userId)
          .single();

        if (user && !user.hackathon_type) {
          setPrefsForm({ hackathon_type: '', availability: '', email: user.email });
          setShowPrefsModal(true);
          setLoading(false);
          return;
        }

        await fetchMatches(userId);
      } catch (error) {
        console.error('Failed to initialize', error);
        setLoading(false);
      }
    }

    void initialize();
  }, [router]);

  async function fetchMatches(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/match?userId=${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch matches', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePrefs(): Promise<void> {
    if (!prefsForm.hackathon_type) {
      alert('Please select a hackathon type');
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefsForm),
      });
      setShowPrefsModal(false);
      
      const userId = getStoredUserId();
      if (userId) await fetchMatches(userId);
    } catch (error) {
      console.error('Failed to save preferences', error);
      setLoading(false);
    }
  }

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
          Loading...
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
        <h1 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: 0 }}>
          Match<span style={{ color: '#52a447' }}>a</span>
        </h1>
      </div>

      <MatchStack users={users} onLike={handleLike} onPass={handlePass} />

      {showModal && matchedUser ? (
        <MatchModal user={matchedUser} onClose={() => setShowModal(false)} />
      ) : null}

      {showPrefsModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px', marginTop: 0 }}>
              Hackathon Preferences
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Hackathon Type *</label>
              <select
                style={inputStyle}
                value={prefsForm.hackathon_type}
                onChange={(e) => setPrefsForm({ ...prefsForm, hackathon_type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value="online">Online</option>
                <option value="offline">In-person</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={labelStyle}>Availability Date & Time (Optional)</label>
              <input
                style={inputStyle}
                type="datetime-local"
                value={prefsForm.availability}
                onChange={(e) => setPrefsForm({ ...prefsForm, availability: e.target.value })}
              />
            </div>

            <button onClick={() => void handleSavePrefs()} style={buttonStyle}>
              Save & Find Matches
            </button>
          </div>
        </div>
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

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const modalContentStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid #333',
  borderRadius: '16px',
  padding: '32px',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #333',
  background: '#000',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  color: '#aaa',
  fontSize: '14px',
  fontWeight: '500',
};

const buttonStyle: React.CSSProperties = {
  background: '#52a447',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '14px 24px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '8px',
};