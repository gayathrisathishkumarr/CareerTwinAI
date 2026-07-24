/**
 * GitHub Service
 * Fetches real GitHub profile data, repositories, language stats,
 * and commit activity using the public GitHub REST API.
 * Optionally uses GITHUB_TOKEN from .env for higher rate limits.
 */

const GITHUB_API = 'https://api.github.com';

/**
 * Build headers — use token if available for 5000 req/hr vs 60 req/hr
 */
const getHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'CareerTwinAI-Server'
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * Fetch JSON from GitHub API with error handling
 */
const ghFetch = async (path) => {
  const url = `${GITHUB_API}${path}`;
  const res = await fetch(url, { headers: getHeaders() });

  if (res.status === 404) {
    const err = new Error(`GitHub user or resource not found: ${path}`);
    err.status = 404;
    throw err;
  }
  if (res.status === 403) {
    const err = new Error('GitHub API rate limit exceeded. Add a GITHUB_TOKEN to .env for higher limits.');
    err.status = 429;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
};

/**
 * Fetch basic GitHub user profile
 */
export const fetchProfile = async (username) => {
  return ghFetch(`/users/${username}`);
};

/**
 * Fetch all public repos (up to 100) for a user
 */
export const fetchRepos = async (username) => {
  return ghFetch(`/users/${username}/repos?per_page=100&sort=pushed&direction=desc`);
};

/**
 * Aggregate language bytes across all repos
 * Returns sorted array: [{ language, bytes, percent }]
 */
export const fetchLanguageBreakdown = async (username) => {
  const repos = await fetchRepos(username);

  // Fetch languages for each repo in parallel (limit to top 20 repos to avoid rate limits)
  const topRepos = repos.slice(0, 20);
  const langMaps = await Promise.all(
    topRepos.map((repo) =>
      repo.fork ? Promise.resolve({}) : ghFetch(`/repos/${username}/${repo.name}/languages`).catch(() => ({}))
    )
  );

  // Aggregate totals
  const totals = {};
  for (const langMap of langMaps) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }

  const totalBytes = Object.values(totals).reduce((s, v) => s + v, 0) || 1;

  const breakdown = Object.entries(totals)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percent: Math.round((bytes / totalBytes) * 100 * 10) / 10
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8); // top 8 languages

  return breakdown;
};

/**
 * Fetch commit activity for the last 6 months from the user's most active repos.
 * Returns array of { month: 'Jan', commits: 42 } sorted oldest → newest.
 */
export const fetchCommitActivity = async (username) => {
  const repos = await fetchRepos(username);

  // Pick up to 5 non-fork repos with recent activity
  const candidates = repos
    .filter((r) => !r.fork && r.pushed_at)
    .slice(0, 5);

  // monthKey → count  (e.g. "2025-01" → 18)
  const monthCounts = {};

  await Promise.all(
    candidates.map(async (repo) => {
      try {
        const activity = await ghFetch(
          `/repos/${username}/${repo.name}/stats/commit_activity`
        );
        if (!Array.isArray(activity)) return;

        // GitHub returns 52 weeks of data; take last ~26 weeks (6 months)
        const last26 = activity.slice(-26);
        for (const week of last26) {
          const date = new Date(week.week * 1000);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthCounts[key] = (monthCounts[key] || 0) + (week.total || 0);
        }
      } catch {
        // Silently skip repos with no stats yet
      }
    })
  );

  // Build last 6 calendar months
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en-US', { month: 'short' });
    months.push({ month: label, commits: monthCounts[key] || 0 });
  }

  return months;
};

/**
 * Full GitHub insights bundle for a username
 */
export const fetchGitHubInsights = async (username) => {
  const [profile, repos, languages, commitActivity] = await Promise.all([
    fetchProfile(username),
    fetchRepos(username),
    fetchLanguageBreakdown(username),
    fetchCommitActivity(username)
  ]);

  const nonForkRepos = repos.filter((r) => !r.fork);
  const totalStars = nonForkRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const totalForks = nonForkRepos.reduce((s, r) => s + (r.forks_count || 0), 0);
  const totalCommitsApprox = commitActivity.reduce((s, m) => s + m.commits, 0);

  // Top repos by stars then pushed_at
  const topRepos = nonForkRepos
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description || '',
      language: r.language || 'Unknown',
      stars: r.stargazers_count,
      forks: r.forks_count,
      url: r.html_url,
      updatedAt: r.pushed_at
    }));

  return {
    profile: {
      username: profile.login,
      name: profile.name || profile.login,
      avatar: profile.avatar_url,
      bio: profile.bio || '',
      company: profile.company || '',
      location: profile.location || '',
      blog: profile.blog || '',
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      profileUrl: profile.html_url,
      createdAt: profile.created_at
    },
    stats: {
      totalRepos: nonForkRepos.length,
      totalStars,
      totalForks,
      totalCommitsApprox
    },
    topRepos,
    languages,
    commitActivity
  };
};
