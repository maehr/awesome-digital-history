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
	let regions = [...new Set(entries.flatMap((entry) => entry.region))];
	let languages = [...new Set(entries.flatMap((entry) => entry.language))];
	let types = [...new Set(entries.flatMap((entry) => entry.type))];
	let access = [...new Set(entries.flatMap((entry) => entry.access))];
	let reusability = [...new Set(entries.flatMap((entry) => entry.reusability))];
	let periods = [...new Set(entries.flatMap((entry) => entry.period))];

	$: filteredEntries = entries
		.filter(
			(item) =>
				item.title.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
				item.description.toLowerCase().includes(filter.searchTerm.toLowerCase())
		)
		.filter(
			(item) => filter.region.length === 0 || item.region.some((r) => filter.region.includes(r))
		)
		.filter(
			(item) =>
				filter.language.length === 0 || item.language.some((r) => filter.language.includes(r))
		)
		.filter((item) => filter.type.length === 0 || item.type.some((r) => filter.type.includes(r)))
		.filter(
			(item) => filter.access.length === 0 || item.access.some((r) => filter.access.includes(r))
		)
		.filter(
			(item) =>
				filter.reusability.length === 0 ||
				item.reusability.some((r) => filter.reusability.includes(r))
		)
		.filter(
			(item) => filter.period.length === 0 || item.period.some((r) => filter.period.includes(r))
		);
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title" id="top">
				<a class="btn btn-primary normal-case text-xl" href="#top">Awesome Digital History</a>
			</h3>
			<input
				type="text"
				bind:value={filter.searchTerm}
				placeholder="Search by title or description"
			/>
			<div class="card-actions">
				<div class="form-control">
					<!-- <div class="form-control">
						<span>Regions</span>
						<MultiSelect bind:selected={filter.region} options={regions} />
					</div> -->
					<div class="form-control">
						<span>Languages</span>
						<MultiSelect bind:selected={filter.language} options={languages} />
					</div>
					<div class="form-control">
						<span>Type</span>
						<MultiSelect bind:selected={filter.type} options={types} />
					</div>
					<div class="form-control">
						<span>Access</span>
						<MultiSelect bind:selected={filter.access} options={access} />
					</div>
					<div class="form-control">
						<span>Reusability</span>
						<MultiSelect bind:selected={filter.reusability} options={reusability} />
					</div>
					<div class="form-control">
						<span>Period</span>
						<MultiSelect bind:selected={filter.period} options={periods} />
					</div>
					<div class="form-control">
						<button
							class="btn btn-primary"
							on:click={() => {
								filter.searchTerm = '';
								filter.region = [];
								filter.language = [];
								filter.type = [];
								filter.access = [];
								filter.reusability = [];
								filter.period = [];
							}}>
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
				<h3 class="card-title">
					<a class="btn btn-primary normal-case text-xl" href={entry.url}>{entry.title}</a>
				</h3>
				<p>{entry.description}</p>
				<div class="flex flex-wrap gap-1">
					<!-- {#each entry.region as region}
						<span class="badge badge-outline">{region}</span>
					{/each} -->
					{#each entry.language as language}
						<span class="badge">{language}</span>
					{/each}
					{#each entry.type as type}
						<span class="badge badge-secondary">{type}</span>
					{/each}
					{#each entry.access as access}
						<span class="badge badge-accent">{access}</span>
					{/each}
					{#each entry.reusability as reusability}
						<span class="badge badge-ghost">{reusability}</span>
					{/each}
					{#each entry.period as period}
						<span class="badge badge-info">{period}</span>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>
