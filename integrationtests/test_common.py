import subprocess


def test_conda_installed():
    """Conda is callable from the shell"""
    output = subprocess.Popen(
        "conda --version", stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True
    )
    assert output.returncode == 0
    assert output.stdout.startswith(b"conda")
    assert output.stderr == b""
