'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import type { QuizMessage } from '@/types/user';

interface QuizChatProps {
  history: QuizMessage[];
  loading: boolean;
  containerStyle: CSSProperties;
  loadingLabel: string;
}

function renderInlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <code
          key={`${segment}-${index}`}
          style={{
            fontFamily:
              '"SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '2px 6px',
            fontSize: '0.95em',
          }}
        >
          {segment.slice(1, -1)}
        </code>
      );
    }

    return <span key={`${segment}-${index}`}>{segment}</span>;
  });
}

function renderMessageContent(content: string, role: QuizMessage['role']) {
  const segments = content.split(/```(\w+)?\n?([\s\S]*?)```/g);

  return segments
    .map((segment, index) => {
      if (index % 3 === 1) {
        return null;
      }

      if (index % 3 === 2) {
        return (
          <pre
            key={`code-${index}`}
            style={{
              margin: '10px 0',
              padding: '12px 14px',
              borderRadius: '10px',
              background: role === 'user' ? 'rgba(0, 0, 0, 0.22)' : '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.08)',
              overflowX: 'auto',
              fontSize: '13px',
              lineHeight: 1.6,
              fontFamily:
                '"SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace',
            }}
          >
            <code>{segment.trim()}</code>
          </pre>
        );
      }

      return segment
        .split('\n')
        .filter((line, lineIndex, lines) => line.trim().length > 0 || lines.length === 1)
        .map((line, lineIndex) => (
          <p
            key={`text-${index}-${lineIndex}`}
            style={{
              margin: lineIndex === 0 ? '0' : '8px 0 0 0',
              whiteSpace: 'pre-wrap',
            }}
          >
            {renderInlineCode(line)}
          </p>
        ));
    })
    .filter(Boolean);
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
                borderRadius: '14px',
                padding: '12px 14px',
                fontSize: '14px',
                maxWidth: '85%',
                lineHeight: '1.5',
                boxShadow:
                  message.role === 'assistant'
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.04)'
                    : 'none',
              }}
            >
              {renderMessageContent(message.content, message.role)}
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
