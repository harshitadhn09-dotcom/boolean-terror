'use client';

import { GithubVerifiedBadge, ContactButton } from '@/components/match/shared';
import type { MatchedUser } from '@/types/user';

const linkedinButtonStyle = {
  display: 'block',
  background: '#0077b5',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const emailButtonStyle = {
  display: 'block',
  background: '#52a447',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

export default function SelectedMatchPanel({
  selected,
}: {
  selected: MatchedUser | null;
}) {
  if (!selected) {
    return (
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
    );
  }

  return (
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

        {selected.github_verified ? (
          <GithubVerifiedBadge marginTop="8px" />
        ) : null}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {selected.skills.map((skill) => (
          <span
            key={skill}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '13px',
            }}
          >
            {
              // TODO: Refactor - skill chips currently preserve the original nested ratings markup to avoid changing rendered behavior.
              selected.skill_ratings &&
                Object.keys(selected.skill_ratings).length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <p
                      style={{
                        color: '#aaaaaa',
                        fontSize: '12px',
                        margin: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      Skill Ratings
                    </p>
                    {Object.entries(selected.skill_ratings).map(([key, rating]) => (
                      <div
                        key={key}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ color: '#fff', fontSize: '13px' }}>
                          {key}
                        </span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((index) => (
                            <span
                              key={index}
                              style={{
                                color: index <= rating ? '#52a447' : '#333',
                                fontSize: '16px',
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
            }{' '}
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
        {selected.linkedin ? (
          <ContactButton
            href={selected.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={linkedinButtonStyle}
          >
            Open LinkedIn
          </ContactButton>
        ) : null}
        {selected.email ? (
          <ContactButton
            href={`mailto:${selected.email}`}
            style={emailButtonStyle}
          >
            Send Email
          </ContactButton>
        ) : null}
        {!selected.linkedin && !selected.email ? (
          <p style={{ color: '#555', fontSize: '14px' }}>
            No contact info available.
          </p>
        ) : null}
      </div>

      <p style={{ color: '#333', fontSize: '13px', marginTop: 'auto' }}>
        💬 Messaging coming soon
      </p>
    </div>
  );
}
