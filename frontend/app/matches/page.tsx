'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface MatchedUser {
  id: string;
  name: string;
  university: string;
  skills: string[];
  level: string;
  linkedin: string;
  email: string;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [selected, setSelected] = useState<MatchedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.push('/setup');
        return;
      }

      const res = await fetch(`/api/matches?userId=${userId}`);
      const data = await res.json();
      setMatches(data);
      if (data.length > 0) setSelected(data[0]);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  if (loading)
    return (
      <main style={mainStyle}>
        <p style={{ color: '#aaaaaa' }}>Loading matches...</p>
      </main>
    );

  return (
    <main style={mainStyle}>
      <Navbar />
      {/* Header */}
      <div style={{ position: 'absolute', top: '24px', left: '32px' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '700',
            margin: 0,
          }}
        >
          Dev<span style={{ color: '#52a447' }}>Match</span>
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
        {/* Left — match list */}
        <div
          style={{
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <p
            style={{
              color: '#aaaaaa',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0,
            }}
          >
            Your Matches ({matches.length})
          </p>
          {matches.length === 0 && (
            <p style={{ color: '#555', fontSize: '14px' }}>
              No matches yet. Keep swiping!
            </p>
          )}
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={() => setSelected(m)}
              style={{
                background: selected?.id === m.id ? '#1a1a1a' : '#111111',
                border: `1px solid ${selected?.id === m.id ? '#52a447' : '#222'}`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <p style={{ color: '#fff', fontWeight: '600', margin: 0 }}>
                {m.name}
              </p>
              <p
                style={{
                  color: '#aaaaaa',
                  fontSize: '13px',
                  margin: '4px 0 0',
                }}
              >
                {m.university}
              </p>
            </div>
          ))}
        </div>

        {/* Right — contact panel */}
        {selected ? (
          <div
            style={{
              flex: 1,
              background: '#111111',
              border: '1px solid #222',
              borderRadius: '20px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <h2
                style={{
                  color: '#fff',
                  fontSize: '26px',
                  fontWeight: '700',
                  margin: 0,
                }}
              >
                {selected.name}
              </h2>
              <p style={{ color: '#aaaaaa', margin: '4px 0 0' }}>
                {selected.university}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selected.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '13px',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <p
              style={{
                color: '#aaaaaa',
                fontSize: '14px',
                margin: 0,
                textTransform: 'capitalize',
              }}
            >
              Level: <span style={{ color: '#fff' }}>{selected.level}</span>
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '8px',
              }}
            >
              {selected.linkedin && (
                <a
                  href={selected.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkedinBtn}
                >
                  Open LinkedIn
                </a>
              )}
              {selected.email && (
                <a href={`mailto:${selected.email}`} style={emailBtn}>
                  Send Email
                </a>
              )}
              {!selected.linkedin && !selected.email && (
                <p style={{ color: '#555', fontSize: '14px' }}>
                  No contact info available.
                </p>
              )}
            </div>

            <p style={{ color: '#333', fontSize: '13px', marginTop: 'auto' }}>
              💬 Messaging coming soon
            </p>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ color: '#555' }}>Select a match to view contact info</p>
          </div>
        )}
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

const linkedinBtn: React.CSSProperties = {
  display: 'block',
  background: '#0077b5',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
};

const emailBtn: React.CSSProperties = {
  display: 'block',
  background: '#52a447',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center',
};
