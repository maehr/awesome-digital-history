<script>
	import '../app.css';
	const htmlURL = 'https://github.com/maehr/awesome-digital-history';
	const lastCommitDate = new Date().toLocaleDateString();
	// /** @type {import('./$types').LayoutData} */
	// export let data;
	import { page } from '$app/stores';
</script>

<svelte:head>
	<meta
		name="description"
		content="Finding aids for textual and multimedia primary sources with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally."
	/>
</svelte:head>

<div class="drawer">
	<input id="drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="w-full navbar bg-base-200">
			<div class="flex-none lg:hidden">
				<label for="drawer" class="btn btn-square btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block w-6 h-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<div class="flex-1 px-2 mx-2">
				<h1 class="navbar-title hidden md:text-xl lg:block">Awesome Digital History</h1>
			</div>
			<div class="flex-none hidden lg:block">
				<ul class="menu menu-horizontal md:gap-1 lg:gap-2">
					<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/' ? 'btn-secondary' : 'btn-ghost'} drawer-button"
							href="/">Search</a
						>
					</li>
					<li aria-current={$page.url.pathname === '/contributing' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/contributing' ? 'btn-secondary' : 'btn-ghost'} drawer-button"
							href="/contributing">Contribute</a
						>
					</li>
					<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/about' ? 'btn-secondary' : 'btn-ghost'} drawer-button"
							href="/about">About</a
						>
					</li>
				</ul>
			</div>
		</div>
		<slot />
		<footer class="footer items-center p-4">
			<div class="grid-flow-col items-center">
				<p>Licensed under CC0 and AGPLv3.</p>
				<p>
					Last update <a href={htmlURL}>{lastCommitDate}</a>.
				</p>
			</div>
		</footer>
	</div>
	<div class="drawer-side ">
		<label for="drawer" class="drawer-overlay" />
		<ul class="menu p-4 w-80 bg-base-100 gap-2">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a class="btn {$page.url.pathname === '/' ? 'btn-secondary' : 'btn-ghost'}" href="/">Search</a
				>
			</li>
			<li aria-current={$page.url.pathname === '/contributing' ? 'page' : undefined}>
				<a
					class="btn {$page.url.pathname === '/contributing' ? 'btn-secondary' : 'btn-ghost'}"
					href="/contributing">Contribute</a
				>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a class="btn {$page.url.pathname === '/about' ? 'btn-secondary' : 'btn-ghost'}" href="/about"
					>About</a
				>
			</li>
		</ul>
	</div>
</div>
