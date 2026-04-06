'use client';

import type { MatchedUser } from '@/types/user';

interface MatchListProps {
  matches: MatchedUser[];
  selected: MatchedUser | null;
  onSelect: (match: MatchedUser) => void;
}

export default function MatchList({
  matches,
  selected,
  onSelect,
}: MatchListProps) {
  return (
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
      {matches.map((match) => (
        <div
          key={match.id}
          onClick={() => onSelect(match)}
          style={{
            background: selected?.id === match.id ? '#1a1a1a' : '#111111',
            border: `1px solid ${selected?.id === match.id ? '#52a447' : '#222'}`,
            borderRadius: '12px',
            padding: '16px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <p style={{ color: '#fff', fontWeight: '600', margin: 0 }}>
            {match.name}
          </p>
          <p style={{ color: '#aaaaaa', fontSize: '13px', margin: '4px 0 0' }}>
            {match.university}
          </p>
        </div>
      ))}
    </div>
  );
}
