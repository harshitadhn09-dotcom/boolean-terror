type GithubRepo = {
  fork?: boolean;
  size?: number;
  default_branch?: string | null;
  pushed_at?: string | null;
};

function isSubstantiveRepo(repo: GithubRepo): boolean {
  if (repo.fork) return false;

  const hasFiles = typeof repo.size === 'number' && repo.size > 0;
  const hasCommitHistory =
    typeof repo.default_branch === 'string' && repo.default_branch.length > 0;
  const hasPushActivity =
    typeof repo.pushed_at === 'string' && repo.pushed_at.length > 0;

  return hasFiles && hasCommitHistory && hasPushActivity;
}

/**
 * Verifies a GitHub username by requiring at least 3 non-empty public repos.
 */
export async function verifyGithub(username: string): Promise<boolean> {
  if (!username) return false;

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      },
    );

    if (!res.ok) return false;

    const repos: unknown = await res.json();
    if (!Array.isArray(repos)) return false;

    const substantiveRepos = repos.filter((repo) =>
      isSubstantiveRepo(repo as GithubRepo),
    );

    return substantiveRepos.length >= 3;
  } catch {
    return false;
  }
}
