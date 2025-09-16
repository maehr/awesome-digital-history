import fs from 'fs';

const filepath = 'src/lib/data/entries.json';

// Define allowed values for validation
const allowedValues = {
	region: [
		'africa',
		'asia',
		'austria',
		'europe',
		'france',
		'germany',
		'global',
		'great britain',
		'netherlands',
		'north america',
		'switzerland'
	],
	language: [
		'ar',
		'ca',
		'da',
		'de',
		'dendi',
		'en',
		'es',
		'fo',
		'fr',
		'ha',
		'hu',
		'is',
		'it',
		'jp',
		'kl',
		'lat',
		'lt',
		'mul',
		'nl',
		'no',
		'po',
		'pt',
		'rm',
		'ru',
		'se'
	],
	type: [
		'audiovisual sources',
		'books',
		'collection',
		'encyclopedias',
		'learning materials',
		'magazines',
		'manuscripts',
		'maps',
		'newspapers',
		'photos',
		'portal',
		'primary sources',
		'search engine',
		'sheet music',
		'statistics',
		'tools',
		'websites'
	],
	period: [
		'ancient',
		'classical',
		'medieval',
		'early modern',
		'modern',
		'contemporary',
		'prehistory'
	]
};

// Validation function
const validateFieldValues = (data) => {
	const errors = [];

	data.forEach((entry, index) => {
		Object.keys(allowedValues).forEach((field) => {
			if (entry[field] && Array.isArray(entry[field])) {
				entry[field].forEach((value) => {
					if (!allowedValues[field].includes(value)) {
						errors.push(`Entry ${index + 1} ("${entry.title}"): Invalid ${field} value "${value}"`);
					}
				});
			}
		});
	});

	return errors;
};

fs.readFile(filepath, 'utf-8', (err, data) => {
	if (err) {
		console.error(`Error reading file: ${err.message}`);
		return;
	}

	try {
		const jsonData = JSON.parse(data);
		const defaultStructure = {
			title: '',
			description: '',
			url: '',
			region: [],
			language: [],
			type: [],
			period: []
		};

		// Ensure all entries have the required structure
		const updatedData = jsonData.map((entry) => {
			return { ...defaultStructure, ...entry };
		});

		// Normalize period values with comprehensive edge case handling
		const canonicalEraOrder = [
			'ancient',
			'classical',
			'medieval',
			'early modern',
			'modern',
			'contemporary'
		];

		// Helper function to normalize string arrays
		const normalizeStringArray = (array, fieldName) => {
			if (array === null || array === undefined) {
				return [];
			}

			// Ensure it's an array (wrap single strings)
			let arrayValue = Array.isArray(array) ? array : [array];

			// Process each value
			const processedValues = arrayValue
				// Coerce items to strings but drop null/undefined
				.map((value) => (value != null ? String(value) : null))
				.filter((value) => value !== null)
				// Trim and lowercase each value
				.map((value) => value.toLowerCase().trim())
				// Filter out empty strings
				.filter((value) => value.length > 0)
				// Apply field-specific normalizations
				.map((value) => {
					if (fieldName === 'region') {
						// Region-specific normalizations
						switch (value) {
							case 'great britain':
								return 'great britain';
							case 'north america':
								return 'north america';
							default:
								return value;
						}
					} else if (fieldName === 'language') {
						// Language-specific normalizations (already lowercase)
						return value;
					} else if (fieldName === 'type') {
						// Type-specific normalizations
						switch (value) {
							case 'primary sources':
								return 'primary sources';
							case 'learning materials':
								return 'learning materials';
							case 'audiovisual sources':
								return 'audiovisual sources';
							case 'search engine':
								return 'search engine';
							case 'sheet music':
								return 'sheet music';
							default:
								return value;
						}
					} else if (fieldName === 'period') {
						// Period-specific normalizations
						switch (value) {
							case 'early modern':
								return 'early modern';
							default:
								return value;
						}
					}
					return value;
				});

			// Dedupe values (preserve uniqueness)
			const uniqueValues = [...new Set(processedValues)];

			// Sort values alphabetically for consistency
			return uniqueValues.sort();
		};

		const normalizedData = updatedData.map((entry) => {
			// Normalize each field
			entry.region = normalizeStringArray(entry.region, 'region');
			entry.language = normalizeStringArray(entry.language, 'language');
			entry.type = normalizeStringArray(entry.type, 'type');

			// Handle period with special sorting
			const processedPeriods = normalizeStringArray(entry.period, 'period');

			// Sort periods according to canonical era order
			const sortedPeriods = processedPeriods.sort((a, b) => {
				const indexA = canonicalEraOrder.indexOf(a);
				const indexB = canonicalEraOrder.indexOf(b);

				// Both are in canonical order
				if (indexA !== -1 && indexB !== -1) {
					return indexA - indexB;
				}
				// Only a is in canonical order
				if (indexA !== -1) {
					return -1;
				}
				// Only b is in canonical order
				if (indexB !== -1) {
					return 1;
				}
				// Neither is in canonical order, sort alphabetically
				return a.localeCompare(b);
			});

			entry.period = sortedPeriods;
			return entry;
		});

		// Sort the JSON array by the "title" field
		normalizedData.sort((a, b) => a.title.localeCompare(b.title));

		// Validate field values
		const validationErrors = validateFieldValues(normalizedData);
		if (validationErrors.length > 0) {
			console.warn('Validation warnings found:');
			validationErrors.forEach((error) => console.warn(`  - ${error}`));
		}

		// Write the sorted and amended JSON data back to the file
		try {
			const jsonString = JSON.stringify(normalizedData, null, 2);
			fs.writeFile(filepath, jsonString, (err) => {
				if (err) {
					console.error(`Error writing file: ${err.message}`);
					return;
				}
				console.log(
					`File "${filepath}" sorted, structured, and all field values normalized successfully.`
				);
			});
		} catch (error) {
			console.error(`Error stringifying JSON data: ${error.message}`);
		}
	} catch (error) {
		console.error(`Error parsing JSON data: ${error.message}`);
	}
});
