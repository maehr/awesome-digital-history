# Contribution Guidelines

Awesome Digital History is a community-maintained directory of digital history resources. Contributions are welcome: new entries, corrections, updates, and removals.

## Source of truth

- Canonical entries live in `entries/*.qmd`
- `README.md` and `index.qmd` are generated from those pages
- Screenshots live in `assets/screenshots/`

## Ways to contribute

You can propose changes through an issue or a pull request.

## Propose a change via an issue

1. Open the [issue tracker](https://github.com/maehr/awesome-digital-history/issues/).
2. Check for an existing discussion.
3. Use the relevant template.

[Add a resource](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=addition.md&title=)

[Update or correct an entry](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=change.md&title=)

[Remove an outdated entry](https://github.com/maehr/awesome-digital-history/issues/new?assignees=&labels=&template=removal.md&title=)

## Propose a change via a pull request

1. Fork the repository.
2. Run `npm install`.
3. Edit the relevant `entries/*.qmd` files and related docs.
4. Run the local checks.
5. Submit a pull request against `main`.

```bash
npm run validate
npm run generate
npm run check
```

If you changed source URLs or added entries, also run:

```bash
npm run screenshots
```

## What makes a good contribution?

- The resource is relevant to digital history research or teaching.
- The resource is accessible online.
- The metadata and short description are accurate.
- The entry is current, in scope, and worth maintaining.

## Code of Conduct

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Licensed under CC0 and AGPLv3.
