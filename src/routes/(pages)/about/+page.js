// This can be false if you're using a fallback (i.e. SPA mode)
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
	const contributors = fetch(
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

	return {
		contributors
	};
}
