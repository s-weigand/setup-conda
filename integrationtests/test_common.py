import os

from .prepare_tests import run_cmd


def test_conda_installed():
    """Conda is callable from the shell"""
    returncode, stdout, stderr = run_cmd("conda --version")
    assert returncode == 0
    assert stdout.startswith(b"conda")
    assert stderr == b""


# def test_conda_env_vars_set():
#     """Conda env_vars are set"""
#     assert "miniconda" in os.environ["CONDA_PREFIX"].lower()
#     assert "miniconda" in os.environ["CONDA_EXE"].lower()
#     assert "miniconda" in os.environ["CONDA_PYTHON_EXE"].lower()
#     assert os.environ["CONDA_SHLVL"] == 1
#     assert os.environ["CONDA_DEFAULT_ENV"] != ""
