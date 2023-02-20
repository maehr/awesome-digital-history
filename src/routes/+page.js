const filterOptions = [
	{ label: 'Region', key: 'region', values: [], badgeClasses: 'badge badge-primary text-white' },
	{ label: 'Languages', key: 'language', values: [], badgeClasses: 'badge' },
	{ label: 'Type', key: 'type', values: [], badgeClasses: 'badge badge-secondary' },
	{ label: 'Access', key: 'access', values: [], badgeClasses: 'badge badge-accent' },
	{ label: 'Reusability', key: 'reusability', values: [], badgeClasses: 'badge badge-ghost' },
	{ label: 'Period', key: 'period', values: [], badgeClasses: 'badge badge-info' }
];

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const filter = {
		searchTerm: '',
		region: [],
		language: [],
		type: [],
		access: [],
		reusability: [],
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
