function normalise(value) {
	return String(value || '')
		.toLowerCase()
		.trim();
}

const FILTER_NAMES = ['search', 'section', 'region', 'type', 'language', 'period'];

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

function filterControl(name) {
	return document.querySelector(`[data-filter-${name}]`);
}

function activeFilterState() {
	const state = new Map();
	for (const name of FILTER_NAMES) {
		const control = filterControl(name);
		const value = control?.value.trim() || '';
		if (value) {
			state.set(name, value);
		}
	}
	return state;
}

function updateFilterUrl() {
	if (!document.querySelector('[data-entry-grid]')) {
		return;
	}

	const params = new URLSearchParams();
	for (const [name, value] of activeFilterState()) {
		params.set(name, value);
	}

	const query = params.toString();
	const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
	window.history.replaceState(null, '', nextUrl);
}

function restoreFiltersFromUrl() {
	const params = new URLSearchParams(window.location.search);
	for (const name of FILTER_NAMES) {
		const control = filterControl(name);
		if (control) {
			control.value = params.get(name) || '';
		}
	}
}

function resetFilters() {
	for (const control of document.querySelectorAll('[data-entry-filter]')) {
		control.value = '';
	}
}

function applyFilters({ updateUrl = true } = {}) {
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
	const period = normalise(document.querySelector('[data-filter-period]')?.value);

	let visible = 0;
	for (const card of cards) {
		const haystack = normalise(card.dataset.search);
		const matchesSearch = !search || haystack.includes(search);
		const matchesSection = !section || normalise(card.dataset.section) === section;
		const matchesRegion = !region || normalise(card.dataset.region).split('|').includes(region);
		const matchesType = !type || normalise(card.dataset.type).split('|').includes(type);
		const matchesLanguage =
			!language || normalise(card.dataset.language).split('|').includes(language);
		const matchesPeriod = !period || normalise(card.dataset.period).split('|').includes(period);

		const show =
			matchesSearch &&
			matchesSection &&
			matchesRegion &&
			matchesType &&
			matchesLanguage &&
			matchesPeriod;
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

	if (updateUrl) {
		updateFilterUrl();
	}
}

function applySingleFilter(name, value) {
	const control = filterControl(name);
	if (!control) {
		return;
	}
	resetFilters();
	control.value = value;
	applyFilters();
	control.focus();
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
	restoreFiltersFromUrl();
	for (const control of document.querySelectorAll('[data-entry-filter]')) {
		control.addEventListener('input', applyFilters);
		control.addEventListener('change', applyFilters);
	}
	document.addEventListener('click', (event) => {
		const chip = event.target.closest('[data-filter-chip]');
		if (!chip) {
			return;
		}
		if (!document.querySelector('[data-entry-grid]')) {
			return;
		}
		event.preventDefault();
		applySingleFilter(chip.dataset.filterChip, chip.dataset.filterValue || '');
	});
	applyFilters({ updateUrl: false });
});

window.addEventListener('popstate', () => {
	restoreFiltersFromUrl();
	applyFilters({ updateUrl: false });
});
