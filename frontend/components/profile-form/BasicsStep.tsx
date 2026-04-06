'use client';

import { EXPERIENCE_LEVEL_OPTIONS } from '@/lib/constants';
import type { BasicsStepProps } from '@/components/profile-form/types';
import {
  buttonStyle,
  headerStyle,
  inputStyle,
  labelStyle,
} from '@/components/profile-form/styles';

export default function BasicsStep({
  form,
  onFieldChange,
  onNext,
}: BasicsStepProps) {
  return (
    <>
      <h2 style={headerStyle}>The Basics</h2>
      <label style={labelStyle}>Name *</label>
      <input
        style={inputStyle}
        value={form.name}
        onChange={(event) => onFieldChange('name', event.target.value)}
      />

      <label style={labelStyle}>Email *</label>
      <input
        style={inputStyle}
        type="text"
        inputMode="email"
        autoComplete="email"
        value={form.email}
        onChange={(event) => onFieldChange('email', event.target.value)}
      />

      <label style={labelStyle}>Password *</label>
      <input
        style={inputStyle}
        type="password"
        value={form.password}
        onChange={(event) => onFieldChange('password', event.target.value)}
      />

      <label style={labelStyle}>Confirm Password *</label>
      <input
        style={inputStyle}
        type="password"
        value={form.confirmPassword}
        onChange={(event) =>
          onFieldChange('confirmPassword', event.target.value)
        }
      />
      <p style={{ color: '#888', fontSize: '12px', margin: '-6px 0 8px' }}>
        Use at least 6 characters.
      </p>

      <label style={labelStyle}>Experience Level *</label>
      <select
        style={inputStyle}
        value={form.level}
        onChange={(event) => onFieldChange('level', event.target.value)}
      >
        <option value="">Select level</option>
        {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label style={labelStyle}>University</label>
      <input
        style={inputStyle}
        value={form.university}
        onChange={(event) => onFieldChange('university', event.target.value)}
      />

      <label style={labelStyle}>Gender</label>
      <select
        style={inputStyle}
        value={form.gender}
        onChange={(event) => onFieldChange('gender', event.target.value)}
      >
        <option value="">Select gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Non-binary</option>
        <option>Prefer not to say</option>
      </select>

      <label style={labelStyle}>LinkedIn URL</label>
      <input
        style={inputStyle}
        placeholder="https://linkedin.com/in/you"
        value={form.linkedin}
        onChange={(event) => onFieldChange('linkedin', event.target.value)}
      />

      <label style={labelStyle}>GitHub Username</label>
      <input
        style={inputStyle}
        placeholder="username"
        value={form.github}
        onChange={(event) => onFieldChange('github', event.target.value)}
      />

      <button onClick={onNext} style={buttonStyle}>
        Next: Skills →
      </button>
    </>
  );
}
