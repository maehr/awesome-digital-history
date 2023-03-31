<script>
	import '../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import latest_commit from '$lib/data/latest_commit.json';
</script>

<svelte:head>
	<meta
		name="description"
		content="Finding aids for textual and multimedia primary sources with a focus on the western hemisphere and the 19th and 20th centuries. Courses and learning tools to explore history digitally."
	/>
</svelte:head>

<div class="drawer">
	<input
		id="drawer"
		type="checkbox"
		class="drawer-toggle"
		aria-labelledby="labelnavbar labelsidebar"
	/>
	<div class="drawer-content flex flex-col">
		<!-- Navbar -->
		<div class="navbar w-full bg-base-200">
			<div class="flex-none lg:hidden">
				<label id="labelnavbar" for="drawer" class="btn-ghost btn-square btn"
					><span class="hidden">open drawer</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-6 w-6 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</label>
			</div>
			<div class="mx-2 flex-1 px-2">
				<h1 class="navbar-title hidden md:text-xl lg:block">Awesome Digital History</h1>
			</div>
			<div class="hidden flex-none lg:block">
				<ul class="menu menu-horizontal md:gap-1 lg:gap-2">
					<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/'
								? 'btn-secondary'
								: 'btn-ghost'} drawer-button"
							href="{base}/">Search</a
						>
					</li>
					<li aria-current={$page.url.pathname === '/contributing' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/contributing'
								? 'btn-secondary'
								: 'btn-ghost'} drawer-button"
							href="{base}/contributing">Contribute</a
						>
					</li>
					<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
						<a
							class="btn rounded {$page.url.pathname === '/about'
								? 'btn-secondary'
								: 'btn-ghost'} drawer-button"
							href="{base}/about">About</a
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
					Last update <a href={latest_commit[0].html_url}
						>{new Date(latest_commit[0].commit.author.date)}</a
					>.
				</p>
			</div>
		</footer>
	</div>
	<div class="drawer-side">
		<label for="drawer" class="drawer-overlay" id="labelsidebar">close drawer</label>
		<ul class="menu w-80 gap-2 bg-base-100 p-4">
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a class="btn {$page.url.pathname === '/' ? 'btn-secondary' : 'btn-ghost'}" href="{base}/"
					>Search</a
				>
			</li>
			<li aria-current={$page.url.pathname === '/contributing' ? 'page' : undefined}>
				<a
					class="btn {$page.url.pathname === '/contributing' ? 'btn-secondary' : 'btn-ghost'}"
					href="{base}/contributing">Contribute</a
				>
			</li>
			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a
					class="btn {$page.url.pathname === '/about' ? 'btn-secondary' : 'btn-ghost'}"
					href="{base}/about">About</a
				>
			</li>
		</ul>
	</div>
</div>
