'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MatchList from '@/components/match/MatchList';
import SelectedMatchPanel from '@/components/match/SelectedMatchPanel';
import Navbar from '@/components/Navbar';
import { getStoredUserId } from '@/lib/storage';
import type { MatchedUser } from '@/types/user';

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [selected, setSelected] = useState<MatchedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches(): Promise<void> {
      const userId = getStoredUserId();
      if (!userId) {
        router.push('/setup');
        return;
      }

      const response = await fetch(`/api/matches?userId=${userId}`);
      const data = await response.json();
      setMatches(data);
      if (data.length > 0) {
        setSelected(data[0]);
      }
      setLoading(false);
    }

    void fetchMatches();
  }, [router]);

  if (loading) {
    return (
      <main style={mainStyle}>
        <p style={{ color: '#aaaaaa' }}>Loading matches...</p>
      </main>
    );
  }

  return (
    <main style={mainStyle}>
      <Navbar />
      <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}
        >
          Match<span style={{ color: '#52a447' }}>a</span>
        </h1>
      </div>

      <div
        style={{
          display: 'flex',
          width: '100%',
          maxWidth: '900px',
          gap: '24px',
          marginTop: '40px',
        }}
      >
        <MatchList matches={matches} selected={selected} onSelect={setSelected} />
        <SelectedMatchPanel selected={selected} />
      </div>

      <button
        onClick={() => router.push('/swipe')}
        style={{
          position: 'absolute',
          top: '24px',
          right: '32px',
          background: 'transparent',
          border: '1px solid #333',
          color: '#aaa',
          borderRadius: '10px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        ← Keep Swiping
      </button>
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
  padding: '80px 32px 32px',
};
