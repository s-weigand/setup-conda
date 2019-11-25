# setup-conda

[![Tests](https://github.com/s-weigand/setup-conda/workflows/Test/badge.svg)](https://github.com/s-weigand/setup-conda/actions)

This action adds the [`conda`](https://conda.io/projects/conda/en/latest/user-guide/tasks/index.html)
command from the on the worker preinstalled miniconda version to the known shell commands.

## Inputs

| Name             | Requirement | Default     | Description                                                                                                                                                          |
| ---------------- | ----------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activate-conda` | _optional_  | `true`      | Wether to activate the conda base env.                                                                                                                               |
| `update-conda`   | _optional_  | `false`     | If conda should be updated before running other commands.                                                                                                            |
| `python-version` | _optional_  | `'default'` | Python version which should be installed with conda.                                                                                                                 |
| `conda-channels` | _optional_  | `''`        | Additional channels like 'conda-forge', as coma separated list, which can be used to install packages. The last channel in the list, will have the highest priority. |

# Usage

See [action.yml](action.yml)

## Basic:

The basic usage makes the conda python version the default python (`$ conda activate base`).

```yaml
steps:
  - uses: actions/checkout@master
  - uses: s-weigand/setup-conda@master
  - run: conda --version
  - run: which python
```

If don't want to change the python version which is used
(i.e. you just need to install a none python package), you can use `activate-conda: false`.

```yaml
steps:
  - uses: actions/checkout@master
  - name: Set up Python 3.8
    uses: actions/setup-python@v1
    with:
      python-version: 3.8
  - uses: s-weigand/setup-conda@master
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
