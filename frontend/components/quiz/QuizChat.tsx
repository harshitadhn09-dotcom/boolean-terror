'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties } from 'react';
import type { QuizMessage } from '@/types/user';

interface QuizChatProps {
  history: QuizMessage[];
  loading: boolean;
  containerStyle: CSSProperties;
  loadingLabel: string;
}

export default function QuizChat({
  history,
  loading,
  containerStyle,
  loadingLabel,
}: QuizChatProps) {
  return (
    <div style={containerStyle}>
      <AnimatePresence>
        {history.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent:
                message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                background: message.role === 'user' ? '#52a447' : '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '14px',
                maxWidth: '85%',
                lineHeight: '1.5',
              }}
            >
              {message.content}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {loading && (
        <div style={{ color: '#555', fontSize: '13px', padding: '4px' }}>
          {loadingLabel}
        </div>
      )}
    </div>
  );
}
