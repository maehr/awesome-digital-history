/**
 * Contributor
 * @typedef {Object} contributor
 * @property {string} handle - the GitHub handle.
 * @property {string} url - the GitHub URL.
 */

/** @type {contributor[]} */
const contributors = [];

/** @type {import('./$types').PageLoad} */
export async function load() {
	const url = `https://api.github.com/repos/maehr/awesome-digital-history/contributors`;
	await fetch(url)
		.then((response) => response.json())
		.then((data) => {
			data.forEach((contributor) => {
				contributors.push({
					handle: contributor.login,
					url: contributor.html_url
				});
			});
		})
	return {
		contributors: contributors
	};
}
