<script>
	import About from '../../../../ABOUT.md';
	import contributors from '$lib/data/contributors.json';
</script>

<svelte:head>
	<title>Contributing to Awesome Digital History</title>
</svelte:head>

<About />
<h2>
	<a href="https://github.com/maehr/awesome-digital-history/graphs/contributors"> Contributors</a>
</h2>
<ul>
	{#each contributors as contributor}
		<li><a href={contributor.html_url}>{contributor.login}</a></li>
	{/each}
</ul>
