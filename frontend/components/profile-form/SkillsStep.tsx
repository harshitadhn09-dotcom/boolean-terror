'use client';

import { SKILLS } from '@/components/profile-form/constants';
import type { SkillsStepProps } from '@/components/profile-form/types';
import {
  backButtonStyle,
  buttonRowStyle,
  chipContainerStyle,
  chipStyle,
  headerStyle,
  nextButtonStyle,
} from '@/components/profile-form/styles';

export default function SkillsStep({
  selectedSkills,
  onToggleSkill,
  onBack,
  onNext,
}: SkillsStepProps) {
  return (
    <>
      <h2 style={headerStyle}>Your Skills</h2>
      <p style={{ color: '#aaa', fontSize: '14px', margin: '0 0 16px' }}>
        Select up to 3 core skills for your AI assessment.
      </p>
      <div style={chipContainerStyle}>
        {SKILLS.map((skill) => (
          <button
            key={skill}
            onClick={() => onToggleSkill(skill)}
            style={chipStyle(selectedSkills.includes(skill))}
          >
            {skill}
          </button>
        ))}
      </div>

      <div style={buttonRowStyle}>
        <button onClick={onBack} style={backButtonStyle}>
          ← Back
        </button>
        <button onClick={onNext} style={nextButtonStyle}>
          Start Assessment →
        </button>
      </div>
    </>
  );
}
