<script>
	import MultiSelect from 'svelte-multiselect';
	import entries from '$lib/data/entries.json';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data;

	 $: {
		if (browser) {
		let url = new URL($page.url);
		if (data.filter.searchTerm === '') {
			url.searchParams.delete('searchTerm');
		} else {
			url.searchParams.set('searchTerm', data.filter.searchTerm);
		}
		data.filterOptions.forEach((option) => {
			url.searchParams.delete(option.key);
			data.filter[option.key].forEach((value) => {
				url.searchParams.append(option.key, value);
			});
		});
		if (url !== $page.url) {
			goto(url, { keepFocus: true, noScroll: true });
		}
		}
	 }

	// if entries change, this would have to be done dynamically (i.e. $)
	data.filterOptions.forEach((option) => {
		option.values = [...new Set(entries.flatMap((entry) => entry[option.key]))].sort((a, b) =>
			a.localeCompare(b)
		);
	});

	$: filteredEntries = entries
		.filter(
			(item) =>
				(item.title.toLowerCase().includes(data.filter.searchTerm.toLowerCase()) ||
					item.description.toLowerCase().includes(data.filter.searchTerm.toLowerCase())) &&
				(data.filter.region.length === 0 ||
					item.region.some((r) => data.filter.region.includes(r))) &&
				(data.filter.language.length === 0 ||
					item.language.some((r) => data.filter.language.includes(r))) &&
				(data.filter.type.length === 0 || item.type.some((r) => data.filter.type.includes(r))) &&
				(data.filter.period.length === 0 || item.period.some((r) => data.filter.period.includes(r)))
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
							bind:value={data.filter.searchTerm}
							placeholder="Search by title or description"
						/>
					</div>
					{#each data.filterOptions as option}
						<div class="form-control">
							<label class="label" for={option.key}><span>{option.label}</span></label>
							<MultiSelect
								bind:selected={data.filter[option.key]}
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
								data.filter.searchTerm = '';
								data.filterOptions.forEach((option) => {
									data.filter[option.key] = [];
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
					{#each data.filterOptions as option}
						{#each entry[option.key] as value}
							<span class={option.badgeClasses}>{value}</span>
						{/each}
					{/each}
				</div>
			</div>
		</div>
	{/each}
</main>
