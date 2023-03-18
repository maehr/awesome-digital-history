Add / Remove / Edit {entry name} to/from `src/lib/data/entries.json`.

<!-- NOTE: Please do not skip the template -->

**Short pitch**

Describe why this change is made. Alternatively, refer to existing issues if
any. You could try to answer:

- Why do / don't you find this ressource awesome?
- How do you use this ressource in your workflow?
- What advantages / disadvantages does it have compared to {another ressource}?

## Checklist

- [ ] I have read and understood the [contribution guidelines](CONTRIBUTING.md).
- [ ] I have run `npm run prepare` to sort the entries in `src/lib/data/entries.json` alphabetically, to generate the README.md file and to pass all tests.

## Criteria for accepting a pull-request

_Contributors, make sure that_:

- a **short pitch** is included in the pull-request description,
- The addition you proposed is NOT part of [everything that did not make it into the list](https://github.com/maehr/awesome-digital-history/wiki).

Thank you for your suggestions!

_Maintainers, make sure that_:

- the above criteria are followed,
- the tests pass on the CI,
- in case of addition or removal, make an assessment of
  awesomeness of the entry.

## Updating your PR

A lot of times, making a PR adhere to the standards above can be difficult.
If the maintainers notice anything that we'd like changed, we'll ask you to
edit your PR before we merge it. There's no need to open a new PR, just edit
the existing one. If you're not sure how to do that,
[here is a guide](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md)
on the different ways you can update your PR so that we can merge it.

## Appendix: running lint tests

To run tests locally using ruby:

```bash
gem install awesome_bot
awesome_bot README.md
```

To run tests locally using node:

```bash
npm install -g awesome-lint
awesome-lint README.md
```
