# Contribution Guidelines

Awesome Digital History is a community-maintained directory of digital history resources. Contributions are welcome: new entries, corrections, updates, and removals.

You do not need to know Git, GitHub pull requests, Node.js, or Quarto to suggest a change. The easiest path is to open an issue and provide the information you know. A maintainer can turn it into an entry.

Please read the [Editorial Policy](EDITORIAL_POLICY.md) before suggesting substantial additions or removals.

## Source of truth

- Canonical entries live in `entries/*.qmd`
- `README.md` and `index.qmd` are generated from those pages
- Screenshots live in `assets/screenshots/`

## Ways to contribute

You can propose changes through an issue or a pull request.

Use an issue if you want to suggest a resource, report an error, request a removal, or are not comfortable editing files.

Use a pull request if you want to edit the source files directly and run the local checks.

## Beginner path: open an issue

1. Open the [issue tracker](https://github.com/maehr/awesome-digital-history/issues/).
2. Check for an existing discussion.
3. Use the relevant template and fill in as many fields as you can.
4. If you do not know a controlled vocabulary value, leave a note in plain language.
5. Submit the issue. A maintainer can ask follow-up questions or convert the suggestion into an entry.

[Add a resource](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=addition.md&title=)

[Update or correct an entry](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=change.md&title=)

[Remove an outdated entry](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=removal.md&title=)

Useful information for a new resource suggestion:

- Title and URL.
- One-sentence description.
- Why it helps digital history research, teaching, or source discovery.
- Region, language, resource type, and historical period, if known.
- Use canonical BCP 47 language tags, for example `en`, `la`, `ddn`, or `mul`.
- Any access limits, reuse conditions, API, download option, or known caveat.

Example:

```yaml
title: Example Archive
external_url: https://example.org/
short_description: Search portal for digitized nineteenth-century newspapers from Exampleland.
directory_section: archives
regions: [Europe]
languages: [en]
resource_types: [newspapers, primary sources, search engine]
periods: [modern]
```

## Technical path: open a pull request

1. Fork the repository.
2. Run `npm install`.
3. Run `npm run hooks:install` to enable the local `prek` Git hooks.
4. Edit the relevant `entries/*.qmd` files and related docs.
5. Run the local checks.
6. Submit a pull request against `main`.

```bash
npm run hooks:run
npm run validate
npm run generate
npm run check
```

Commits must use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat: add archive entry` or `fix: update broken source URL`. The `commit-msg` hook runs `commitlint`, and pull requests are checked again in GitHub Actions.

If you changed source URLs or added entries, also run:

```bash
npm run screenshots
```

## What makes a good contribution?

- The resource is relevant to digital history research or teaching.
- The resource is accessible online.
- The metadata and short description are accurate.
- The entry is current, in scope, and worth maintaining.
- Any AI-assisted text has been checked against the source website.
- Provenance fields are filled in conservatively and do not claim review or authorship that cannot be verified.

## Maintainer checklist

When turning an issue into an entry, maintainers should:

- Check the resource against the [Editorial Policy](EDITORIAL_POLICY.md).
- Verify the title, URL, description, and controlled vocabulary values.
- Add or update the relevant `entries/*.qmd` file.
- Fill `date_added`, `reviewed_at`, `reviewed_by`, `authors`, and `contributors` as accurately as possible.
- Generate or refresh the screenshot when the URL changes or a new entry is added.
- Run `npm run hooks:run`, `npm run validate`, `npm run generate`, and `npm run check` before merging where practical.

## Code of Conduct

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Licensed under CC0 and AGPLv3.
