import type { ProfileFormState } from '@/types/user';

export interface BasicsStepProps {
  form: ProfileFormState;
  onFieldChange: <K extends keyof ProfileFormState>(
    key: K,
    value: ProfileFormState[K],
  ) => void;
  onNext: () => void;
}

export interface SkillsStepProps {
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export interface InterestsStepProps {
  selectedInterests: string[];
  loadingSubmit: boolean;
  submitError: string;
  onToggleInterest: (interest: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}
