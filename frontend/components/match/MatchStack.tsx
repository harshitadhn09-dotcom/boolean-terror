'use client';

import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import type { MatchUser } from '@/types/user';

interface MatchStackProps {
  users: MatchUser[];
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

export default function MatchStack({
  users,
  onLike,
  onPass,
}: MatchStackProps) {
  return (
    <div style={{ position: 'relative', width: '340px', height: '560px' }}>
      <AnimatePresence>
        {users.length > 0 ? (
          users.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.id}
              style={{
                position: 'absolute',
                width: '100%',
                zIndex: 3 - index,
                top: `${index * 8}px`,
                scale: 1 - index * 0.03,
                pointerEvents: index === 0 ? 'auto' : 'none',
              }}
              animate={{ scale: 1 - index * 0.03, top: index * 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {index === 0 ? (
                <SwipeCard user={user} onLike={onLike} onPass={onPass} />
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
  );
}
