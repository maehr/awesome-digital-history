<script>
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="container mx-auto min-h-screen">
	<Header />

	<main>
	<slot />
	</main>
</div>

<style>
	:global(body) {
		background-color: #afafaf;
	}
</style>
