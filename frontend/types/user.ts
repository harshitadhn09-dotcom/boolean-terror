export interface User {
  id: string;
  name: string;
  gender: string;
  university: string;
  skills: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  linkedin: string;
  email: string;
  skill_ratings?: Record<string, number>;
  github_verified?: boolean;
}

export interface MatchUser {
  id: string;
  name: string;
  university: string;
  skills: string[];
  level: string;
  compatibilityScore: number;
  reasons: string[];
  skill_ratings?: Record<string, number>;
  github_verified?: boolean;
  linkedin?: string;
  email?: string;
}

export interface MatchedUser {
  id: string;
  name: string;
  university: string;
  skills: string[];
  level: string;
  linkedin: string;
  email: string;
  skill_ratings?: Record<string, number>;
  github_verified?: boolean;
}

export interface QuizMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QuizRating {
  skill: string;
  rating: number;
  feedback: string;
}

export interface ParsedQuizRating {
  rating: number;
  feedback: string;
}

export interface ProfileFormState {
  name: string;
  gender: string;
  university: string;
  skills: string[];
  level: string;
  interests: string[];
  linkedin: string;
  email: string;
  github: string;
  password: string;
  confirmPassword: string;
}

export interface QuizRouteRequestBody {
  skill: string;
  history: QuizMessage[];
}

export interface QuizRouteResponseBody {
  message: string;
}

export interface QuizSaveRequestBody {
  userId: string | null;
  skill_ratings: Record<string, number>;
}

export interface LikeRequestBody {
  userId: string | null;
  targetId: string;
}
