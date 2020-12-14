# setup-conda

[![Tests](https://github.com/s-weigand/setup-conda/workflows/Tests/badge.svg)](https://github.com/s-weigand/setup-conda/actions)
[![All Contributors](https://img.shields.io/github/all-contributors/s-weigand/setup-conda)](#contributors-)

This action adds the [`conda`](https://conda.io/projects/conda/en/latest/user-guide/tasks/index.html)
command from the on the worker preinstalled miniconda version to the known shell commands.

:warning:
The usage directly from master (`s-weigand/setup-conda@master`) was be deprecated on 2020-10-01,
use tagged versions instead (i.e. `s-weigand/setup-conda@v1`). This is to ensure that breaking changes in this action, won't break users workflows.

## Inputs

| Name             | Requirement | Default     | Description                                                                                                                                                          |
| ---------------- | ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activate-conda` | _optional_  | `true`      | Whether to activate the conda base env.                                                                                                                               |
| `update-conda`   | _optional_  | `false`     | If conda should be updated before running other commands.                                                                                                            |
| `python-version` | _optional_  | `'default'` | Python version which should be installed with conda.                                                                                                                 |
| `conda-channels` | _optional_  | `''`        | Additional channels like 'conda-forge', as coma separated list, which can be used to install packages. The last channel in the list, will have the highest priority. |

# Usage

See [action.yml](action.yml)

## Basic:

The basic usage makes the conda python version the default python (`$ conda activate base`).

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: s-weigand/setup-conda@v1
  - run: conda --version
  - run: which python
```

If don't want to change the python version which is used
(i.e. you just need to install a none python package), you can use `activate-conda: false`.

```yaml
steps:
  - uses: actions/checkout@v2
  - name: Set up Python 3.8
    uses: actions/setup-python@v1
    with:
      python-version: 3.8
  - uses: s-weigand/setup-conda@v1
    with:
      activate-conda: false
  - run: conda --version
  - run: which python
```

## Matrix Testing:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        python-version: [3.6, 3.7, 3.8]
    name: Python ${{ matrix.python-version }} example
    steps:
      - uses: actions/checkout@v2
      - name: Setup conda
        uses: s-weigand/setup-conda@v1
        with:
          update-conda: true
          python-version: ${{ matrix.python-version }}
          conda-channels: anaconda, conda-forge
      - run: conda --version
      - run: which python
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/s-weigand"><img src="https://avatars2.githubusercontent.com/u/9513634?v=4" width="100px;" alt=""/><br /><sub><b>Sebastian Weigand</b></sub></a><br /><a href="https://github.com/s-weigand/setup-conda/commits?author=s-weigand" title="Code">💻</a> <a href="#ideas-s-weigand" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-s-weigand" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-s-weigand" title="Maintenance">🚧</a> <a href="https://github.com/s-weigand/setup-conda/commits?author=s-weigand" title="Tests">⚠️</a> <a href="https://github.com/s-weigand/setup-conda/pulls?q=is%3Apr+reviewed-by%3As-weigand" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://santi.uy"><img src="https://avatars3.githubusercontent.com/u/3905501?v=4" width="100px;" alt=""/><br /><sub><b>Santiago Castro</b></sub></a><br /><a href="https://github.com/s-weigand/setup-conda/commits?author=bryant1410" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
