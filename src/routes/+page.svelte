<script>
	import MultiSelect from 'svelte-multiselect';
	import entries from '$lib/assets/data/entries.json';
	$: filter = {
		searchTerm: '',
		region: [],
		language: [],
		type: [],
		access: [],
		reusability: [],
		period: []
	};
	const filterOptions = [
		{label: 'Languages', key: 'language', values: [], badgeClasses: 'badge'},
		{label: 'Type', key: 'type', values: [], badgeClasses: 'badge badge-secondary'},
		{label: 'Access', key: 'access', values: [], badgeClasses: 'badge badge-accent'},
		{label: 'Reusability', key: 'reusability', values: [], badgeClasses: 'badge badge-ghost'},
		{label: 'Period', key: 'period', values: [], badgeClasses: 'badge badge-info'}
	];

	// if entries change, this would have to be done dynamically (i.e. $)
	filterOptions.forEach((option) => {
		option.values = [...new Set(entries.flatMap((entry) => entry[option.key]))].sort((a, b) => a.localeCompare(b));
	})

	$: filteredEntries = entries
		.filter(
			(item) =>
				(item.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(filter.searchTerm.toLowerCase())) &&
				(filter.language.length === 0 || item.language.some((r) => filter.language.includes(r))) &&
				(filter.type.length === 0 || item.type.some((r) => filter.type.includes(r))) &&
				(filter.access.length === 0 || item.access.some((r) => filter.access.includes(r))) &&
				(filter.reusability.length === 0 || item.reusability.some((r) => filter.reusability.includes(r))) &&
				(filter.period.length === 0 || item.period.some((r) => filter.period.includes(r)))
		).sort((a, b) => a.title.localeCompare(b.title));
		// .filter(
		// 	(item) => filter.region.length === 0 || item.region.some((r) => filter.region.includes(r))
		// )
</script>

<svelte:head>
	<title>Find primary sources online and learn how to research history digitally.</title>
	<meta
		name="description"
		content="Finding aids for textual and multimedia primary sources with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally."
	/>
</svelte:head>

<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 overflow-y-hidden">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title" id="top">
				<a class="btn btn-primary normal-case text-xl" href="#top">Awesome Digital History</a>
			</h3>

			<div class="card-actions">
				<div class="form-control grow">
					<div class="form-control">
						<label class="label" for="search"><span>Search</span></label>
						<input
							name="search"
							type="text"
							class="input input-bordered"
							bind:value={filter.searchTerm}
							placeholder="Search by title or description"
						/>
					</div>
					{#each filterOptions as option}
						<div class="form-control">
							<label class="label" for="{option.key}"><span>{option.label}</span></label>
							<MultiSelect bind:selected={filter[option.key]} options={option.values} name="{option.key}" />
						</div>
					{/each}
					<div class="form-control">
						<span>&nbsp;</span>
						<label class="label hidden" for="reset">Reset</label>
						<button
							name="reset"
							class="btn btn-primary"
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
				<h3 class="card-title text-primary">
					<a class="normal-case text-xl break-word" href={entry.url}>{entry.title}</a>
				</h3>
				<p>
					<a class="normal-case btn btn-accent break-all" href={entry.url}
						>{entry.url.replace(/(^\w+:|^)\/\//, '')}</a
					>
				</p>
				<p>{entry.description}</p>

				<div class="flex flex-wrap gap-1 justify-end">
					{#each filterOptions as option}
						{#each entry[option.key] as value}
							<span class="{option.badgeClasses}">{value}</span>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
