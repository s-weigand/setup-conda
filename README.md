# setup-conda

[![Tests](https://github.com/s-weigand/setup-conda/workflows/Test/badge.svg)](https://github.com/s-weigand/setup-conda/actions)

This action sets up conda so it can be used in other actions, like you would in a terminal locally.

## Inputs

| Name             | Requirement | Description                                                                                                           |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `activate-conda` | _optional_  | Wether to activate the conda base env (`Default: true`)                                                               |
| `update-conda`   | _optional_  | If conda should be updated before running other commands (`Default: false`)                                           |
| `python-version` | _optional_  | Python version which should be installed with conda (`Default: 'default'`)                                            |
| `conda-channels` | _optional_  | Additional channels like 'conda-forge', as coma separated list, which can be used to install packages (`Default: ''`) |

# Usage

See [action.yml](action.yml)

## Basic:

```yaml
steps:
  - uses: actions/checkout@master
  - uses: s-weigand/setup-conda@master
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
      - uses: actions/checkout@master
      - name: Setup conda
        uses: s-weigand/setup-conda@master
        with:
          update-conda: true
          python-version: ${{ matrix.python-version }}
          conda-channels: anaconda, conda-forge
      - run: conda --version
      - run: which python
```
