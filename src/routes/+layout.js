/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
	const res = await fetch(
		`https://api.github.com/repos/maehr/awesome-digital-history/commits/main`
	).catch(() => {
		return {
			lastCommitDate: 'unknown',
			htmlURL: 'https://github.com/maehr/awesome-digital-history'
		};
	});
	const data = await res.json();
	const lastCommitDate = new Date(data.commit.author.date).toLocaleDateString();
	const htmlURL = data.html_url;
	return {
		lastCommitDate,
		htmlURL
	};
}
