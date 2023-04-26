<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Awesome Digital History</title>
</svelte:head>

<main class="grid grid-cols-1 gap-2 overflow-y-hidden pt-2 md:gap-4 md:pt-4">
	<section class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="break-word card-title text-xl normal-case text-primary">
				{$page.status}: {$page.error.message}
			</h2>
			<a class="btn-primary btn" href="{base}/">Go back</a>
		</div>
	</section>
</main>
