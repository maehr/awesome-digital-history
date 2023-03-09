<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<meta
		name="description"
		content="Finding aids for textual and multimedia primary sources with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally."
	/>
</svelte:head>

<nav class="navbar rounded-box sticky top-0 z-30 bg-base-200 ">
	<div class="flex-1 px-4">
		<img src="favicon.png" alt="logo" class="w-10" />
		<h1 class="navbar-title hidden md:text-xl lg:block">Awesome Digital History</h1>
	</div>
	<div class="flex-none">
		<ul class="menu rounded-box menu-horizontal bg-secondary ">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Search</a>
			</li>
			<li aria-current={$page.url.pathname === '/contributing' ? 'page' : undefined}>
				<a href="/contributing">Contribute</a>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
		</ul>
	</div>
</nav>
