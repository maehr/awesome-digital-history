import { json } from '@sveltejs/kit';

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

const CONTRIBUTORS_URL = 'https://api.github.com/repos/maehr/awesome-digital-history/contributors';
const COMMITS_URL =
	'https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success';
const COMMITS_PAGE_URL = 'https://github.com/maehr/awesome-digital-history/commits/main';

/** @typedef {{ login: string; avatar_url: string; html_url: string }} Contributor */
/** @typedef {{ html_url: string; commit: { author: { date: string } } }} Commit */

/**
 * @template T
 * @param {string} url
 * @param {T} fallback
 * @returns {Promise<T>}
 */
async function fetchJSON(url, fallback) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return fallback;
		}
		return await response.json();
	} catch {
		return fallback;
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const [contributorsData, commitsData] = await Promise.all([
		fetchJSON(CONTRIBUTORS_URL, /** @type {Contributor[]} */ ([])),
		fetchJSON(COMMITS_URL, /** @type {Commit[]} */ ([]))
	]);
	const contributors = contributorsData.map((contributor) => ({
		login: contributor.login,
		avatar_url: contributor.avatar_url,
		html_url: contributor.html_url
	}));
	const latest_commit = commitsData[0]
		? {
				html_url: commitsData[0].html_url,
				date: commitsData[0].commit.author.date
			}
		: {
				html_url: COMMITS_PAGE_URL,
				date: 'unavailable'
			};
	return json({
		contributors,
		latest_commit
	});
}
