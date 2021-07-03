import os

from .prepare_tests import run_cmd


def test_conda_installed():
    """Conda is callable from the shell"""
    returncode, stdout, stderr = run_cmd("conda --version")
    assert returncode == 0
    assert stdout.startswith(b"conda")
    assert stderr == b""


def test_conda_channels():
    """Conda channels are added in order"""
    returncode, stdout, stderr = run_cmd(" conda config --show channels")
    expected = os.environ["CONDA_CHANNELS"].split(",")
    channel_list = stdout.decode().partition(":")[2].split(" - ")
    channel_list = [channel.strip() for channel in channel_list]
    channel_list.remove("")

    assert returncode == 0
    assert channel_list == expected
    assert stderr == b""


def test_conda_env_vars_set():
    """Conda env_vars are set"""
    assert "miniconda" in os.environ["CONDA_PREFIX"].lower()
    assert "miniconda" in os.environ["CONDA_EXE"].lower()
    assert "miniconda" in os.environ["CONDA_PYTHON_EXE"].lower()
    assert int(os.environ["CONDA_SHLVL"]) >= 1
    assert os.environ["CONDA_DEFAULT_ENV"] != ""
