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

		// Normalize period values to consistent lowercase format
		const normalizedData = updatedData.map((entry) => {
			if (entry.period && Array.isArray(entry.period)) {
				entry.period = entry.period.map((period) => {
					// Normalize to lowercase and handle special cases
					const normalized = period.toLowerCase().trim();
					// Handle specific case mappings if needed
					switch (normalized) {
						case 'early modern':
							return 'early modern';
						default:
							return normalized;
					}
				});
			} else if (entry.period === null || entry.period === undefined) {
				// Ensure null/undefined periods become empty arrays
				entry.period = [];
			}
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
