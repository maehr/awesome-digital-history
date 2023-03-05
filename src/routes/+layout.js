export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
	const res = await fetch(
		`https://api.github.com/repos/maehr/awesome-digital-history/commits/main`
	);
	const data = await res.json();
	if (!res.ok) throw new Error(data.message);
	const lastCommitDate = new Date(data.commit.author.date).toLocaleDateString();
	const htmlURL = data.html_url;

	return {
		lastCommitDate,
		htmlURL
	};
}
