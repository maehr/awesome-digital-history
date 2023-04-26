/** @type {import('./$types').LayoutLoad} */
export async function load(event) {
	const data = await event.fetch('/data.json').then((res) => res.json());
	return {
		...data
	};
}
