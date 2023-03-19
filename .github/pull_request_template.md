## Pull Request

Add / Remove / Change `{entry name}` in `src/lib/data/entries.json`.

<!-- NOTE: Please do not skip the template -->

**Short pitch**

Describe why this change is made. Alternatively, refer to existing issues if any. You could try to answer:

- Why do you find this resource awesome?
- How do you use this resource in your workflow?
- What advantages / disadvantages does it have compared to {another resource}?

### Checklist

Please ensure that you have completed the following tasks:

- [ ] I have read and understood the [contribution guidelines](CONTRIBUTING.md).
- [ ] I have run `npm run prepare` to sort the entries in `src/lib/data/entries.json` alphabetically and to generate the `README.md` file.
- [ ] I have run `npm run format` to format the repository code.
- [ ] I have run `npm run awesome-lint` to ensure that the `README.md` file is formatted correctly.

### Criteria for accepting a pull request

_Contributors, please ensure that_:

- A **short pitch** is included in the pull request description.
- The addition you proposed is NOT part of [everything that did not make it into the list](https://github.com/maehr/awesome-digital-history/wiki).

_Maintainers, please ensure that_:

- The above criteria are followed.
- The tests pass on the CI.
- In the case of addition or removal, make an assessment of the awesomeness of the entry.

### Updating your PR

If the maintainers notice anything that needs to be changed, they will ask you to edit your PR before merging it. Please do not open a new PR, just edit the existing one. If you're not sure how to do that, [here is a guide](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md) on the different ways you can update your PR.

### Appendix: running lint tests

To run tests locally using Node.js, you need to install the dependencies first:

```bash
npm install
npm run prepare
```
