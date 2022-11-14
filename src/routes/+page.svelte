<script>
	import MultiSelect from 'svelte-multiselect';
	import entries from '$lib/assets/data/entries.json';
	let filter = {
		region: [],
		language: [],
		type: [],
		access: [],
		reusability: [],
		period: []
	};
	let filteredEntries = entries;
	$: filteredEntries = entries.filter((entry) => {
		return (
			filter.region.every((region) => entry.region.includes(region)) &&
			filter.language.every((language) => entry.language.includes(language)) &&
			filter.type.every((type) => entry.type.includes(type)) &&
			filter.access.every((access) => entry.access.includes(access)) &&
			filter.reusability.every((reusability) => entry.reusability.includes(reusability)) &&
			filter.period.every((period) => entry.period.includes(period))
		);
	});
	let regions = [...new Set(entries.flatMap((entry) => entry.region))];
	let languages = [...new Set(entries.flatMap((entry) => entry.language))];
	let types = [...new Set(entries.flatMap((entry) => entry.type))];
	let accesses = [...new Set(entries.flatMap((entry) => entry.access))];
	let reusabilities = [...new Set(entries.flatMap((entry) => entry.reusability))];
	let periods = [...new Set(entries.flatMap((entry) => entry.period))];
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title">
				<a class="btn btn-ghost normal-case text-xl" href="#">Awesome Digital History</a>
			</h3>
			<div class="card-actions">
				<div class="form-control">
					<div class="form-control">
						<span>Regions</span>
						<MultiSelect bind:selected={filter.region} options={regions} />
					</div>
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
						<MultiSelect bind:selected={filter.access} options={accesses} />
					</div>
					<div class="form-control">
						<span>Reusability</span>
						<MultiSelect bind:selected={filter.reusability} options={reusabilities} />
					</div>
					<div class="form-control">
						<span>Period</span>
						<MultiSelect bind:selected={filter.period} options={periods} />
					</div>
				</div>
			</div>
		</div>
	</div>
	{#each filteredEntries as entry, i}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title">{entry.title}</h3>
				<p>{entry.description}</p>
				<div class="flex flex-wrap gap-1">
					{#each entry.region as region}
						<span class="badge badge-outline">{region}</span>
					{/each}
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
				<div class="card-actions justify-end">
					<button class="btn btn-primary">{entry.url}</button>
				</div>
			</div>
		</div>
	{/each}
</div>
