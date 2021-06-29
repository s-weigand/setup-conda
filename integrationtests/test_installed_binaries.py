import sys

from .prepare_tests import run_cmd


def test_pandoc_installed():
    """Pandoc is callable from the shell"""
    returncode, stdout, stderr = run_cmd("pandoc -v")
    assert returncode == 0
    assert stdout.startswith(b"pandoc")
    assert stderr == b""

def test_garphviz_installed():
    """Graphviz is installed"""
    if sys.platform == "win32":
        returncode, stdout, stderr = run_cmd("dot.bat -V")
    else:
        returncode, stdout, stderr = run_cmd("dot -V")
    assert returncode == 0
    assert stdout == b""
    assert stderr.startswith(b"dot - graphviz version")

