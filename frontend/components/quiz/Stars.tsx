'use client';

interface StarsProps {
  rating: number;
  size: string;
  gap: string;
}

export default function Stars({ rating, size, gap }: StarsProps) {
  return (
    <div style={{ display: 'flex', gap }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          style={{
            color: index <= rating ? '#52a447' : '#333',
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
