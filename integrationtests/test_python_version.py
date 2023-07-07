import os
import sys

import pytest

from .prepare_tests import read_initial_settings


@pytest.mark.skipif("NOT_ACTIVATED" not in os.environ, reason="Conda python is used")
def test_python_not_changed():
    """Same python as initially"""
    initial_settings = read_initial_settings()
    assert initial_settings["executable"] == sys.executable
    assert initial_settings["version_info"] == str(sys.version_info)


@pytest.mark.skipif("NOT_ACTIVATED" in os.environ, reason="Conda python is not used")
def test_python_from_conda():
    """Same python if from conda"""
    initial_settings = read_initial_settings()
    assert initial_settings["executable"] != sys.executable
    assert "miniconda" in sys.executable.lower()


@pytest.mark.skipif("ENV_PYTHON" not in os.environ, reason="Not a conda custom python")
def test_custom_python_from_conda():
    """Same python if from conda"""
    assert sys.version.startswith(os.environ["ENV_PYTHON"])


@pytest.mark.skipif("PYPY_TEST" not in os.environ, reason="Not a pypy test")
def test_pypy_from_conda():
    """Installed python version is PyPy"""
    assert sys.version.splitlines()[1].startswith("[PyPy")
