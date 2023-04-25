// This can be false if you're using a fallback (i.e. SPA mode)
// export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export async function load() {
	const latest_commit = fetch(
		'https://api.github.com/repos/maehr/awesome-digital-history/commits?per_page=1&status=success'
	)
		.then((res) => res.json())
		.then((data) => ({
			html_url: data[0].html_url,
			date: data[0].commit.author.date
		}));
	return {
		latest_commit
	};
}
