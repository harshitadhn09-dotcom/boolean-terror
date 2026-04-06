'use client';

import type { CSSProperties, KeyboardEvent } from 'react';

interface QuizInputProps {
  input: string;
  loading: boolean;
  inputStyle: CSSProperties;
  buttonStyle: CSSProperties;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export default function QuizInput({
  input,
  loading,
  inputStyle,
  buttonStyle,
  onInputChange,
  onSubmit,
}: QuizInputProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      onSubmit();
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();

      const target = event.currentTarget;
      const selectionStart = target.selectionStart;
      const selectionEnd = target.selectionEnd;
      const nextValue =
        input.slice(0, selectionStart) + '  ' + input.slice(selectionEnd);

      onInputChange(nextValue);

      window.requestAnimationFrame(() => {
        target.selectionStart = selectionStart + 2;
        target.selectionEnd = selectionStart + 2;
      });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <textarea
          rows={6}
          style={{
            ...inputStyle,
            minHeight: '140px',
            resize: 'vertical',
            fontFamily:
              '"SFMono-Regular", "JetBrains Mono", "Fira Code", Consolas, monospace',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
          }}
          placeholder="Write your answer or paste code here..."
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button onClick={onSubmit} disabled={loading} style={buttonStyle}>
          Send
        </button>
      </div>
      <div
        style={{
          color: '#8b8b8b',
          fontSize: '12px',
          paddingLeft: '4px',
        }}
      >
        Press Enter for a new line, Tab to indent, and Cmd/Ctrl+Enter to send.
      </div>
    </div>
  );
}
