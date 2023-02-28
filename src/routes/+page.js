const filterOptions = [
	{ label: 'Region', key: 'region', values: [], badgeClasses: 'badge badge-primary text-white' },
	{ label: 'Languages', key: 'language', values: [], badgeClasses: 'badge' },
	{ label: 'Type', key: 'type', values: [], badgeClasses: 'badge badge-secondary' },
	{ label: 'Period', key: 'period', values: [], badgeClasses: 'badge badge-ghost' }
];

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const filter = {
		searchTerm: '',
		region: [],
		language: [],
		type: [],
		period: []
	};
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
