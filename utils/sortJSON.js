import fs from 'fs';

const filepath = 'src/lib/data/entries.json';

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

		const normalizedData = updatedData.map((entry) => {
			// Handle null/undefined periods
			if (entry.period === null || entry.period === undefined) {
				entry.period = [];
				return entry;
			}

			// Ensure period is an array (wrap single strings)
			let periodArray = Array.isArray(entry.period) ? entry.period : [entry.period];

			// Process each period value
			const processedPeriods = periodArray
				// Coerce items to strings but drop null/undefined
				.map((period) => (period != null ? String(period) : null))
				.filter((period) => period !== null)
				// Trim and lowercase each value
				.map((period) => period.toLowerCase().trim())
				// Filter out empty strings
				.filter((period) => period.length > 0)
				// Map special-case canonicalizations
				.map((period) => {
					switch (period) {
						case 'early modern':
							return 'early modern';
						default:
							return period;
					}
				});

			// Dedupe values (preserve uniqueness)
			const uniquePeriods = [...new Set(processedPeriods)];

			// Sort according to canonical era order
			const sortedPeriods = uniquePeriods.sort((a, b) => {
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

		// Write the sorted and amended JSON data back to the file
		try {
			const jsonString = JSON.stringify(normalizedData, null, 2);
			fs.writeFile(filepath, jsonString, (err) => {
				if (err) {
					console.error(`Error writing file: ${err.message}`);
					return;
				}
				console.log(
					`File "${filepath}" sorted, structured, and period values normalized successfully.`
				);
			});
		} catch (error) {
			console.error(`Error stringifying JSON data: ${error.message}`);
		}
	} catch (error) {
		console.error(`Error parsing JSON data: ${error.message}`);
	}
});
