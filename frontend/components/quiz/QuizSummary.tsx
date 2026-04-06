'use client';

import type { QuizRating } from '@/types/user';
import Stars from '@/components/quiz/Stars';

interface QuizSummaryProps {
  ratings: QuizRating[];
  title?: string;
  subtitle?: string;
  showNumericRating?: boolean;
}

export default function QuizSummary({
  ratings,
  title,
  subtitle,
  showNumericRating = false,
}: QuizSummaryProps) {
  return (
    <>
      {title ? (
        <h2
          style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px',
          }}
        >
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 28px' }}>
          {subtitle}
        </p>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {ratings.map((rating) => (
          <div
            key={rating.skill}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
              }}
            >
              <span style={{ color: '#fff', fontWeight: '600' }}>
                {rating.skill}
              </span>
              {showNumericRating ? (
                <span style={{ color: '#52a447' }}>{rating.rating} / 5 ★</span>
              ) : (
                <Stars rating={rating.rating} size="18px" gap="4px" />
              )}
            </div>
            <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
              {rating.feedback}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
