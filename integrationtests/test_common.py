from .prepare_tests import run_cmd


def test_conda_installed():
    """Conda is callable from the shell"""
    returncode, stdout, stderr = run_cmd("conda --version")
    assert returncode == 0
    assert stdout.startswith(b"conda")
    assert stderr == b""
