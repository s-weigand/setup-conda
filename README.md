# setup-conda

[![](https://github.com/s-weigand/setup-conda/workflows/Test/badge.svg)](https://github.com/s-weigand/setup-conda/actions)

This action sets up conda so it can be used in other actions, like you would in a terminal locally.

## Inputs

| Name             | Requirement | Description                                                                                  |
| ---------------- | ----------- | -------------------------------------------------------------------------------------------- |
| `update-conda`   | _optional_  | If conda should be updated before running other commands (`Default: false`)                  |
| `python-version` | _optional_  | Python version which should be installed with conda (`Default: 'default'`)                   |
| `conda-channels` | _optional_  | Additional channels like 'conda-forge' which can be used to install packages (`Default: ''`) |

# Usage

See [action.yml](action.yml)

Basic:

```yaml
steps:
  - uses: actions/checkout@master
  - uses: s-weigand/setup-conda@v1
  - run: conda --version
  - run: which python
```

Matrix Testing:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
    name: Python ${{ matrix.python-version }} sample
    steps:
      - uses: actions/checkout@master
      - name: Setup conda
        uses: s-weigand/setup-conda@v1
        with:
          update-conda: true
          python-version: 3.6
          conda-channels: anaconda, conda-forge
      - run: conda --version
      - run: which python
```
