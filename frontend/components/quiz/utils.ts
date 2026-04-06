import type { ParsedQuizRating, QuizRating } from '@/types/user';

/**
 * Parses a quiz model response that may be plain JSON or JSON wrapped in markdown fences.
 */
export function parseQuizRatingMessage(
  message: string,
): ParsedQuizRating | null {
  const cleaned = message.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned) as ParsedQuizRating;
  } catch {
    const match = cleaned.match(/\{[\s\S]*"rating"[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as ParsedQuizRating;
    } catch {
      return null;
    }
  }
}

export function hasParsedRating(
  parsed: ParsedQuizRating | null,
): parsed is ParsedQuizRating {
  return Boolean(parsed?.rating);
}

export function buildRatingsMap(ratings: QuizRating[]): Record<string, number> {
  const finalMap: Record<string, number> = {};

  ratings.forEach((rating) => {
    finalMap[rating.skill] = rating.rating;
  });

  return finalMap;
}
