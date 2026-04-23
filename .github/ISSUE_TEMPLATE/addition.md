---
name: Addition
about: Request to add an item from the list
title: '[Addition]'
labels: 'awesome'
assignees: ''
---

**Item Details**

Please provide the following details about the item you want to add to the list:

```json
{
	"title": "",
	"description": "",
	"url": "",
	"region": [],
	"language": [],
	"type": [],
	"period": []
}
```

Use `data/entries.json` as the canonical reference for existing values.

Allowed values:

- `region`: `Africa`, `Asia`, `Austria`, `Europe`, `France`, `Germany`, `Global`, `Great Britain`, `Netherlands`, `North America`, `Switzerland`
- `language`: lowercase ISO-style codes already present in `data/entries.json`
- `type`: `audiovisual sources`, `books`, `collection`, `encyclopedias`, `learning materials`, `magazines`, `manuscripts`, `maps`, `newspapers`, `photos`, `portal`, `primary sources`, `search engine`, `sheet music`, `statistics`, `tools`, `websites`
- `period`: `prehistory`, `ancient`, `classical`, `medieval`, `early modern`, `modern`, `contemporary`

**Rationale for the addition**

Briefly explain why you think this item should be added to the list and how it fits the criteria for inclusion.

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
