'use client';

import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import { useState } from 'react';

interface MatchUser {
  id: string;
  name: string;
  university: string;
  skills: string[];
  level: string;
  compatibilityScore: number;
  reasons: string[];
}

interface SwipeCardProps {
  user: MatchUser;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

export default function SwipeCard({ user, onLike, onPass }: SwipeCardProps) {
  const [gone, setGone] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const passOpacity = useTransform(x, [-80, 0], [1, 0]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 100) {
      setDirection('right');
      setGone(true);
      onLike(user.id);
    } else if (info.offset.x < -100) {
      setDirection('left');
      setGone(true);
      onPass(user.id);
    }
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          style={{
            x,
            rotate,
            opacity,
            position: 'absolute',
            width: '340px',
            cursor: 'grab',
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{
            x: direction === 'right' ? 400 : -400,
            opacity: 0,
            transition: { duration: 0.3 },
          }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {/* LIKE stamp */}
          <motion.div
            style={{
              opacity: likeOpacity,
              position: 'absolute',
              top: '24px',
              left: '24px',
              border: '3px solid #00e676',
              color: '#00e676',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '22px',
              fontWeight: '700',
              zIndex: 10,
              transform: 'rotate(-15deg)',
            }}
          >
            LIKE
          </motion.div>

          {/* PASS stamp */}
          <motion.div
            style={{
              opacity: passOpacity,
              position: 'absolute',
              top: '24px',
              right: '24px',
              border: '3px solid #ff1744',
              color: '#ff1744',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '22px',
              fontWeight: '700',
              zIndex: 10,
              transform: 'rotate(15deg)',
            }}
          >
            PASS
          </motion.div>

          {/* Card */}
          <div
            style={{
              background: '#111111',
              border: '1px solid #222222',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              userSelect: 'none',
            }}
          >
            {/* Name + University */}
            <div>
              <h2
                style={{
                  color: '#ffffff',
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '600',
                }}
              >
                {user.name}
              </h2>
              <p
                style={{
                  color: '#aaaaaa',
                  margin: '4px 0 0',
                  fontSize: '14px',
                }}
              >
                {user.university}
              </p>
            </div>

            {/* Compatibility Score */}
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <span
                style={{
                  fontSize: '56px',
                  fontWeight: '700',
                  color: '#52a447',
                  lineHeight: 1,
                }}
              >
                {user.compatibilityScore}%
              </span>
              <p
                style={{
                  color: '#aaaaaa',
                  margin: '4px 0 0',
                  fontSize: '13px',
                }}
              >
                compatibility
              </p>
            </div>

            {/* Skills */}
            <div>
              <p
                style={{
                  color: '#aaaaaa',
                  fontSize: '12px',
                  margin: '0 0 8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Skills
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid #333',
                      color: '#ffffff',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '13px',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <p
                style={{
                  color: '#aaaaaa',
                  fontSize: '12px',
                  margin: '0 0 4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Experience
              </p>
              <p
                style={{
                  color: '#ffffff',
                  margin: 0,
                  fontSize: '15px',
                  textTransform: 'capitalize',
                }}
              >
                {user.level}
              </p>
            </div>

            {/* Reasons */}
            <div style={{ borderTop: '1px solid #222', paddingTop: '12px' }}>
              {user.reasons.map((r, i) => (
                <p
                  key={i}
                  style={{
                    color: '#aaaaaa',
                    margin: '4px 0',
                    fontSize: '13px',
                  }}
                >
                  ✦ {r}
                </p>
              ))}
            </div>

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                marginTop: '8px',
              }}
            >
              <button
                onClick={() => {
                  setDirection('left');
                  setGone(true);
                  onPass(user.id);
                }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  color: '#ff1744',
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
              <button
                onClick={() => {
                  setDirection('right');
                  setGone(true);
                  onLike(user.id);
                }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#52a447',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '22px',
                  cursor: 'pointer',
                }}
              >
                ♥
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
