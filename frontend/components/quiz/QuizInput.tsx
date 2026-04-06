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
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      onSubmit();
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        style={inputStyle}
        placeholder="Type your answer..."
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button onClick={onSubmit} disabled={loading} style={buttonStyle}>
        Send
      </button>
    </div>
  );
}
