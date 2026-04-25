# Agents

Automation notes for `awesome-digital-history`.

## Commands

```bash
# Build site + generated files
npm run site:build

# Local preview
npm run preview

# Validation
npm run validate
npm run lint
npm run awesome-lint
npm run check

# Screenshots
npm run screenshots
```

## Canonical Source

- Source of truth: `entries/*.qmd`
- Generated: `README.md`, `index.qmd`
- Screenshots: `assets/screenshots/*.png`

## Entry Shape

Each entry page uses frontmatter plus a short body under `## Why it matters`.

```yaml
title: string
slug: string
external_url: https://example.org/
short_description: short awesome-list description.
description: SEO meta description.
directory_section: archives|learning|more-awesome
regions:
  [
    Africa|Asia|Austria|Europe|France|Germany|Global|Great Britain|Netherlands|North America|Switzerland
  ]
languages: [ISO-style code]
resource_types:
  [
    audiovisual sources|books|collection|encyclopedias|learning materials|magazines|manuscripts|maps|newspapers|photos|portal|primary sources|search engine|sheet music|statistics|tools|websites
  ]
periods: [prehistory|ancient|classical|medieval|early modern|modern|contemporary]
date_added: YYYY-MM-DD
reviewed_at: YYYY-MM-DD|null
reviewed_by: [strings]
authors: [strings]
contributors: [strings]
screenshot: /assets/screenshots/<slug>.png
```

## Workflows

- `awesome-lint.yml`: regenerates `README.md`, then runs `awesome-lint`
- `link-check.yml`: runs `lychee` against markdown and qmd files
- `quarto-publish.yml`: validates, renders, and deploys `_site` to GitHub Pages

## Quality Gates

- `npm run validate`
- `npm run lint`
- `npm run awesome-lint`
- `npm run site:build`
