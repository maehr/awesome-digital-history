function normalise(value) {
	return String(value || '')
		.toLowerCase()
		.trim();
}

function shuffleCards(cards) {
	const copy = [...cards];
	for (let index = copy.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		const current = copy[index];
		copy[index] = copy[swapIndex];
		copy[swapIndex] = current;
	}
	return copy;
}

function applyFilters() {
	const grid = document.querySelector('[data-entry-grid]');
	if (!grid) {
		return;
	}

	const cards = [...grid.querySelectorAll('[data-entry-card]')];
	const search = normalise(document.querySelector('[data-filter-search]')?.value);
	const section = normalise(document.querySelector('[data-filter-section]')?.value);
	const region = normalise(document.querySelector('[data-filter-region]')?.value);
	const type = normalise(document.querySelector('[data-filter-type]')?.value);
	const language = normalise(document.querySelector('[data-filter-language]')?.value);

	let visible = 0;
	for (const card of cards) {
		const haystack = normalise(card.dataset.search);
		const matchesSearch = !search || haystack.includes(search);
		const matchesSection = !section || normalise(card.dataset.section) === section;
		const matchesRegion = !region || normalise(card.dataset.region).split('|').includes(region);
		const matchesType = !type || normalise(card.dataset.type).split('|').includes(type);
		const matchesLanguage =
			!language || normalise(card.dataset.language).split('|').includes(language);

		const show = matchesSearch && matchesSection && matchesRegion && matchesType && matchesLanguage;
		card.hidden = !show;
		if (show) {
			visible += 1;
		}
	}

	const count = document.querySelector('[data-result-count]');
	if (count) {
		count.textContent = `${visible} entries`;
	}
	grid.dataset.randomized = 'filtered';
}

function randomizeInitialOrder() {
	const grid = document.querySelector('[data-entry-grid]');
	if (!grid || grid.dataset.randomized) {
		return;
	}
	const cards = [...grid.querySelectorAll('[data-entry-card]')];
	for (const card of shuffleCards(cards)) {
		grid.append(card);
	}
	grid.dataset.randomized = 'true';
}

window.addEventListener('DOMContentLoaded', () => {
	randomizeInitialOrder();
	for (const control of document.querySelectorAll('[data-entry-filter]')) {
		control.addEventListener('input', applyFilters);
		control.addEventListener('change', applyFilters);
	}
	applyFilters();
});
