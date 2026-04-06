/**
 * Verifies a GitHub username using the existing public-repo-count heuristic.
 */
export async function verifyGithub(username: string): Promise<boolean> {
  if (!username) return false;
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
    );
    if (!res.ok) return false;
    const repos: unknown = await res.json();
    return Array.isArray(repos) && repos.length >= 3;
  } catch {
    return false;
  }
}
