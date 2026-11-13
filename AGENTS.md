# Agents

Automation notes for `awesome-digital-history`.

## Commands

```bash
# Generate README.md and index.qmd from entries
npm run generate
npm run generate:check # Fail if README.md is out of date. Writes nothing.

# Build site
npm run site:build

# Local preview
npm run preview

# Validation
npm run hooks:install # Install local prek commit hooks
npm run hooks:run     # Run prek hooks across all files
npm run validate
npm run lint
npm run awesome-lint
npm run commitlint    # Lint commit messages; pass -- --edit <file> or -- --last
npm run check

# Utilities
npm run changelog       # Generate data changelog locally using git-cliff

# Screenshots
npm run screenshots
```

## Canonical Source

- Source of truth: `entries/*.qmd`
- Generated: `README.md` (tracked), `index.qmd` (ignored)
- Do not edit generated files by hand.
- After an entry change, run `npm run generate` and commit `README.md` with the entry.
- Checks and hooks do not write `README.md`. They fail if it is out of date.
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
    Africa|Asia|Austria|Europe|France|Germany|Global|Great Britain|Latin America|Netherlands|North America|Oceania|Switzerland
  ]
languages: [canonical BCP 47 tag]
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

## Contributions

- `CONTRIBUTING.md` is the only source for the contribution process.
- A new entry needs an Addition issue with the `approved` label.
- Do not submit an issue or a pull request without human review.

## Workflows

- `addition-check.yml`: closes non-collaborator pull requests that add an entry without an `approved` issue
- `awesome-lint.yml`: checks that `README.md` is current, then runs `awesome-lint`
- `changelog.yml`: writes unreleased changelog entries to the job summary
- `commitlint.yml`: enforces Conventional Commits on push and pull request commits
- `greetings.yml`, `label.yml`, `stale.yml`: greet first-time contributors, label pull requests, mark inactive items
- `link-check.yml`: runs `lychee` against markdown and qmd files
- `prek.yml`: runs configured `prek` hooks in CI
- `quarto-publish.yml`: validates, renders, and deploys `_site` to GitHub Pages

## Quality Gates

- `npm run generate:check`
- `npm run validate`
- `npm run lint`
- `npm run awesome-lint`
- `npm run hooks:run`
- `npm run site:build`

## Commit Hooks

- Hook config: `.pre-commit-config.yaml`
- Install local hooks with `npm run hooks:install`
- Pre-commit hooks check formatting, entry metadata, whether `README.md` is current, and `awesome-lint`
- Commit messages must follow Conventional Commits and are checked by `commitlint`
