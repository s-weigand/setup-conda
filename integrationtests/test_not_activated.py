import sys

from .prepare_tests import read_initial_settings


def test_python_not_changed():
    """Same python as initially"""
    initial_settings = read_initial_settings()
    assert initial_settings["executable"] == sys.executable
    assert initial_settings["version_info"] == str(sys.version_info)
