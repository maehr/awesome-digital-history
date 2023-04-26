/**
 * The filter options
 * @typedef {Object} filterOption
 * @property {string} label - a label.
 * @property {string} key - a key.
 * @property {string[]} values - a list of values.
 * @property {string} badgeClasses - a list of tailwind classes.
 */

/** @type {filterOption[]} */
const filterOptions = [
	{ label: 'Region', key: 'region', values: [], badgeClasses: 'badge badge-primary text-white' },
	{ label: 'Languages', key: 'language', values: [], badgeClasses: 'badge' },
	{ label: 'Type', key: 'type', values: [], badgeClasses: 'badge badge-secondary' },
	{ label: 'Period', key: 'period', values: [], badgeClasses: 'badge badge-ghost' }
];

/**
 * The filter
 * @typedef {Object} filter
 * @property {string} searchTerm - a search term.
 * @property {string[]} region - a list of regions.
 * @property {string[]} language - a list of languages.
 * @property {string[]} type - a list of types.
 * @property {string[]} period - a list of periods.
 */

/** @type {filter} */
const filter = {
	searchTerm: '',
	region: [],
	language: [],
	type: [],
	period: []
};

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const params = url.searchParams;
	filter.searchTerm = params.get('searchTerm') || '';
	filterOptions.forEach((option) => {
		filter[option.key] = params.getAll(option.key) || [];
	});
	return {
		filter,
		filterOptions
	};
}
