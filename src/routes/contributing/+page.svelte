<script>
	import { marked } from 'marked';
	const url =
		'https://raw.githubusercontent.com/maehr/awesome-digital-history/main/CONTRIBUTING.md';
</script>

<svelte:head>
	<title>Contributing to Awesome Digital History</title>
</svelte:head>

<main>
	{#await fetch(url).then((r) => r.text()) then text}
		{@html marked(text)}
	{/await}
</main>
