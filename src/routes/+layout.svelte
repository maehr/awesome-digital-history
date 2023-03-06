<script>
	import '../app.css';
	import Header from './Header.svelte';
	const htmlURL = 'https://github.com/maehr/awesome-digital-history';
	const lastCommitDate = new Date().toLocaleDateString();
	// /** @type {import('./$types').LayoutData} */
	// export let data;
</script>

<div class="container mx-auto min-h-screen">
	<Header />

	<slot />

	<footer class="footer items-center p-4">
		<div class="items-center grid-flow-col">
			<p>Licensed under CC0 and AGPLv3.</p>
			<p>
				Last update <a href={htmlURL}>{lastCommitDate}</a>.
			</p>
			<!-- <p>
				Last update <a href={data.htmlURL}>{data.lastCommitDate}</a>.
			</p> -->
		</div>
	</footer>
</div>

<style>
	:global(body) {
		background-color: #afafaf;
	}
</style>
