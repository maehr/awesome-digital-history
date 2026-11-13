# Agents

Automation notes for `awesome-digital-history`.

## Commands

```bash
# Generate README.md and index.qmd from entries
npm run generate
npm run generate:check # Fail if README.md is out of date. Writes nothing.

# Site
npm run build   # Validate, generate index.qmd, render _site
npm run preview
npm run clean

# Validation
npm run hooks:install # Install local prek commit hooks
npm run hooks:run     # Run prek hooks across all files
npm run validate
npm run lint
npm run awesome-lint
npm run commitlint    # Lint commit messages; pass -- --edit <file> or -- --last
npm run check         # generate:check, build, lint, awesome-lint

# Utilities
npm run changelog     # Print unreleased changelog entries with git-cliff
npm run screenshots   # Capture missing screenshots; -- --force --slug <slug> to recapture
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
section_label: Archives and primary sources|Learning|More Awesome # must match directory_section
screenshot: /assets/screenshots/<slug>.png # or <slug>-placeholder.png
screenshot_alt: string
image: same as screenshot
screenshot_hide: [css selectors] # optional; hides page elements in screenshots
```

`entries/_metadata.yml` sets the shared Quarto options for all entry pages.

## Contributions

- `CONTRIBUTING.md` is the only source for the contribution process.
- A new entry needs an Addition issue with the `approved` label.
- Do not submit an issue or a pull request without human review.

## Workflows

- `addition-check.yml`: closes non-collaborator pull requests that add an entry without an `approved` issue
- `commitlint.yml`: enforces Conventional Commits on push and pull request commits
- `greetings.yml`, `label.yml`, `stale.yml`: greet first-time contributors, label pull requests, mark inactive items
- `link-check.yml`: runs `lychee` against markdown and qmd files
- `prek.yml`: runs the `prek` hooks in CI (formatting, entry metadata, `README.md` drift, `awesome-lint`)
- `quarto-publish.yml`: runs `npm run check`, then deploys `_site` to GitHub Pages

## Quality Gates

- `npm run hooks:run`
- `npm run check`

## Commit Hooks

- Hook config: `.pre-commit-config.yaml`
- Install local hooks with `npm run hooks:install`
- Pre-commit hooks check formatting, entry metadata, whether `README.md` is current, and `awesome-lint`
- Commit messages must follow Conventional Commits and are checked by `commitlint`
