<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import entries from '$lib/assets/data/entries.json';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	// import { goto } from '$app/navigation';

	$: filter = {
		searchTerm: '',
		region: [],
		language: [],
		type: [],
		access: [],
		reusability: [],
		period: []
	};

	onMount(() => {
		const params = $page.url.searchParams;
		filter.searchTerm = params.get('searchTerm') || '';
		filterOptions.forEach((option) => {
			filter[option.key] = params.getAll(option.key) || [];
		});
	});

	// TODO: query params should be written to the URL on change (see https://dev.to/mohamadharith/mutating-query-params-in-sveltekit-without-page-reloads-or-navigations-2i2b)
	// $: goto(
	// 	$page.url,
	// 	{
	// 		searchTerm: filter.searchTerm,
	// 		...filterOptions.reduce((acc, option) => {
	// 			acc[option.key] = filter[option.key];
	// 			return acc;
	// 		}, {})
	// 	},
	// 	{ replaceState: true }
	// );

	const filterOptions = [
		{ label: 'Region', key: 'region', values: [], badgeClasses: 'badge badge-primary text-white' },
		{ label: 'Languages', key: 'language', values: [], badgeClasses: 'badge' },
		{ label: 'Type', key: 'type', values: [], badgeClasses: 'badge badge-secondary' },
		{ label: 'Access', key: 'access', values: [], badgeClasses: 'badge badge-accent' },
		{ label: 'Reusability', key: 'reusability', values: [], badgeClasses: 'badge badge-ghost' },
		{ label: 'Period', key: 'period', values: [], badgeClasses: 'badge badge-info' }
	];

	// if entries change, this would have to be done dynamically (i.e. $)
	filterOptions.forEach((option) => {
		option.values = [...new Set(entries.flatMap((entry) => entry[option.key]))].sort((a, b) =>
			a.localeCompare(b)
		);
	});

	$: filteredEntries = entries
		.filter(
			(item) =>
				(item.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
					item.description.toLowerCase().includes(filter.searchTerm.toLowerCase())) &&
				(filter.region.length === 0 || item.region.some((r) => filter.region.includes(r))) &&
				(filter.language.length === 0 || item.language.some((r) => filter.language.includes(r))) &&
				(filter.type.length === 0 || item.type.some((r) => filter.type.includes(r))) &&
				(filter.access.length === 0 || item.access.some((r) => filter.access.includes(r))) &&
				(filter.reusability.length === 0 ||
					item.reusability.some((r) => filter.reusability.includes(r))) &&
				(filter.period.length === 0 || item.period.some((r) => filter.period.includes(r)))
		)
		.sort((a, b) => a.title.localeCompare(b.title));
</script>

<svelte:head>
	<title>Find primary sources online and learn how to research history digitally.</title>
	<meta
		name="description"
		content="Finding aids for textual and multimedia primary sources with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally."
	/>
</svelte:head>

<main class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 overflow-y-hidden" id="top">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h1 class="card-title">
				<a class="btn btn-primary normal-case text-xl text-white" href="#top"
					>Awesome Digital History</a
				>
			</h1>

			<div class="card-actions">
				<div class="form-control grow">
					<div class="form-control">
						<label class="label" for="search"><span>Search</span></label>
						<input
							name="search"
							id="search"
							type="text"
							class="input input-bordered"
							bind:value={filter.searchTerm}
							placeholder="Search by title or description"
						/>
					</div>
					{#each filterOptions as option}
						<div class="form-control">
							<label class="label" for={option.key}><span>{option.label}</span></label>
							<MultiSelect
								bind:selected={filter[option.key]}
								options={option.values}
								name={option.key}
								id={option.key}
							/>
						</div>
					{/each}
					<div class="form-control">
						<span>&nbsp;</span>
						<label class="label hidden" for="reset">Reset</label>
						<button
							name="reset"
							id="reset"
							class="btn btn-primary text-white"
							on:click={() => {
								filter.searchTerm = '';
								filterOptions.forEach((option) => {
									filter[option.key] = [];
								});
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#each filteredEntries as entry}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title text-primary normal-case text-xl break-word">
					{entry.title}
				</h2>
				<p>
					<a class="normal-case btn btn-accent break-all" href={entry.url}
						>{entry.url.replace(/(^\w+:|^)\/\//, '')}</a
					>
				</p>
				<p>{entry.description}</p>

				<div class="flex flex-wrap gap-1 justify-end">
					{#each filterOptions as option}
						{#each entry[option.key] as value}
							<span class={option.badgeClasses}>{value}</span>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	{/each}
</main>
