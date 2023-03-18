<script>
	import About from '../../../ABOUT.md';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>Contributing to Awesome Digital History</title>
</svelte:head>

<main class="container mx-auto">
	<section class="prose">
		<About />
		<h2>
			<a href="https://github.com/maehr/awesome-digital-history/graphs/contributors">
				Contributors</a
			>
		</h2>
		<ul>
			{#each data.contributors as contributor}
				<li><a href={contributor.url}>{contributor.handle}</a></li>
			{/each}
		</ul>
	</section>
</main>
