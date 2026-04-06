'use client';

import { INTERESTS } from '@/components/profile-form/constants';
import type { InterestsStepProps } from '@/components/profile-form/types';
import {
  backButtonStyle,
  buttonRowStyle,
  chipContainerStyle,
  chipStyle,
  headerStyle,
  nextButtonStyle,
} from '@/components/profile-form/styles';

export default function InterestsStep({
  selectedInterests,
  loadingSubmit,
  submitError,
  onToggleInterest,
  onBack,
  onSubmit,
}: InterestsStepProps) {
  return (
    <>
      <h2 style={headerStyle}>Your Interests</h2>
      <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 16px' }}>
        What do you want to build?
      </p>
      <div style={chipContainerStyle}>
        {INTERESTS.map((interest) => (
          <button
            key={interest}
            onClick={() => onToggleInterest(interest)}
            style={chipStyle(selectedInterests.includes(interest))}
          >
            {interest}
          </button>
        ))}
      </div>

      <div style={buttonRowStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <button onClick={onSubmit} disabled={loadingSubmit} style={nextButtonStyle}>
          {loadingSubmit ? 'Saving Profile...' : 'Finish Profile →'}
        </button>
      </div>
      {submitError && (
        <p style={{ color: '#ff8d8d', fontSize: '13px', marginTop: '14px' }}>
          {submitError}
        </p>
      )}
    </>
  );
}
