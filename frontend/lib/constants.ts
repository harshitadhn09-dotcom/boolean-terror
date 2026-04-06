export const LOCAL_STORAGE_KEYS = {
  demoAuthCredentials: 'demoAuthCredentials',
  userId: 'userId',
  quizSkills: 'quizSkills',
} as const;

export const EXPERIENCE_LEVEL_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;
