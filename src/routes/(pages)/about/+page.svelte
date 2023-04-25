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
	<a href="https://github.com/maehr/awesome-digital-history/graphs/contributors"> Contributors</a>
</h2>
<ul>
	{#each data.contributors as contributor}
		<li><a href={contributor.html_url}>{contributor.login}</a></li>
	{/each}
</ul>
