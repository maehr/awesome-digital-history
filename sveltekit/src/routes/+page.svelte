<script>
	let entries = [
		{
			title: 'String',
			url: 'String',
			description: 'String',
			region: ['String'],
			language: ['ISO 639-2 code'],
			collection_completed: false,
			type: [
				'audiovisual-sources',
				'books',
				'photos',
				'maps-geodata',
				'learning-resource',
				'encyclopaedia',
				'manuscripts',
				'primary-sources',
				'statistics-time-series',
				'search-engine',
				'archived-websites',
				'scientific-tools',
				'newspapers',
				'magazines'
			],
			access: ['on-demand', 'open-access', 'offline', 'online'],
			reusability: ['copyright', 'creative-commons', 'public-domain-c-0'],
			period: [
				'contemporary-history',
				'modern-times',
				'middle-ages',
				'antiquity',
				'pre-and-early-history'
			]
		},
		{
			title: 'Test Titel',
			url: 'https://www.google.com',
			description: 'Some description',
			region: ['Global', 'Europe'],
			language: ['ISO 639-2 code'],
			collection_completed: false,
			type: [
				'audiovisual-sources',
				'books',
				'photos',
				'maps-geodata',
				'learning-resource',
				'encyclopaedia',
				'manuscripts',
				'primary-sources',
				'statistics-time-series',
				'search-engine',
				'archived-websites',
				'scientific-tools',
				'newspapers',
				'magazines'
			],
			access: ['on-demand', 'open-access', 'offline', 'online'],
			reusability: ['copyright', 'creative-commons', 'public-domain-c-0'],
			period: [
				'contemporary-history',
				'modern-times',
				'middle-ages',
				'antiquity',
				'pre-and-early-history'
			]
		}
	];
</script>

<div class="grid grid-cols-4 gap-4">
	{#each entries as entry, i}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{entry.title}</h2>
				<p>{entry.description}</p>
				<div class="card-actions justify-end">
					<button class="btn btn-primary">{entry.url}</button>
				</div>
				<p>{entry.region}</p>
				<p>{entry.language}</p>
				<p>{entry.collection_completed}</p>
				<p>{entry.type}</p>
				<p>{entry.access}</p>
				<p>{entry.reusability}</p>
				<p>{entry.period}</p>
			</div>
		</div>
	{/each}
</div>
