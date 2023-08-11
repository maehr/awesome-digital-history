<script>
	import MultiSelect from 'svelte-multiselect';
	import entries from '$lib/data/entries.json';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	/** @type {import('./$types').PageData} */
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
	<title
		>Awesome Digital History | Find primary sources online and learn how to research history
		digitally.</title
	>
</svelte:head>

<main class="grid grid-cols-1 gap-2 pt-2 md:grid-cols-4 md:gap-4 md:pt-4">
	<section class="card bg-base-100 shadow-xl">
		<div class="card-body">
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
	</section>
	{#if filteredEntries.length === 0}
		<article class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="break-word card-title text-xl normal-case text-primary">No results found</h2>
				<p>Please try another search term or filter.</p>
			</div>
		</article>
	{/if}
	{#each filteredEntries as entry}
		<article class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="break-word card-title text-xl normal-case text-primary">
					{entry.title}
				</h2>
				<p>
					<a class="btn btn-accent break-all normal-case" href={entry.url}
						>{entry.url.replace(/(^\w+:|^)\/\//, '')}</a
					>
				</p>
				<p>{entry.description}</p>
				<div class="flex flex-wrap justify-end gap-1">
					{#each data.filterOptions as option}
						{#each entry[option.key] as value}
							<span class={option.badgeClasses}>{value}</span>
						{/each}
					{/each}
				</div>
			</div>
		</article>
	{/each}
</main>
