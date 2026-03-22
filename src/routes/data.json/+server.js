import { json } from '@sveltejs/kit';

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

const contributorsUrl = 'https://api.github.com/repos/maehr/awesome-digital-history/contributors';
const commitsUrl =
	'https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success';

async function fetchJson(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			return null;
		}
		return await response.json();
	} catch {
		return null;
	}
}

function parseContributors(data) {
	if (!Array.isArray(data)) {
		return [];
	}

	return data.map((contributor) => ({
		login: contributor.login,
		avatar_url: contributor.avatar_url,
		html_url: contributor.html_url
	}));
}

function parseLatestCommit(data) {
	if (!Array.isArray(data) || data.length === 0) {
		return null;
	}

	const latestCommit = data[0];
	const html_url = latestCommit?.html_url;
	const date = latestCommit?.commit?.author?.date;

	if (!html_url || !date) {
		return null;
	}

	return {
		html_url,
		date
	};
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const [contributorsData, commitsData] = await Promise.all([
		fetchJson(contributorsUrl),
		fetchJson(commitsUrl)
	]);

	return json({
		contributors: parseContributors(contributorsData),
		latest_commit: parseLatestCommit(commitsData)
	});
}
