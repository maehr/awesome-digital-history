<script>
	import About from '../../../../ABOUT.md';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Contributing to Awesome Digital History</title>
</svelte:head>

<About />
<h2>
	<a href="https://github.com/maehr/awesome-digital-history/graphs/contributors">Contributors</a>
</h2>
<ul class="grid grid-cols-2 gap-4">
	{#each data.contributors as contributor}
		<div class="flex items-center space-x-2">
			<div class="mask mask-hexagon w-16">
				<img src={contributor.avatar_url} alt="Avatar of {contributor.login}" />
			</div>
			<div class="text-lg font-extrabold">
				<a href={contributor.html_url}>{contributor.login}</a>
			</div>
		</div>
	{/each}
</ul>
