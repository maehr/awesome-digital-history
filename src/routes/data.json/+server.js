import { json } from '@sveltejs/kit';

// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const contributors = await fetch(
		'https://api.github.com/repos/maehr/awesome-digital-history/contributors'
	)
		.then((res) => res.json())
		.then((data) =>
			data.map((contributor) => ({
				login: contributor.login,
				avatar_url: contributor.avatar_url,
				html_url: contributor.html_url
			}))
		);
	const latest_commit = await fetch(
		'https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success'
	)
		.then((res) => res.json())
		.then((data) => ({
			html_url: data[0].html_url,
			date: data[0].commit.author.date
		}));
	return json({
		contributors,
		latest_commit
	});
}
