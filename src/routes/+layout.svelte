<script>
	import '../app.css';
	import Plausible from 'plausible-tracker';
	import { onMount } from 'svelte';
	const plausible = Plausible({
		domain: 'awesome-digital-history.pages.dev'
	});
	onMount(() => {
		plausible.enableAutoPageviews();
		plausible.enableAutoOutboundTracking();
	});
</script>

<div class="container mx-auto">
	<slot />
</div>
